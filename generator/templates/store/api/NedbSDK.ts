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
 * 本模块实现了nedb JavaScript SDK的部分功能
 *
 * @providesModule nedbSDK
 */

import path from "path";
import fs from "fs";
import * as _ from "lodash";

// import datastore from "nedb";
import datastore from "nedb-promise";
import { collections } from "@/store/Model/BaseModel";
import { log } from "@/util";

import { remote } from "electron";

/////////////////////////////////////////////////////////////////////////
// Interface
/////////////////////////////////////////////////////////////////////////

/**
 * CPWork.IDatabasePool as type
 * Database pool in format { "user": Database }
 * @interface INedbDatabasePool
 */
export interface INedbDatabasePool extends CPWork.IDatabasePool {
  [index: string]: any;
}

export interface IVuexNedbAdaptor extends CPWork.IVuexAdaptor {
  userPath: string;
  pool: INedbDatabasePool;
  collections: string[];
  current: string;
  dbInit(): any;
  dbCreate(collection: string): any;
  dbRemove(collection: string): any;
  dbOpen(collection: string): any;
  dbSetCurrent(collection: string): any;
  findItem(db: any, query: any): any;
  addItem(db: any, cleanPayload: any): any;
  updateItem(db: any, query: any, cleanPayload: any): any;
  removeItem(db: any, query: any): any;
}

/////////////////////////////////////////////////////////////////////////
// Module
/////////////////////////////////////////////////////////////////////////

let userPath = path.join(remote.app.getPath("userData"), "/data");

let pool: INedbDatabasePool = {};

/**
 * Database persistence Module
 */

export function dbOpen(collection: string): any {
  return pool[collection];
}

/**
 * Init persistence database pool
 */
export function dbInit() {
  // Create system-level collection collections.json
  dbCreate("collections");
  // Create user-level collections like user.json
  dbCreateUserLevelCollection(collections);
}

/**
 * Init persistence database pool
 */
export function dbResetAll() {
  // Create system-level collection collections.json
  dbRemove("collections");
  // Create user-level collections like user.json
  collections.map(item => dbRemove(item));
}

/**
 * Creating a collection with real path and add to pool
 * @param collection Name of the db collection
 */
export function dbCreate(collection: string) {
  let fileName = `${collection}.json`;
  let filePath = path.join(userPath, fileName);
  // Create collections instance and add to pool
  let DB = datastore({
    autoload: true,
    filename: filePath,
  });
  pool[collection] = DB;
  // add collection information to collections
  let systemDB = dbOpen("collections");
  systemDB.find({ collection: collection }).then((docs: any[]) => {
    if (docs.length === 0) systemDB.insert({ collection, fileName, filePath });
  });
}

/**
 * Create Default Collections if not exist
 *
 * Check the UserData Folder if user.json and other files exist
 * If not, call defaultCollections as array
 * Loop through and create databases files
 * Load into pool
 */
export function dbCreateUserLevelCollection(collections: string[]) {
  for (let collection of collections) {
    // Omiting system-level db.json
    if (collection === "collections") return;
    // check if other user-level collection exists
    dbCreate(collection);
    log.suc("Created " + collection + ".json in you UserData directory!");
  }
}

/**
 * Remove the collections.json files from hard disk
 */

export function dbRemove(collection: string) {
  let fileName = `${collection}.json`;
  let filePath = path.join(userPath, fileName);
  if (fs.existsSync(filePath)) {
    log.err("Removing...");
    fs.rmdirSync(filePath);
  }
}

/**
 * Database table operation Module
 * TODO: DEPRECATED: Now Every operation with `nedb-promise`
 * /

 /**
 * 通过查询语句，获取数据，返回一个Promise<数据[]>
 * @param db Nedb datastore
 * @param query MongoDB-style query
 */
export const findItem = (db: any, query: any) => {
  if (db === undefined || query === undefined) return;
  return new Promise((resolve, reject) => {
    db.find(query, (err: Error, document: any[]) => {
      if (err !== null) {
        reject(err);
      } else {
        resolve(document);
      }
    });
  });
};

/**
 * 获取Vuex中传递的载荷，如果有就删除Id字段，创建并返回Promise<插入的新数据>
 * @param db Nedb datastore
 * @param cleanPayload MongoDB-style query
 */
export const addItem = (db: any, cleanPayload: any) => {
  if (db === undefined || cleanPayload === undefined) return;
  return new Promise((resolve, reject) => {
    db.insert(cleanPayload, (err: Error, insertedDoc: any) => {
      if (err !== null) {
        reject(err);
      } else {
        resolve(insertedDoc);
      }
    });
  });
};
/**
 * 获取Vuex中传递的载荷，如果有就删除Id字段，更改并返回Promise<修改数据的数量>
 * @param db Nedb datastore
 * @param query MongoDB-style query
 * @param cleanPayload MongoDB-style query
 */
export const updateItem = async (db: any, query: any, cleanPayload: any) => {
  if (db === undefined || cleanPayload === undefined || query === undefined) return;
  return new Promise((resolve, reject) => {
    db.update(query, cleanPayload, {}, (err: Error, numberOfUpdated: number) => {
      if (err !== null) {
        reject(err);
      } else {
        resolve(numberOfUpdated);
      }
    });
  });
};

/**
 * 获取Vuex中传递的载荷，如果有就删除Id字段，删除并返回Promise<删除数据的数量>
 * @param db Nedb datastore
 * @param query MongoDB-style query
 */
export const removeItem = async (db: any, query: any) => {
  if (db === undefined || query === undefined) return;
  return new Promise((resolve, reject) => {
    db.remove(query, {}, (err: Error, numberOfDeleted: number) => {
      if (err !== null) {
        reject(err);
      } else {
        resolve(numberOfDeleted);
      }
    });
  });
};
