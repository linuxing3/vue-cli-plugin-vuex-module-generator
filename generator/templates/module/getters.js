export default {
  moduleName: (state) => state.name,
  itemCounts: (state) => state.items.length,
  itemKeys: (state) => {
    return ObjectKeysToArray(state.currentItem);
  },
  itemFiltered: (state) => {
    return baseFilter(state.items, state.sortKey, state.filterKey);
  },
}
