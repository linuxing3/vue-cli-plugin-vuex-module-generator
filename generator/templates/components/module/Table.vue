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
            <td>
              <v-avatar size="36px">
                <v-img :src="require('')">
                </v-img>
              </v-avatar>
            </td>
            <td>{{ props.item['name'] }}</td>
            <td class="text-xs-left">{{ props.item['description'] }}</td>
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

import { defaultItem } from "@/store/Model/BaseModel";

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
  formTitle = "title";

  avatarPath = "";

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

  editItem(item) {
    this.editing = true;
    this.$store.set("activity/currentItem", item);
    this.dialog = true;
  }

  addItem() {
    this.editing = false;
    this.$store.set("activity/currentItem", defaultItem);
    this.dialog = true;
  }

  deleteItem(item) {
    this.actionDelete(item);
  }
}
</script>
