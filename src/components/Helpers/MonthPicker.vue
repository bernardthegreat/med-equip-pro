<template>
  <q-btn
    @click="showPicker = true"
    :label="`${this.title}: ${dateLabel}`"
    size="sm"
    class="secondary-btn"
  />

  <!-- Dialog with QDate -->
  <q-dialog v-model="showPicker" persistent>
    <q-card>
      <q-card-section class="bg-light" align="center">
        <div class="text-body1">SELECT MONTH AND YEAR</div>
      </q-card-section>

      <q-card-section class="q-pb-sm">
        <q-date
          v-model="selectedDate"
          mask="YYYY-MM"
          minimal
          @update:model-value="onDateChange"
          years-in-month-view
          default-view="Months"
          emit-immediately
          class="monthPicker"
        />
      </q-card-section>

      <q-card-actions align="right" class="q-mr-sm q-pt-sm">
        <q-btn label="CLOSE" color="negative" v-close-popup />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script>
const utils = require("src/util");
import { defineComponent, ref } from "vue";

export default defineComponent({
  name: "MonthPicker",
  props: {
    title: {
      type: String,
      default: "MONTH",
    },
  },
  data() {
    return {
      showPicker: false,
      selectedDate: null,
      dateLabel: null,
    };
  },
  created() {
    this.setInitDate();
  },
  emits: ["setMonthYearData"],
  methods: {
    setInitDate() {
      const currentDate = new Date();
      const currentYear = currentDate.getFullYear(); // Gets the current year (e.g., 2025)
      const currentMonth = currentDate.getMonth() + 1;

      this.selectedDate = `${currentYear}-${utils.padNumber(currentMonth)}`;

      this.setDateLabel(utils.padNumber(currentMonth), currentYear);
      this.$emit("setMonthYearData", this.selectedDate);
    },
    onDateChange(value) {
      const [year, month] = value.split("-");
      this.selectedDate = `${year}-${month}`;
      this.setDateLabel(month, year);
      this.showPicker = false;
      this.$emit("setMonthYearData", this.selectedDate);
    },
    setDateLabel(month, year) {
      const monthNames = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
      ];

      const monthLabel = monthNames[month - 1]; // Get the month name

      this.dateLabel = `${monthLabel} ${year}`;
    },
    cancel() {
      this.showPicker = false;
    },
  },
});
</script>

<style>
.q-date__arrow {
  display: none !important;
}
/* Optional CSS to hide the day grid */
/* .q-date__calendar-days {
  display: none !important;
}

.q-date__calendar-weekdays {
  display: none !important;
}

.q-date__calendar {
  min-height: 0;
}

.q-date__calendar-days-container {
  min-height: 0;
} */
</style>
