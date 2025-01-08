<template>
  <q-page class="q-pa-md">
    <div class="row items-center q-col-gutter-y-md">
      <div class="col-12">
        <q-card bordered class="shadow-0 rounded-borders bg-secondary">
          <!-- <q-card-section class="q-pb-none">
            <div class="row items-center justify-between">
              <div>
                <span class="q-pr-sm text-overline">DASHBOARD</span>
              </div>
              <span>
                <span class="q-pr-sm text-overline">FILTER DATE:</span>
                <q-btn
                  text-color="black"
                  icon="fa fa-calendar"
                  class="filter-button"
                  :label="this.dateLabel"
                ></q-btn>
              </span>
            </div>
          </q-card-section> -->
          <q-card-section class="q-pa-sm">
            <div class="row q-col-gutter-x-sm">
              <div class="col" v-for="data in this.dashboardData" :key="data">
                <q-card
                  class="custom-card text-center"
                  :style="`background-color: ${data.color}; color: ${data.textColor}`"
                >
                  <q-card-section
                    class="text-h4 text-weight-bold q-pb-sm card-number"
                  >
                    {{ data.count }}
                  </q-card-section>
                  <q-card-section
                    class="text-body1 text-weight-bold q-pt-sm text-uppercase card-title"
                  >
                    <q-icon :name="data.icon"></q-icon>
                    <span class="q-pl-sm">{{ data.name }}</span>
                  </q-card-section>
                </q-card>
              </div>
            </div>
          </q-card-section>
        </q-card>
      </div>
      <div class="col-12">
        <table-details
          class="full-height flex-grow-1"
          :columns="this.columns"
          :rows="this.rows"
          :rowKey="'name'"
          :loading="this.bools.loading"
          :title="'WORK ORDERS'"
          :table-height="'70vh'"
        ></table-details>
      </div>
    </div>
    <!-- <div>Dashboard Page {{ date }}</div> -->
  </q-page>
</template>

<script>
const utils = require("src/util");
import { defineComponent } from "vue";
import TableDetails from "src/components/Helpers/TableDetails.vue";

