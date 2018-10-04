import { log } from "@/util";

import * as types from "@/store/types";

export const PersistencePlugin = (options: any) => {
  return (store: any) => {
    let namespace = options.namespace || "";

    // Read data from Nedb
    // Actions dispatched is like user/actionRead
    store.dispatch(`${namespace}/${types.aRead}`, {});

    // Every Mutations will be logged
    store.subscribe((mutation: any) => {
      log.suc("Persistence Log: " + mutation.type);
    });
  };
};
