/**
 * Actions
 * 1. Using types naming in separate file
 * 2. Using async functions to manage nedb
 * 3. Using my state and context
 * 4. Using plugin to read persistence after each commit
 */
import * as types from "@/store/types";

import { ActionContext } from "vuex";

import { dbOpen } from "@/api/nedb";

const actions = {
  // Create New Item
  [types.aCreate]: async (ctx: ActionContext<any, any>, payload: any) => {
    // 不使用辅助函数，先本地存储，再提交
    let newDoc = await dbOpen(ctx.state.name).insert(payload);
    ctx.commit(types.mCreate, newDoc);
  },

  // Remove a Item
  [types.aDelete]: async (ctx: ActionContext<any, any>, payload: any) => {
    // 不使用辅助函数，先本地存储，再提交
    let numRemoved = await dbOpen(ctx.state.name).remove({ _id: payload._id });
    if (numRemoved !== null) ctx.commit(types.mDelete, payload);
  },

  // Update a Item
  [types.aUpdate]: async (ctx: ActionContext<any, any>, payload: any) => {
    // 不使用辅助函数，先本地存储，再提交
    let { _id, ...cleanPayload } = payload;
    let query = {
      _id: payload._id,
    };
    let numReplaced = await dbOpen(ctx.state.name).update(query, cleanPayload);
    if (numReplaced !== undefined) ctx.commit(types.mUpdate, payload);
  },

  // Find all Item
  [types.aRead]: async (ctx: ActionContext<any, any>, payload: any) => {
    // 不使用辅助函数，先本地存储，再提交
    let docs = await dbOpen(ctx.state.name).find({});
    if (docs.length !== 0) ctx.commit(types.mRead, docs);
  },

  // Find a Item
  [types.aReadOne]: async (ctx: ActionContext<any, any>, payload: any) => {
    // 不使用辅助函数，先本地存储，再提交
    let doc = await dbOpen(ctx.state.name).findOne(payload);
    if (doc !== null) ctx.commit(types.mReadOne, doc);
  },
};

export default actions;