export default defineComponent({
  components: { TableDetails },
  data() {
    return {
      bools: {
        loading: false,
      },

      columns: [
        {
          name: "index",
          label: "#",
          field: "index",
        },
        {
          name: "name",
          required: true,
          label: "Dessert (100g serving)",
          align: "left",
          field: (row) => row.name,
          format: (val) => `${val}`,
          sortable: true,
        },
        {
          name: "calories",
          align: "center",
          label: "Calories",
          field: "calories",
          sortable: true,
        },
        { name: "fat", label: "Fat (g)", field: "fat", sortable: true },
        { name: "carbs", label: "Carbs (g)", field: "carbs" },
        { name: "protein", label: "Protein (g)", field: "protein" },
        { name: "sodium", label: "Sodium (mg)", field: "sodium" },
        {
          name: "calcium",
          label: "Calcium (%)",
          field: "calcium",
          sortable: true,
          sort: (a, b) => parseInt(a, 10) - parseInt(b, 10),
        },
        {
          name: "iron",
          label: "Iron (%)",
          field: "iron",
          sortable: true,
          sort: (a, b) => parseInt(a, 10) - parseInt(b, 10),
        },
      ],
      rows: [],
      date: {
        from: "",
        to: "",
      },
      dateLabel: "",
      dashboardData: [
        {
          name: "Total Equipments",
          count: "240",
          color: "#C8E6C9",
          textColor: "#2E7D32",
          icon: "fas fa-cogs",
        },
        {
          name: "Equipment Utilization",
          count: "10",
          color: "#FFF9C4",
          textColor: "#424242",
          icon: "fas fa-bar-chart",
        },
        {
          name: "Pending Work Orders",
          count: "20",
          color: "#FFE082",
          textColor: "#BF360C",
          icon: "fas fa-spinner",
        },
        {
          name: "Completed Work Orders",
          count: "50",
          color: "#B3E5FC",
          textColor: "#01579B",
          icon: "fas fa-clipboard-check",
        },
      ],
    };
  },
  mounted() {
    this.formatFilterDates();
    this.initStore();
  },
  methods: {
    formatFilterDates() {
      const currentDate = new Date();

      // Get the first day of the month
      const firstDayOfMonth = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth(),
        1
      );

      const lastDayOfMonth = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth() + 1,
        0
      );

      // Format the dates as YYYY/MM/DD
      const formatDate = (date) => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are 0-based, so add 1
        const day = String(date.getDate()).padStart(2, "0");
        return `${year}/${month}/${day}`;
      };

      this.date.from = formatDate(firstDayOfMonth);
      this.date.to = formatDate(lastDayOfMonth);

      this.dateLabel = `${this.date.from} - ${this.date.to}`;
    },
    async initStore() {
      this.bools.loading = true;

      await utils.delay(2500);

      this.rows = [
        {
          name: "Frozen Yogurt",
          calories: 159,
          fat: 6.0,
          carbs: 24,
          protein: 4.0,
          sodium: 87,
          calcium: "14%",
          iron: "1%",
        },
        {
          name: "Ice cream sandwich",
          calories: 237,
          fat: 9.0,
          carbs: 37,
          protein: 4.3,
          sodium: 129,
          calcium: "8%",
          iron: "1%",
        },
        {
          name: "Eclair",
          calories: 262,
          fat: 16.0,
          carbs: 23,
          protein: 6.0,
          sodium: 337,
          calcium: "6%",
          iron: "7%",
        },
        {
          name: "Cupcake",
          calories: 305,
          fat: 3.7,
          carbs: 67,
          protein: 4.3,
          sodium: 413,
          calcium: "3%",
          iron: "8%",
        },
        {
          name: "Gingerbread",
          calories: 356,
          fat: 16.0,
          carbs: 49,
          protein: 3.9,
          sodium: 327,
          calcium: "7%",
          iron: "16%",
        },
        {
          name: "Jelly bean",
          calories: 375,
          fat: 0.0,
          carbs: 94,
          protein: 0.0,
          sodium: 50,
          calcium: "0%",
          iron: "0%",
        },
        {
          name: "Lollipop",
          calories: 392,
          fat: 0.2,
          carbs: 98,
          protein: 0,
          sodium: 38,
          calcium: "0%",
          iron: "2%",
        },
        {
          name: "Honeycomb",
          calories: 408,
          fat: 3.2,
          carbs: 87,
          protein: 6.5,
          sodium: 562,
          calcium: "0%",
          iron: "45%",
        },
        {
          name: "Donut",
          calories: 452,
          fat: 25.0,
          carbs: 51,
          protein: 4.9,
          sodium: 326,
          calcium: "2%",
          iron: "22%",
        },
        {
          name: "KitKat",
          calories: 518,
          fat: 26.0,
          carbs: 65,
          protein: 7,
          sodium: 54,
          calcium: "12%",
          iron: "6%",
        },
      ];

      this.bools.loading = false;
    },
  },
});
</script>

<style scoped>
.custom-card {
  border-radius: 8px; /* Smooth rounded corners */
  padding: 16px;
  margin: 10px;
  text-align: center;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); /* Subtle shadow for depth */
  color: #424242; /* Default fallback text color */
}

.card-title {
  font-size: 14.5px;
  font-weight: 500;
  margin-bottom: 8px;
  color: inherit; /* Use parent card's text color */
}

/* Card Number */
.card-number {
  font-size: 2rem;
  font-weight: bold;
  margin: 0;
  color: inherit; /* Use parent card's text color */
}

.card-icon {
  font-size: 36px;
  margin-right: 15px;
}

.filter-button {
  background-color: #fbc02d; /* Soft Gold */
  color: #ffffff;
  border: none;
  border-radius: 6px;
  padding: 8px 16px;
  font-size: 14.5px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.filter-button:hover {
  background-color: #f9a825; /* Slightly darker gold */
}
</style>
