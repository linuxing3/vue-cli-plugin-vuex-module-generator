/* eslint-disable */
import Vue from "vue";
import Router from "vue-router";

import path from "./path";

Vue.use(Router);

const router = new Router({
  routes: path,
});

// router gards
router.beforeEach((to: any, from: any, next: any) => {
  console.log("Going From " + from.path + " to " + to.path);
  next();
});

router.afterEach((to: any, from: any) => {
  console.log("Arrived " + to.path + " from " + from.path);
});

export default router;
