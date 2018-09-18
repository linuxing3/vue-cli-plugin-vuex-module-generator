import types from "@/store/types"
export default {
  // Add a Item with push
  [types.mCreate]: (state, payload) => {
    state.items.push(payload);
  },

  // Delete
  [types.mDelete]: (state, payload) => {
    state.items = state.items.filter((item: any) => item._id !== payload._id);
  },

  // Update
  [types.mUpdate]: (state, payload) => {
    let item = state.items.filter((item: any) => item._id === payload._id);
    item = payload;
  },

  // Read
  [types.mRead]: (state, payload) => {
    state.items = payload;
  },

  /**
   * Getting value of a dom input and set it
   */
  [types.mSetValue]: (state, payload) => {
    state.currentItem[payload.target.name] = payload.target.value;
  },

  /**
   * Set the filter of item list
   */
  [types.mSetFilter]: (state, payload) => {
    state.filterKey = payload.target.value;
  },

  /**
   * Set current currentItem for edit
   */
  [types.mSetCurrent]: (state, payload) => {
    state.currentItem = payload;
  },
}
