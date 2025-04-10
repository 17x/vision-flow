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

export function batchAdd(this: Editor, modules: ModuleMap): ModuleMap {
  modules.forEach(mod => {
    this.moduleMap.set(mod.id, mod)
  })

  this.events.onModulesUpdated?.(this.moduleMap)

  return modules
}

export function batchCopy(this: Editor, from: Set<UID>, removeId = false, addOn?: {
  string: unknown
}): ModuleProps[] {
  const result: ModuleProps[] = []
  const modulesMap: ModuleMap = new Map()

  from.forEach(id => {
    const mod = this.moduleMap.get(id)
    if (mod) {
      modulesMap.set(id, mod)
    }
  })

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

export function batchDelete(this: Editor, from: Set<UID>): ModuleProps[] {
  const backup: ModuleProps[] = this.batchCopy(from)

  backup.forEach(module => {
    this.moduleMap.delete(module.id)
  })

  return backup
}

export function batchMove(this: Editor, from: Set<UID>, delta: Point) {
  const modulesMap: ModuleMap = this.getModulesByIdSet(from)

  modulesMap.forEach((module: ModuleProps) => {
    module.x += delta.x
    module.y += delta.y
  })

  // this.events.onModulesUpdated?.(this.moduleMap)
  // this.events.onSelectionUpdated?.(this.selectedModules, this.getIfUnique())
}

export function batchModify(this: Editor, from: Set<UID>, data: Partial<ModuleProps>, historyCode?: HistoryOperationType) {
  const modulesMap = this.getModulesByIdSet(from)

  modulesMap.forEach((module: ModuleProps) => {
    Object.keys(data).forEach((key) => {
      module[key] = data[key]
      // const value = data[key]
      // if (typeof value === 'string' || typeof value === 'number') {
      // }
    })
  })

  // this.render()
  // this.events.onModulesUpdated?.(this.moduleMap)
  // this.events.onSelectionUpdated?.(this.selectedModules, this.getIfUnique())

  if (historyCode) {
    /*this.history.add({
      type: 'modify',
      payload: {
        changes:{},
        selectedModules: this.getSelected(),
      },
    })*/
  }
}
