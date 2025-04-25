/*
import Editor from "../editor.ts"

function batchReplaceModules(this: Editor, moduleList: ModuleProps[]) {
  const moduleMap = this.batchCreate(moduleList)

  moduleMap.forEach((module) => {
    console.log(this.moduleMap)
    this.moduleMap.set(module.id, module)
  })

  this.render()
  this.events.onModulesUpdated?.(this.moduleMap)
  this.render()
}

export default batchReplaceModules*/
