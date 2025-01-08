<template>
  <q-table
    class="sticky-header-table rounded-bottom-borders shadow-0"
    :rows="this.rows"
    :columns="this.columns"
    virtual-scroll
    :row-key="this.rowKey"
    :filter="this.filter"
    :rows-per-page-options="[0]"
    :loading="loading"
    :style="`height: ${this.tableHeight} !important`"
    :dense="this.dense"
  >
    <!-- <template v-slot:loading>
      <q-inner-loading showing>
        <q-spinner-puff size="100px" color="primary" />
        <span class="q-pt-md q-py-md text-overline text-center"
          >LOADING, PLEASE WAIT ...</span
        >
      </q-inner-loading>
    </template> -->
    <template v-slot:top-left>
      <div class="row q-col-gutter-sm items-center">
        <span class="col text-body1">
          {{ this.title }}
        </span>
      </div>
    </template>
    <template v-slot:top-right>
      <div class="q-mt-xs row items-center q-col-gutter-sm">
        <span class="col-xl col-lg col-md-6 col-sm-12 col-xs-12">
          <q-input
            :label="`FILTER ${this.title}`"
            outlined
            label-color="primary"
            v-model="filter"
            color="primary"
            dense
            stack-label
          >
            <template v-slot:append>
              <q-icon name="search" color="primary" />
            </template>
          </q-input>
        </span>
        <span class="col-xl col-lg col-md-6 col-sm-12 col-xs-12">
          <q-btn-group>
            <q-btn
              icon="event"
              color="warning"
              text-color="black"
              size="12px"
              :label="`FILTER DATE: ${this.dateLabel}`"
            >
              <q-popup-proxy transition-show="scale" transition-hide="scale">
                <q-date
                  v-model="date"
                  landscape
                  range
                  @update:model-value="updateLabel()"
                >
                </q-date>
              </q-popup-proxy>
            </q-btn>
            <q-btn
              color="warning"
              text-color="black"
              icon="fa fa-download"
              label="EXPORT"
              @click="exportTable"
            ></q-btn>
          </q-btn-group>
        </span>
      </div>
    </template>

    <template v-slot:body="props">
      <q-tr
        :props="props"
        class="cursor-pointer"
        v-on:click="emitRow(props.row)"
      >
        <!-- v-on:click="emitRow(props.row)" -->
        <!-- <q-td auto-width v-if="tableType === 'pending'">
          <q-checkbox keep-color v-model="props.selected" color="primary" />
        </q-td> -->
        <q-td v-for="col in props.cols" :key="col.name" :props="props">
          {{ col.value }}
        </q-td>
      </q-tr>
    </template>
  </q-table>
</template>

<script>
const utils = require("src/util");
import { defineComponent, ref } from "vue";
import * as XLSX from "xlsx";

export default defineComponent({
  name: "TableDetails",
  props: {
    rows: {
      type: Array,
      required: true,
    },
    columns: {
      type: Array,
      required: true,
    },
    rowKey: {
      type: String,
      required: true,
    },
    loading: {
      type: Boolean,
      required: true,
      default: true,
    },
    title: {
      type: String,
      default: "DATA TABLE",
    },
    tableHeight: {
      type: String,
      default: "88vh",
    },
    dense: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      filter: "",

      date: {
        from: "",
        to: "",
      },
      dateLabel: "",
      selectedItems: [],
    };
  },
  created() {
    this.setDates();
  },
  emits: ["dateSet"],
  methods: {
    setDates() {
      const fromAndToDate = utils.fromAndToDate({ days: 30 });
      this.date.from = fromAndToDate.fromDate;
      this.date.to = fromAndToDate.toDate;
      this.dateLabel = `${fromAndToDate.fromDate} - ${fromAndToDate.toDate}`;
      this.$emit("dateSet", this.date);
    },
    updateLabel() {
      if (this.date === null) {
        this.dateLabel = "No dates specified";
        return;
      }
      if (utils.isStr(this.date)) {
        this.dateLabel = `${this.date} - ${this.date}`;
        // this.$emit("reloadPR");

        this.$emit("dateSet", this.date);
        return;
      }
      this.dateLabel = `${this.date.from} - ${this.date.to}`;
      this.filter = "";

      this.$emit("dateSet", this.date);
    },

    exportDataToXLSX(data) {
      const ws = XLSX.utils.json_to_sheet(data);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Sheet1");
      XLSX.writeFile(wb, `${this.exportFileTitle ?? "exportedFile"}.xlsx`);
    },
    exportTable() {
      const arrayOfObjects = this.rows.map((row) => {
        const obj = {};
        this.columns.forEach((col) => {
          obj[col.label] =
            typeof col.field === "function" ? col.field(row) : row[col.field];
        });
        return obj;
      });
      this.exportDataToXLSX(arrayOfObjects);
    },
  },
});
</script>

<style>
.header-class {
  background-color: #e3f2fd !important;
  color: #0d47a1 !important;
}
</style>

<style lang="sass">
.sticky-header-table
  height: 88vh
  .q-table__bottom
    background-color: #d1ecfc
    color: #0d47a1

  thead tr:first-child th
    background: #d1ecfc
    color: #0d47a1

  .q-table__top
    background-color: #d1ecfc
    color: #0d47a1

  thead tr th
    position: sticky
    z-index: 1
  thead tr:first-child th
    top: 0

  /* this is when the loading indicator appears */

  /* prevent scrolling behind sticky top row on focus */
  tbody
    /* height of all previous header rows */
    scroll-margin-top: 48px
    .q-td
      border-color: #e0e0e0 !important
    .q-tr:nth-child(odd)
      background-color: #f7f7f7
    .q-tr:nth-child(even)
      background-color: #eceff1
    .q-tr:hover
      background-color: #e3f2fd
</style>
