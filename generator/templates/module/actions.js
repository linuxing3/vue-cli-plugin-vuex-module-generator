import { dbOpen } from "@/store/api/nedb"; 
import types from "@/store/types";

export default {
/**
 * Actions
 * 1. Using types naming in separate file
 * 2. Using async functions to manage nedb
 * 3. Using my state and context
 * 4. Using plugin to read persistence after each commit
 */
  // Create New Item
  [types.aCreate]: async (ctx, payload) => {
    let newDoc = await dbOpen(ctx.state.name).insert(payload);
    ctx.commit(types.mCreate, newDoc);
  },

  // Remove a Item
  [types.aDelete]: async (ctx, payload) => {
    let numRemoved = await dbOpen(ctx.state.name).remove({ _id: payload._id });
    if (numRemoved !== null) ctx.commit(types.mDelete, payload);
  },

  [types.aUpdate]: async (ctx, payload) => {
    let { _id, ...cleanPayload } = payload;
    let query = {
      _id: payload._id,
    };
    let numReplaced = await dbOpen(ctx.state.name).update(query, cleanPayload);
    if (numReplaced !== undefined) ctx.commit(types.mUpdate, payload);
  },

  // Find all Item
  [types.aRead]: async (ctx, payload) => {
    let docs = await dbOpen(ctx.state.name).find({});
    if (docs.length !== 0) ctx.commit(types.mRead, docs);
  },

  // Find a Item
  [types.aReadOne]: async (ctx, payload) => {
    let doc = await dbOpen(ctx.state.name).findOne(payload);
    if (doc !== null) ctx.commit(types.mReadOne, doc);
  },
}
