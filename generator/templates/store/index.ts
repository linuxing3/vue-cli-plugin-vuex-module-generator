/**
 * CopyRight: Xing wenju
 * Author: Xing wenju
 * Email: linuxing3@qq.com
 * Git: https://github.org/linuxing3
 * License: MIT
 * Project: official-manager
 * Language: javascript/vue
 * Description:  Description is here
 *
 */
import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);
import { make } from "vuex-pathify";

// Init Database
import { dbInit } from "@/store/api/NedbSDK";
dbInit();

// Modules Activated
import activity from "./modules/Activity";

// Plugins will handle persistence
import plugins from "./plugin";

// All modules are based on Base, with same mutation
// and actions, and with different states
import Base from "./modules/Base";

const state = {
  title: "xing wenju",
  filterKey: "",
  token: {
    netlifyToken: "",
    firebaseToken: "",
  },
  loggedIn: false,
};

const mutations: any = { ...make.mutations(state), Base.mutations };

const actions: any = {...make.actions(state), Base.actions };

/**
 * Awesome store created here!
 * modules are all namespaced
 * plugins are automatically triggered
 */
export default new Vuex.Store({
  state,
  plugins,
  modules: {
    activity,
  },
  getters: {
    rootTitle: state => state.title,
  },
  mutations,
  actions,
});
