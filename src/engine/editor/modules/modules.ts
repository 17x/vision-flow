import Editor from '../editor'
import {HistoryOperationType} from '../history/type'
import typeCheck from '../../../utilities/typeCheck.ts'
import deepClone from '../../../utilities/deepClone.ts'
import Rectangle from '../../core/modules/shapes/rectangle.ts'
import Connector from '../../core/modules/connectors/connector.ts'

export function batchCreate(this: Editor, moduleDataList: ModuleProps[]): ModuleMap {
  const clonedData = deepClone(moduleDataList) as ModuleProps[]
  const newMap: ModuleMap = new Map()
  const create = (data: ModuleProps) => {
    if (!data.id) {
      data.id = this.createModuleId
    }

    if (data.type === 'rectangle') {
      return new Rectangle(data)
    }
    if (data.type === 'connector') {
      return new Connector(data)
    }
  }

  clonedData.forEach(data => {
    const module = create.call(this, data)

    newMap.set(data.id, module as ModuleType)
  })

  return newMap
}

export function batchAdd(this: Editor, modules: ModuleMap, historyCode?: Extract<HistoryOperationType, 'history-add' | 'history-paste' | 'history-duplicate'>) {
  console.log(modules)
  modules.forEach(mod => {
    this.moduleMap.set(mod.id, mod)
  })

  this.updateVisibleModuleMap(this.viewport.worldRect)
  this.events.onModulesUpdated?.(this.moduleMap)

  this.render()

  if (historyCode) {
    const moduleProps = [...modules.values()].map(mod => mod.getDetails())
    this.selectionManager.getSelected()

    this.history.add({
        type: historyCode,
        payload: {
          modules: moduleProps,
          selectedModules: this.selectionManager.getSelected(),
        },
      },
    )
  }
}

export function batchCopy(this: Editor, from: 'all' | Set<UID>, removeId = false, addOn?: {
  string: unknown
}): ModuleProps[] {
  const result: ModuleProps[] = []
  let modulesMap: ModuleMap = new Map()

  if (from === 'all') {
    modulesMap = this.moduleMap
  } else if (typeCheck(from) === 'set') {
    from.forEach(id => {
      const mod = this.moduleMap.get(id)
      if (mod) {
        modulesMap.set(id, mod)
      }
    })
  }

  modulesMap.forEach(mod => {
    const data: ModuleProps = mod.getDetails()

    if (removeId) {
      delete data.id
    }

    if (typeCheck(addOn) === 'object') {
      Object.assign(data, addOn)
    }

    result.push(data)
  })

  return result
}

export function batchDelete(this: Editor, from: 'all' | Set<UID>, historyCode?: Extract<HistoryOperationType, 'history-delete'>) {
  let backup: ModuleProps[] = []

  if (from === 'all') {
    backup = this.batchCopy('all')
    this.moduleMap.clear()
  } else if (typeCheck(from) === 'set') {
    backup = this.batchCopy(from)
    backup.forEach(module => {
      this.moduleMap.delete(module.id)
    })
  }

  if (historyCode) {
    this.history.add({
      type: 'history-delete',
      payload: {
        modules: backup,
        selectedModules: this.selectionManager.getSelected(),
      },
    })
  }

  this.updateVisibleModuleMap(this.viewport.worldRect)
  this.render()
  this.events.onModulesUpdated?.(this.moduleMap)

  return backup
}

export function batchMove(this: Editor, from: 'all' | Set<UID>, delta: Point, historyCode?: Extract<HistoryOperationType, 'history-move'>) {
  let modulesMap: ModuleMap | null = null

  if (from === 'all') {
    modulesMap = this.moduleMap
  } else if (typeCheck(from) === 'set') {
    modulesMap = this.getModulesByIdSet(from)
  } else {
    return false
  }

  modulesMap.forEach((module: ModuleProps) => {
    module.x += delta.x
    module.y += delta.y
  })

  this.render()
  this.events.onModulesUpdated?.(this.moduleMap)
  this.events.onSelectionUpdated?.(this.selectionManager.selectedModules, this.selectionManager.getIfUnique())

  if (historyCode) {
    this.history.add({
      type: 'history-move',
      payload: {
        delta,
        selectedModules: from,
      },

    })
  }
}

export function batchModify(this: Editor, from: 'all' | Set<UID>, data: Partial<ModuleProps>, historyCode?: HistoryOperationType) {
  let modulesMap = null

  if (from === 'all') {
    modulesMap = this.moduleMap
  } else if (typeCheck(from) === 'set') {
    modulesMap = this.getModulesByIdSet(from)
  } else {
    return false
  }

  modulesMap.forEach((module: ModuleProps) => {
    Object.keys(data).forEach((key) => {
      const value = data[key]

      if (typeof value === 'string' || typeof value === 'number') {
        module[key] = value
      }
    })
  })

  // this.selectionManager.render()
  this.render()
  this.events.onModulesUpdated?.(this.moduleMap)
  this.events.onSelectionUpdated?.(this.selectionManager.selectedModules, this.selectionManager.getIfUnique())

  if (historyCode) {
    /*this.history.add({
      type: 'modify',
      payload: {
        changes:{},
        selectedModules: this.selectionManager.getSelected(),
      },
    })*/
  }
}
