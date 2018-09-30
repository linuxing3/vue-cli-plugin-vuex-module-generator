<template>
  <form>
    {{editing ? "你在进行编辑更新" : "你在添加模式"}}
    <v-text-field
      label="姓名"
      v-model="currentItem['填表人']"
      required
    ></v-text-field>
    <v-text-field
      label="地点"
      v-model="currentItem['地点']"
      required
    ></v-text-field>
    <v-text-field
      label="日期"
      v-model="currentItem['日期']"
      required
    ></v-text-field>
    <v-btn color="primary" @click="saveItem">{{editing ? "更新": "保存"}}</v-btn>
  </form>
</template>
<script>
import { Component, Prop, Vue } from "vue-property-decorator";
import { get, sync, call } from "vuex-pathify";

@Component({
  computed: {
    ...sync("activity/*"),
  },
  methods: {
    ...call("activity/*"),
    ...call("database/"),
  },
})
export default class ActivityInfo extends Vue {
  // Props
  @Prop()
  editing;

  constructor() {
    super();
  }

  saveItem() {
    if (this.editing) {
      this.actionUpdate(this.currentItem);
    } else {
      this.actionCreate(this.currentItem);
    }
    this.actionRead();
    window.activityApp.$emit("INFO_CLOSE")
  }
}
</script>
