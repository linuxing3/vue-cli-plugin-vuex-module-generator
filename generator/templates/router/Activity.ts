export default {
  path: "/activity",
  name: "Activity",
  component: () =>
    import(/* webpackChunkName: "routes" */
    /* webpackMode: "lazy" */
    `@/components/Activity/ActivityTable.vue`),
};
