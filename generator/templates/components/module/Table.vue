<template>
  <v-card>

    <v-card-title>
      <!-- Actions buttons -->
      <v-flex
          xs12
          md8
          offset-md-4>
        <v-btn
            icon
            @click="addItem"
            color="primary">
          <v-icon>fas fa-plus</v-icon>
        </v-btn>
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
          <template
              slot="items"
              slot-scope="props">
            <td
                @click="alert('Goto...')"
                class="text-xs-left"
                :key="header.text"
                :autocomplete="props.item[header.text]"
                v-for="header in itemKeysFiltered">
              {{ props.item[header.text] }}
            </td>
            <td class="justify-center layout px-0">
              <v-btn
                  icon
                  class="mx-0"
                  @click="editItem(props.item)">
                <v-icon color="teal">edit</v-icon>
              </v-btn>
              <v-btn
                  icon
                  class="mx-0"
                  @click="deleteItem(props.item)">
                <v-icon color="pink">delete</v-icon>
              </v-btn>
            </td>
          </template>
        </v-data-table>

      </v-responsive>

      <v-card-actions>

        <!-- dialoge -->
        <v-dialog
            v-model="dialog"
            width="80%">
          <v-card>
            <v-card-title>
              <span class="headline">{{ formTitle }}</span>
            </v-card-title>
            <v-card-text>
              <!-- User Input Form -->
              <ActivityInfo :editing="editing" />
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

import ActivityInfo from "@/components/Activity/ActivityInfo.vue";

@Component({
  components: { ActivityInfo },
  computed: {
    ...get("activity/*"),
    search: sync("activity/filter@search")
  },
  methods: {
    ...call("activity/*")
  }
})
export default class ActivityTable extends Vue {
  // Props
  dialog = false;
  editing = false;
  formTitle = "活动信息";

  constructor() {
    super();
    this.dialog = false;
    this.editing = false;
  }

  created() {
    // Listen for event
    this.$on("INFO_CLOSE", () => {
      this.dialog = false;
      this.actionRead();
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
    this.$store.set("activity/currentItem", defaultActivity);
    this.dialog = true;
  }

  deleteItem(item) {
    this.actionDelete(item);
  }
}
</script>
