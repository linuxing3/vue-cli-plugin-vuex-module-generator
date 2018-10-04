<a href="https://npmjs.com/package/vue-cli-plugin-vuex-nedb-module-generator">
    <img alt="" src="https://img.shields.io/npm/v/vue-cli-plugin-vuex-module-generator/latest.svg?style=flat-square">
</a>
<a href="https://npmjs.com/package/vue-cli-plugin-vuex-nedb-module-generator">
    <img alt="" src="https://img.shields.io/npm/dm/vue-cli-plugin-vuex-module-generator.svg?style=flat-square">
</a>

# Vuex module generator

## 基本描述

- [vue-cli 3](https://github.com/vuejs/vue-cli)插件，用于生成 Vuex store 模块和相应组件

- 主要面向`electron`应用，存储`nedb`的持久化数据到用户数据目录下的`data`文件夹内

- 面向`typescript`应用

- 使用了`vuex-pathify`简化操作流程

## 使用方法

- 使用`vue-cli`进行安装其他插件

```sh
$ vue add typescript
$ vue add vue-cli-plugin-electron-builder
```

- 使用`vue-cli`进行安装本插件

```sh
$ vue add vue-cli-plugin-vuex-nedb-module-generator
```

- 使用`Invoke`可生成新的存储模块和对应的组件:

```sh
$ vue invoke vue-cli-plugin-vuex-nedb-module-generator
? Where's your store's root directory? ./src/store
? Where's your component's root directory? ./src/components
? What's your new module's name? code
? What's your router's path? ./src/router
```

## 自动生成的主要文件

请注意：如果上述文件已经存在，将不覆盖现有文件

**存储入口文件**
`store/index.ts`

**路由文件**
`router/index.ts`
`router/path.ts`

**基本的数据模型**
`store/Model/BaseModel.ts`

**使用命名空间的存储模块**

```sh
store/modules/Base/index.ts
store/modules/Base/actions.ts
store/modules/Base/mutations.ts
store/modules/Base/getters.ts
store/modules/code.ts
```

**Nedb 的 API，主要在 actions 中异步调用**

`store/api/NedbSDK.ts`

**Store 插件，加入了 pathify 和 persistent**

```sh
store/plugins/index.ts
store/plugins/PersistentPlugin.ts
```

**自动生成的组件**

```sh
components/code/codeTable.ts
components/code/codeInfo.ts
```

## 借鉴：

[vue-cli-plugin-vuex-module-generator](https://github.com/paulgv/vue-cli-plugin-vuex-module-generator)
