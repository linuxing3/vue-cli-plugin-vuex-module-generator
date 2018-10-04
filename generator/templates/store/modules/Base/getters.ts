import { ObjectKeysToArray, LimitedObjectKeysToArray, baseFilter } from "@/util";

const getters = {
  moduleName: (state: any) => state.name,
  itemCounts: (state: any) => state.items.length,
  itemKeys: (state: any) => {
    return ObjectKeysToArray(state.currentItem);
  },
  itemKeysNoId: (state: any) => {
    return ObjectKeysToArray(state.currentItem).filter(keyName => keyName !== "_id");
  },
  itemKeysFiltered: (state: any) => {
    return LimitedObjectKeysToArray(state.currentItem);
  },
  itemFiltered: (state: any) => {
    return baseFilter(state.items, state.filter.sort, state.filter.search);
  },
  itemLimited: (state: any) => {
    return state.filter.limit ? state.items.slice(0, state.filter.limit) : state.items;
  },
};
export default getters;
