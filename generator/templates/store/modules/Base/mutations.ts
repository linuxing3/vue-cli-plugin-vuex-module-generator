import * as types from "@/store/types";

const mutations = {
  // Add a Item with push
  [types.mCreate]: (state: any, payload: any) => {
    state.items.push(payload);
  },

  // Delete
  [types.mDelete]: (state: any, payload: any) => {
    state.items = state.items.filter((item: any) => item._id !== payload._id);
  },

  // Update
  [types.mUpdate]: (state: any, payload: any) => {
    let item = state.items.filter((item: any) => item._id === payload._id);
    item = payload;
  },

  // Read
  [types.mRead]: (state: any, payload: any) => {
    state.items = payload;
  },

  /**
   * Getting value of a dom input and set it
   */
  [types.mSetValue]: (state: any, payload: any) => {
    state.currentItem[payload.target.name] = payload.target.value;
  },

  /**
   * Set the filter of item list
   */
  [types.mSetFilter]: (state: any, payload: any) => {
    state.filter.search = payload.target.value;
  },

  /**
   * Set current currentItem for edit
   */
  [types.mSetCurrent]: (state: any, payload: any) => {
    state.currentItem = payload;
  },
};

export default mutations;
