import { useLoaderData } from "@remix-run/react";
import React from "react";

async function getExperiments() {
  let username = "RBroersma";
  let password = "a_Man?hq8Kc>L)3v";

  let url =
    "https://fair-data.avi.directory.intra/geonetwork/srv/dut/q?_content_type=json&_isTemplate=y+or+n&bucket=e101&fast=index&from=1&resultType=manager&sortBy=changeDate&to=200";

  try {
    const res = await fetch(url);
    if (res.status !== 200) {
      return [];
    }
    return res.json();
  } catch (error) {
    return [];
  }
}

export async function loader() {
  return getExperiments();
}

export default function ExperimentsPage() {
  let experiments = useLoaderData<typeof loader>();

  return (
    <div className="card">
      <h1>Experiments</h1>
      <input type="text" placeholder="Search" />
      {/* <v-data-table
                    :headers="headers"
                    :items="experiments"
                    :items-per-page="10"
                    :search="search"
                    class="elevation-1"
            >
                <template v-slot:item.facility="{item}">
                    {{getFacility(item)}}
                </template>
                <template v-slot:item.creator="{item}">
                    {{getUserName(item)}}
                </template>
                <template v-slot:item.delete="{item}">
                    <v-btn class="mx-2" fab dark small c color="indigo" @click="showDeleteDialog(item)">
                        <v-icon dark>mdi-delete</v-icon>
                    </v-btn>
                </template>
                <template v-slot:item.edit="{item}">
                    <v-btn class="mx-2" fab dark small color="indigo"
                           :to="{ name: 'StandardExperiment', params: { id: item['geonet:info'].uuid } }">
                        <v-icon dark>mdi-pencil</v-icon>
                    </v-btn>
                </template>
            </v-data-table>
            <v-card-actions>
                <v-btn color="indigo" dark @click="showDetail">add experiment</v-btn>
            </v-card-actions>
        </v-card>
        <v-dialog
                v-model="dialog"
                persistent
                max-width="290"
        >
            <v-card>
                <v-card-title>
                    <span color="indigo" class="text-h5">Confirm delete</span>
                </v-card-title>
                <v-card-text>Do you want to delete this experiment?</v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn
                            color="indigo"
                            text
                            @click="dialog = false"
                    >
                        Disagree
                    </v-btn>
                    <v-btn
                            color="indigo"
                            text
                            @click="deleteItem()"
                    >
                        Agree
                    </v-btn>
                </v-card-actions>
            </v-card>

        </v-dialog> */}
    </div>
  );
}

let vue = {
  methods: {
    getFacility: function (item) {
      const author = item.responsibleParty.find((entry) =>
        entry.startsWith("Point of contact")
      );
      return author.split("|")[2];
    },
    getUserName: function (item) {
      const author = item.responsibleParty.find((entry) =>
        entry.startsWith("Author")
      );
      return author.split("|")[2];
    },
    update: async function () {
      const msalInstance = this.$store.state.msalInstance;
      this.experiments = await util.getExperiments(msalInstance);
      console.log(this.experiments);
    },
    showDeleteDialog(selectedMetaDataItem) {
      this.dialog = true;
      this.selectedMetaDataItem = selectedMetaDataItem;
    },
    deleteItem: async function () {
      this.dialog = false;
      const uuid = this.selectedMetaDataItem["geonet:info"].uuid;
      await util.deleteItem(uuid, this.$store.state.msalInstance);
      await this.update();
    },
    showDetail: function () {
      this.$router.push("/StandardExperiment/0");
    },
  },
  data() {
    return {
      dialog: false,
      selectedMetaDataItem: -1,
      search: "",
      headers: [
        { text: "Title", value: "defaultTitle" },
        { text: "Description", value: "abstract" },
        { text: "Creator", value: "creator" },
        { text: "Facility", value: "facility" },
        { text: "Delete", value: "delete" },
        { text: "Edit", value: "edit" },
      ],
      experiments: [],
    };
  },
};
