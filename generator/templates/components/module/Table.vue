<template>
  <v-card>

    <v-card-title>
      <!-- Actions buttons -->
      <v-flex xs12 md8 offset-md-4>
        <v-btn icon @click="addItem" color="primary">
          <v-icon>fas fa-plus</v-icon>
        </v-btn>
        <v-btn icon @click="exportItem" color="accent">
          <v-icon>fas fa-print</v-icon>
        </v-btn>
        <DocumentSelector :docFiles="templateDocs"/>
        <v-text-field
          v-model="search"
          append-icon="search"
          label="Search"
          single-line
          hide-details
        ></v-text-field>
      </v-flex>

      <v-responsive>
        <v-data-table
          :headers="itemKeysFiltered"
          :items="itemFiltered"
          hide-actions
          class="elevation-0"
        >
          <template slot="items" slot-scope="props">
            <td>{{ props.item['联系人'] }}</td>
            <td>
              <v-avatar size="36px">
                <v-img :src="require('@/assets/mf-avatar.svg')">
                </v-img>
              </v-avatar>
            </td>
            <td class="text-xs-left">{{ props.item['地点'] }}</td>
            <td class="text-xs-left">{{ props.item['日期'] }}</td>
            <td class="text-xs-left">{{ props.item['活动形式']}} </td>
            <td class="justify-center layout px-0">
              <v-btn icon class="mx-0" @click="editItem(props.item)">
                <v-icon color="teal">edit</v-icon>
              </v-btn>
              <v-btn icon class="mx-0" @click="deleteItem(props.item)">
                <v-icon color="pink">delete</v-icon>
              </v-btn>
            </td>
          </template>
        </v-data-table>

        </v-responsive>

        <v-card-actions>

        <!-- dialoge -->
        <v-dialog v-model="dialog" width="80%">
          <v-card>
            <v-card-title>
              <span class="headline">{{ formTitle }}</span>
            </v-card-title>
            <v-card-text>
              <!-- User Input Form -->
              <v-container grid-list-md>
                  <ActivityInfo :editing="editing" />
                  <v-btn @click="dialog = false">关闭</v-btn>
              </v-container>
              <!-- End Form -->
            </v-card-text>
          </v-card>
        </v-dialog>
        <!-- end dialog -->

        </v-card-actions>
    </v-card-title>

    <div>
    </div>
  </v-card>
</template>
<script>
import { Component, Prop, Vue } from "vue-property-decorator";

import { get, sync, call } from "vuex-pathify";

import * as types from "@/store/types";

import ActivityInfo from "@/components/Activity/ActivityInfo.vue";

import { defaultActivity } from "@/store/Model/BaseModel";

import { log, getFilesByExtentionInDir, GenerateCSV } from "@/util";

import { remote, shell } from "electron";
import path from "path";

@Component({
  components: { ActivityInfo },
  computed: {
    ...get("activity/*"),
    search: sync("activity/filter@search"),
    docPath: sync("activity/export@docPath")
  },
  methods: {
    ...call("activity/*")
  }
})
export default class ActivityTable extends Vue {
  // Props
  dialog = false;
  editing = false;
  formTitle = "项目任务信息";

  userTemplatePath = "";
  userDataPath = "";

  outputJsonFile = "";
  templateDocName = "";
  templateDocs = [];

  avatarPath = "@/assets/mf-avatar.svg";

  constructor() {
    super();
    this.dialog = false;
    this.editing = false;
  }

  created() {
    // Listen for event
    this.$on("INFO_CLOSE", () => {
      this.dialog = false;
    });
    window.activityApp = this;
  }

  mounted() {
    // Initialize the template path
    this.userTemplatePath = path.join(
      remote.app.getPath("home"),
      "/Documents/template"
    );
    log.suc("Template Directory is: " + this.userTemplatePath);
    this.templateDocs = this.getFilesByExtentionInDir(
      this.userTemplatePath,
      "doc"
    );
  }

  editItem(item) {
    this.editing = true;
    this.$store.set("activity/currentItem", item);
    this.dialog = true;
  }

  addItem() {
    this.editing = false;
    this.$store.set("activity/currentItem", defaultActivity);
    this.dialog = true;
  }

  deleteItem(item) {
    this.actionDelete(item);
  }

  exportItem() {
    if (this.docPath === "") {
      alert("请选择使用的word模板");
      return;
    } else {
      let filePath = path.join(this.userTemplatePath, `${this.docPath}.doc`);
      log.info(filePath);
      // Export CSV
      GenerateCSV(
        this.itemFiltered,
        path.join(this.userTemplatePath, "/db.csv")
      );
      // open template file
      shell.showItemInFolder(filePath);
      shell.openItem(filePath);
    }
  }
  getFilesByExtentionInDir(path, ext) {
    const Docs = [];
    fs.readdir(path, (_, files) => {
      files.forEach(file => {
        log.info(file);
        if (file.substring(file.length - ext.length) !== ext) return;
        // Regex Replacement:   ./    .doc     .json
        let keyName = file.replace(/(\.\/|\.doc|\.json|\.js|\.ts)/g, "");
        Docs.push(keyName);
      });
    });
    return Docs;
  }
}
</script>
