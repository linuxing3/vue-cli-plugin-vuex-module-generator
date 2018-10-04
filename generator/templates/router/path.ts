export default
  {
    path: "/activities",
    meta: { breadcrumb: true },
    name: "Activities",
    component: () =>
      import(/* webpackChunkName: "routes" */
      /* webpackMode: "lazy" */
      `@/components/Activity/ActivityTable.vue`),
  }
