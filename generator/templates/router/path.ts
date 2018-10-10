export default [
  {
    path: "/activities",
    name: "Activities",
    component: () =>
      import(/* webpackChunkName: "routes" */
      /* webpackMode: "lazy" */
      `@/components/Activity/ActivityTable.vue`),
  },
];
