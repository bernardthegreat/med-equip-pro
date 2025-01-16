<template>
  <q-table
    square
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
    <template v-slot:loading>
      <q-inner-loading showing>
        <q-spinner-puff size="100px" color="primary" />
        <span class="q-pt-md q-py-md text-overline text-center"
          >LOADING, PLEASE WAIT ...</span
        >
      </q-inner-loading>
    </template>
    <template v-slot:top-left>
      <div class="row q-col-gutter-sm items-center">
        <span class="col text-body1">
          <span>{{ this.title }}</span>
          <span class="q-pl-sm" v-if="this.addBtn">
            <q-btn-group>
              <q-btn
                size="sm"
                label="ADD"
                icon="fa fa-plus-circle"
                class="primary-btn"
                @click="emitBtn"
              ></q-btn>

              <q-btn
                size="sm"
                color="secondary-btn"
                icon="fa fa-download"
                class="secondary-btn"
                label="EXPORT"
                @click="exportTable"
              ></q-btn>
            </q-btn-group>
          </span>
        </span>
      </div>
    </template>
    <template v-slot:top-right>
      <div class="q-mt-xs row items-center justify-end q-col-gutter-sm">
        <div :class="this.filterBtn ? 'col' : 'col-12'">
          <q-input
            outlined
            input-class="accent-text-dark"
            v-model="filter"
            label-slot
            color="tertiary"
            dense
            class="accent-text-dark"
            stack-label
          >
            <template v-slot:append>
              <q-icon name="search" color="primary" />
            </template>
            <template v-slot:label>
              <span class="text-accent-dark">FILTER {{ this.title }}</span>
            </template>
          </q-input>
        </div>
        <div class="col-xl col-lg-7 col-md-6 col-sm-12 col-xs-12">
          <q-btn
            v-if="this.filterBtn"
            icon="event"
            class="secondary-btn"
            size="12px"
            :label="`FILTER DATE: ${this.dateLabel}`"
          >
            <q-popup-proxy transition-show="scale" transition-hide="scale">
              <q-date
                v-model="date"
                class="q-ma-md"
                landscape
                range
                @update:model-value="updateLabel()"
              >
              </q-date>
            </q-popup-proxy>
          </q-btn>
        </div>
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
          <div v-if="col.name === 'status'">
            <q-badge
              :color="
                col.value === 'ACTIVE'
                  ? 'positive'
                  : col.value === 'FOR REPAIR'
                  ? 'warning'
                  : 'negative'
              "
              :label="col.value"
            />
          </div>
          <div v-else-if="col.name === 'type'">
            <q-badge
              :class="col.value === 'owned' ? 'bg-primary' : 'bg-purple-8'"
              :label="col.value.toUpperCase()"
            />
          </div>
          <div v-else>
            {{ col.value }}
          </div>
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
    addBtn: {
      type: Boolean,
      default: false,
    },
    filterBtn: {
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
  emits: ["dateSet", "emitAddBtn", "emitRow"],
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

    emitBtn() {
      this.$emit("emitAddBtn", true);
    },

    emitRow(row) {
      this.$emit("emitRow", row);
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
