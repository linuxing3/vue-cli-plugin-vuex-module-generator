<template>
  <v-container grid-list-md>
    <v-layout wrap>
      <v-flex
          xs12
          md12
          sm12>
        {{editing ? "你在进行编辑更新" : "你在添加模式"}}
      </v-flex>
      <v-flex
          xs12
          sm6
          md4>
        <v-text-field
            v-for="(v, k) in currentItem"
            :key="k"
            :label="k"
            :name="k"
            :id="k"
            v-model="currentItem[k]"
            required
        ></v-text-field>
      </v-flex>
      <v-flex
          xs12
          sm12
          md12>
        <v-btn
            color="primary"
            @click="saveItem">{{editing ? "更新": "保存"}}</v-btn>
        <v-btn
            color="secondary"
            @click="closeDialog">关闭</v-btn>
      </v-flex>
    </v-layout>
  </v-container>
</template>
<script>
import { Component, Prop, Vue } from "vue-property-decorator";
import { get, sync, call } from "vuex-pathify";

@Component({
  props: {
    editing: Boolean
  },
  computed: {
    ...sync("activity/*")
  },
  methods: {
    ...call("activity/*")
  }
})
export default class ActivityInfo extends Vue {
  saveItem() {
    if (this.editing) {
      this.actionUpdate(this.currentItem);
    } else {
      this.actionCreate(this.currentItem);
    }
    this.closeDialog();
  }

  closeDialog() {
    window.activityApp.$emit("INFO_CLOSE");
  }
}
</script>
