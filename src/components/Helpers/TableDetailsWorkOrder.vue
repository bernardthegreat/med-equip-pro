<template>
  <q-table
    square
    class="sticky-header-table rounded-bottom-borders shadow-0"
    :rows="this.currentRows"
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
    <template v-slot:top>
      <div
        class="q-mt-xs row full-width q-col-gutter-sm items-start justify-between"
      >
        <span class="col text-body1 row justify-start">
          <div v-if="!this.loading" class="col-6 row items-start justify-start">
            <span class="col">
              <q-chip class="bg-dark" style="font-size: 10px">STATUS:</q-chip>
            </span>

            <span class="col-9">
              <!-- <q-checkbox
                label="PENDING"
                size="sm"
                style="font-size: 10px"
                v-model="workOrderData.pending"
              ></q-checkbox>
              <q-checkbox
                label="COMPLETED"
                size="sm"
                style="font-size: 10px"
                v-model="workOrderData.completed"
              ></q-checkbox> -->

              <q-option-group
                class="q-pl-sm"
                v-model="workOrderData.filterStatus"
                :options="filterStatusOptions"
                color="primary"
                type="checkbox"
                inline
                dense
                style="font-size: 10px"
                size="sm"
                @update:model-value="
                  (val) => this.validateFilter(val, 'workOrderStatusDesc')
                "
              >
                <template v-slot:label="opt">
                  <div class="row items-center">
                    <span>{{ opt.label }}</span>
                  </div>
                </template>
              </q-option-group>
            </span>
          </div>
          <div v-if="!this.loading" class="col-6 row items-start justify-start">
            <span class="col">
              <q-chip class="bg-dark" style="font-size: 10px">TYPE:</q-chip>
            </span>
            <span class="col-10">
              <!-- <q-checkbox
                label="PREVENTIVE"
                size="sm"
                v-model="workOrderData.preventive"
                style="font-size: 10px"
              ></q-checkbox>
              <q-checkbox
                label="CORRECTIVE"
                size="sm"
                v-model="workOrderData.corrective"
                style="font-size: 10px"
              ></q-checkbox> -->

              <q-option-group
                class="q-pl-sm"
                v-model="workOrderData.filterType"
                :options="filterTypeOptions"
                color="primary"
                type="checkbox"
                inline
                dense
                style="font-size: 10px"
                size="sm"
                @update:model-value="
                  (val) => this.validateFilter(val, 'workOrderType')
                "
              >
                <template v-slot:label="opt">
                  <div class="row items-center">
                    <span>{{ opt.label }}</span>
                    <q-chip
                      :label="opt.count"
                      size="sm"
                      class="text-weight-bold info-chips"
                    ></q-chip>
                  </div>
                </template>
              </q-option-group>
            </span>
          </div>
        </span>

        <div class="col-6 row items-start justify-end q-col-gutter-x-sm">
          <span class="col-5">
            <q-btn-group>
              <q-btn
                size="sm"
                color="secondary-btn"
                icon="fa fa-download"
                class="secondary-btn"
                label="EXPORT"
                @click="exportTable"
              ></q-btn>
              <month-picker @setMonthYearData="setMonthYearData"></month-picker>
            </q-btn-group>
          </span>
          <span class="col-6">
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
          </span>
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
          <div v-else-if="col.name === 'workOrderType'">
            <q-badge
              :class="
                col.value === 'PREVENTIVE' ? 'bg-preventive' : 'bg-corrective'
              "
              :label="col.value"
            />
          </div>
          <div v-else-if="col.name === 'workOrderStatusDesc'">
            <q-badge
              :class="
                col.value === 'PENDING'
                  ? 'bg-pending'
                  : col.value === 'COMPLETED'
                  ? 'bg-completed'
                  : 'bg-floating'
              "
              :label="col.value"
            />
          </div>
          <div v-else-if="col.name === 'type'">
            <q-badge color="primary" :label="col.value.toUpperCase()" />
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
import MonthPicker from "components/Helpers/MonthPicker.vue";

export default defineComponent({
  components: { MonthPicker },
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
    workOrders: {
      type: Array,
    },
  },
  data() {
    return {
      filter: "",
      workOrderData: {
        pending: true,
        completed: false,
        preventive: true,
        corrective: false,
        filterType: ["preventive", "corrective"],
        filterStatus: ["pending", "completed"],
      },
      date: {
        from: "",
        to: "",
      },
      dateLabel: "",
      monthYear: "",
      selectedItems: [],

      filterTypeOptions: [],
      filterStatusOptions: [],
      filteredData: [],
      currentWorkOrders: [],
      currentRows: [],
    };
  },
  watch: {
    loading(val) {
      if (!val) {
        this.setFilterData();
      }
    },
  },
  created() {
    this.setDates();
  },
  mounted() {},
  emits: ["dateSet", "emitAddBtn", "emitRow"],
  methods: {
    setFilterData() {
      this.currentWorkOrders = JSON.parse(JSON.stringify(this.workOrders));
      this.currentRows = JSON.parse(JSON.stringify(this.rows));

      const preventiveWorkOrders = this.currentWorkOrders.filter(
        (filterPreventive) => filterPreventive.workOrderType === "PREVENTIVE"
      );
      const correctiveWorkOrders = this.currentWorkOrders.filter(
        (filterCorrective) => filterCorrective.workOrderType === "CORRECTIVE"
      );
      this.filterTypeOptions = [
        {
          label: "PREVENTIVE",
          value: "preventive",
          count: preventiveWorkOrders.length,
        },
        {
          label: "CORRECTIVE",
          value: "corrective",
          count: correctiveWorkOrders.length,
        },
      ];

      this.filterStatusOptions = [
        {
          label: "PENDING",
          value: "pending",
          count: "20",
        },
        {
          label: "COMPLETED",
          value: "completed",
          count: "30",
        },
      ];
    },
    validateFilter(value, filter) {
      let filteredData = [];
      this.currentRows = JSON.parse(JSON.stringify(this.rows));
      if (value.length === 0) {
        this.currentRows = [];
        filteredData = [];
        return;
      }

      const filteredRows = this.currentRows;

      for (const list of value) {
        for (const workOrders of filteredRows) {
          if (filter === "workOrderType") {
            this.workOrderData.filterStatus = ["pending", "completed"];
            if (workOrders[filter] === list.toUpperCase()) {
              filteredData.push(workOrders);
            }
          } else {
            this.workOrderData.filterType = ["preventive", "corrective"];
            if (list === "pending") {
              if (
                workOrders.workOrderStatusDesc === "PENDING" ||
                workOrders.workOrderStatusDesc === "FLOATING"
              ) {
                filteredData.push(workOrders);
              }
            } else if (list === "completed") {
              if (workOrders.workOrderStatusDesc === "COMPLETED") {
                filteredData.push(workOrders);
              }
            }
          }
        }
      }

      this.currentRows = filteredData;
    },
    setDates() {
      const fromAndToDate = utils.fromAndToDate({ days: 30 });
      this.date.from = fromAndToDate.fromDate;
      this.date.to = fromAndToDate.toDate;
      this.dateLabel = `${fromAndToDate.fromDate} - ${fromAndToDate.toDate}`;
      this.$emit("dateSet", this.date);
    },
    setMonthYearData(val) {
      this.monthYear = val;
      this.$emit("dateSet", this.monthYear);
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
