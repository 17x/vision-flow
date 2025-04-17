import Editor from '../editor'
import deepClone from '../../../utilities/deepClone.ts'
import Rectangle from '../../core/modules/shapes/rectangle.ts'
import Ellipse, {EllipseProps} from '../../core/modules/shapes/ellipse.ts'

export function batchCreate(this: Editor, moduleDataList: ModuleProps[]): ModuleMap {
  const clonedData = deepClone(moduleDataList) as ModuleProps[]
  const newMap: ModuleMap = new Map()
  let localMaxLayer = 0

  const create = (data: ModuleProps) => {
    if (!data.id) {
      data.id = this.createModuleId
    }

    if (isNaN(data.layer)) {
      const maxFromModuleMap = this.getMaxLayerIndex

      localMaxLayer = Math.max(localMaxLayer, maxFromModuleMap)
      localMaxLayer++

      data.layer = localMaxLayer
    }

    if (data.type === 'rectangle') {
      return new Rectangle(data)
    }

    if (data.type === 'ellipse') {
      return new Ellipse(data as EllipseProps)
    }
  }

  clonedData.forEach(data => {
    const module = create.call(this, data)

    newMap.set(data.id, module as ModuleInstance)
  })

  return newMap
}

export function batchAdd(this: Editor, modules: ModuleMap): ModuleMap {
  modules.forEach(mod => {
    this.moduleMap.set(mod.id, mod)
  })

  // this.events.onModulesUpdated?.(this.moduleMap)

  return modules
}

type BatchCopyFn = <T extends boolean>(this: Editor, idSet: Set<UID>, includeIdentifiers: T) => T extends true ? ModuleProps[] : Omit<ModuleProps, 'id' & 'layer'>[]

export const batchCopy: BatchCopyFn = function (this, idSet, includeIdentifiers) {
  const modulesMap: ModuleMap = new Map()
  const moduleArr: ModuleInstance[] = []

  idSet.forEach(id => {
    const mod = this.moduleMap.get(id)
    if (mod) {
      moduleArr.push(mod)
      modulesMap.set(id, mod)
    }
  })

  moduleArr.sort((a, b) => a.layer - b.layer)

  return moduleArr.map(mod => mod.getDetails(includeIdentifiers))
}

export function batchDelete(this: Editor, idSet: Set<UID>): ModuleProps[] {
  const backup: ModuleProps[] = this.batchCopy(idSet)

  backup.forEach(module => {
    this.moduleMap.delete(module.id)
  })

  // this.events.onModulesUpdated?.(this.moduleMap)

  return backup
}

export function batchMove(this: Editor, from: Set<UID>, delta: Point) {
  const modulesMap: ModuleMap = this.getModulesByIdSet(from)

  modulesMap.forEach((module: ModuleInstance) => {
    module.x += delta.x
    module.y += delta.y
  })
}

export function batchModify(this: Editor, idSet: Set<UID>, data: Partial<ModuleProps>) {
  const modulesMap = this.getModulesByIdSet(idSet)

  modulesMap.forEach((module: ModuleInstance) => {
    Object.keys(data).forEach((key) => {
      const keyName = key as keyof ModuleProps
      module[keyName] = data[key]
    })
  })
}
