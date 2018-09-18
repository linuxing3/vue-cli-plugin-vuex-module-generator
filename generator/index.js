const fs = require('fs')
const path = require('path')

module.exports = (api, options, rootOptions) => {
  // 安装依赖包
  api.extendPackage({
    "dependencies": {
      "nedb": "^1.8.0",
      "nedb-promise": "^2.0.1"
    },
    "devDependencies": {
      "@types/nedb": "^1.8.5"
    }
  })
  
  // 拷贝模板
  const { moduleName, storeRootDir } = options
  const templatesRoot = './templates'
  
  const moduleDirPath = path.join(storeRootDir, moduleName)
  const storeRootPath = path.join(storeRootDir, 'index.js')
  // api dir
  const apiPath = path.join(storeRootDir, "api")


  // 如果模块已存在，直接退出Abort if module already exists
  if (fs.existsSync(moduleDirPath)) {
    console.warn(`Module ${moduleName} exists`)
    return
  }
  
  // 所有文件
  const files = {}

  // 存储器根目录 Store root directory
  if (!fs.existsSync(storeRootPath)) {
    files[storeRootPath] = `${templatesRoot}/index.js`
  }

  // 存储器模块的模板文件 Modules templates
  ['index', 'actions', 'mutations', 'getters'].forEach(template => {
    const fileName = `${template}.js`
    const filePath = path.join(moduleDirPath, fileName)
    files[filePath] = `${templatesRoot}/module/${fileName}`
  })
  
  // 帮助函数文件 Store helper templates
  ['utils', 'types'].forEach(template => {
    const fileName = `${template}.js`
    const filePath = path.join(templatesRoot, fileName)
    files[filePath] = `${templatesRoot}/${fileName}`
  })
  
  // api文件 Api templates
  ['index', 'nedb'].forEach(template => {
    const fileName = `${template}.js`
    const filePath = path.join(apiPath, fileName)
    files[filePath] = `${apiPath}/${fileName}`
  })
  
  // 在api中调用模块文件并进行后期处理

  api.render(files)

  api.postProcessFiles(files => {
    // 编辑根模块，添加模块 Edit store's root module
    const storeRoot = files[storeRootPath]

    if (storeRoot) {
      const lines = storeRoot.split(/\r?\n/g).reverse()

      // 按模块名称，添加引用 Add import line
      const lastImportIndex = lines.findIndex(line => line.match(/^import/))
      if (lastImportIndex !== -1) {
        lines[lastImportIndex] += `\nimport ${moduleName} from './${moduleName}'`
      }

      // 添加模块行Add module line
      lines.reverse()
      const modulesStartIndex = lines.findIndex(line => line.match(/modules: *{/))
      if (modulesStartIndex !== -1) {
        const spaces = lines[modulesStartIndex].indexOf('modules')
        const modulesEndIndex = lines.findIndex((line, index) => index >= modulesStartIndex && line.match(/}/))
        if (modulesEndIndex !== -1) {
          if (modulesEndIndex === modulesStartIndex) {
            const closingBraceIndex = lines[modulesStartIndex].indexOf('}')
            const start = lines[modulesStartIndex].substr(0, closingBraceIndex)
            const end = lines[modulesStartIndex].substr(closingBraceIndex)
            lines[modulesEndIndex] = `${start}\n${Array(spaces + 3).join(' ')}${moduleName}\n${Array(spaces + 1).join(' ')}${end}`
          } else {
            lines[modulesEndIndex] = `${Array(spaces + 3).join(' ')}${moduleName}\n${lines[modulesEndIndex]}`
            if (modulesEndIndex - modulesStartIndex > 1) {
              lines[modulesEndIndex - 1] += ','
            }
          }
        }
      }

      files[storeRootPath] = lines.join('\n')
    }
  })
}
