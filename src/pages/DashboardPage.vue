<template>
  <q-page class="q-pa-md">
    <div class="row items-center q-col-gutter-md">
      <div class="col-12">
        <div class="row q-col-gutter-x-sm">
          <div
            class="col-xl col-lg col-md-6 col-sm-12 col-xs-12"
            v-for="data in this.dashboardData"
            :key="data"
          >
            <q-card
              class="custom-card text-center cursor-pointer"
              v-ripple
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
      </div>
      <div class="col-12">
        <q-tabs
          v-model="initTab"
          dense
          class="bg-light bordered shadow-1 accent-text-dark"
          active-bg-color="primary"
          active-class="bg-dark"
          indicator-color="primary"
          align="justify"
          narrow-indicator
          outside-arrows
          mobile-arrows
          inline-label
        >
          <q-tab name="workOrders" icon="fa fa-screwdriver" label="WORK ORDERS">
            <q-badge color="red" style="right: -45px" floating>{{
              this.workOrders.length
            }}</q-badge>
          </q-tab>
          <q-tab name="equipments" icon="fa fa-fax" label="EQUIPMENT">
            <q-badge color="red" style="right: -45px" floating>{{
              this.equipments.length
            }}</q-badge>
          </q-tab>
        </q-tabs>
        <q-separator color="bg-dark"></q-separator>

        <q-tab-panels v-model="initTab" animated>
          <q-tab-panel name="equipments" class="q-pa-none">
            <table-details
              class="full-height flex-grow-1"
              :columns="this.equipmentsColumns"
              :rows="this.equipments"
              :rowKey="'name'"
              :loading="this.bools.loading"
              :title="'EQUIPMENT'"
              :table-height="'61vh'"
              :add-btn="true"
              @emitAddBtn="openAddDialog"
              @emitRow="openEditDialog"
            ></table-details>
          </q-tab-panel>

          <q-tab-panel name="workOrders" class="q-pa-none">
            <table-details-work-order
              class="full-height flex-grow-1"
              :columns="this.workOrdersColumns"
              :rows="this.workOrders"
              :rowKey="'name'"
              :loading="this.bools.loading"
              :title="'WORK ORDERS'"
              :table-height="'61vh'"
              :add-btn="true"
              :workOrders="this.workOrders"
              ref="workOrderTable"
              @emitRow="openWorkOrderDialog"
              @dateSet="initStore()"
            ></table-details-work-order>
          </q-tab-panel>
        </q-tab-panels>
      </div>
    </div>

    <q-dialog v-model="bools.infoDialog">
      <equipment-form
        :dialogAction="this.dialogAction"
        :detailsInfo="this.infoDetails"
        @setLoading="(val) => (this.bools.loading = val)"
        @initDialog="initDialog"
        @openRepairDialog="(val) => (this.bools.repairDialog = true)"
      ></equipment-form>
    </q-dialog>

    <q-dialog v-model="bools.repairDialog">
      <q-card>
        <q-card-section class="bg-light text-body1">
          <div class="row q-col-gutter-x-md justify-between items-center">
            <span> TAG EQUIPMENT FOR REPAIR </span>
            <span v-if="infoDetails.serialNumber !== ''">
              <q-chip color="warning" size="sm" icon="fa fa-check-to-slot">{{
                infoDetails.serialNumber
              }}</q-chip>
            </span>
          </div>
        </q-card-section>
        <q-card-section>
          <q-input
            v-model="repairDetails.description"
            filled
            square
            stack-label
            type="textarea"
            autofocus
            label-slot
            hide-bottom-space
            dense
            :rules="[(val) => !!val || 'Details are required']"
          >
            <template v-slot:label>
              Enter details about the repair...
              <span class="text-weight-bold text-red"> *</span>
            </template>
          </q-input>
        </q-card-section>
        <q-card-section align="right">
          <q-btn
            color="warning"
            label="REPAIR"
            v-if="this.dialogAction === 'edit'"
            size="sm"
            text-color="black"
            icon="fa fa-wrench"
            @click="repairEquipment"
          >
          </q-btn>
        </q-card-section>
      </q-card>
    </q-dialog>

    <q-dialog maximized v-model="bools.workOrderDialog">
      <q-card>
        <q-layout view="hHh LpR fFf">
          <q-header class="q-pa-sm bg-light">
            <div class="row items-center justify-between">
              <q-btn
                @click="this.bools.leftDrawer = !this.bools.leftDrawer"
                icon="fa fa-bars"
                flat
                round
                class="q-ma-sm"
              ></q-btn>
              <div class="col row items-start justify-start text-uppercase">
                <div class="col column">
                  <!-- <span>
                    WORK ORDER #:
                    <span class="text-weight-bold">{{
                      this.infoDetails.workOrderCode
                    }}</span>
                  </span> -->
                  <span>
                    SERIAL NUMBER:
                    <span class="text-weight-bold">{{
                      this.infoDetails.serialNumber
                    }}</span>
                  </span>
                  <span>
                    PROPERTY CODE:
                    <span class="text-weight-bold">{{
                      this.infoDetails.propertyCode
                    }}</span>
                  </span>
                </div>

                <div class="col column">
                  <span>
                    NAME:
                    <span class="text-weight-bold">{{
                      this.infoDetails.name
                    }}</span>
                  </span>
                  <span>
                    DEPARTMENT:
                    <span class="text-weight-bold">{{
                      this.infoDetails.departmentName
                    }}</span>
                  </span>
                </div>
                <div class="col-7 column">
                  <span>
                    BRAND & MODEL:
                    <span class="text-weight-bold"
                      >{{ this.infoDetails.brand }} -
                      {{ this.infoDetails.model }}</span
                    >
                  </span>
                  <span>
                    SUPPLIER:
                    <span class="text-weight-bold"
                      >{{ this.infoDetails.supplierName }}
                    </span></span
                  >
                </div>
              </div>

              <div>
                <q-btn
                  label="CLOSE"
                  icon="fa fa-times"
                  color="red"
                  size="sm"
                  v-close-popup
                ></q-btn>
              </div>
            </div>
          </q-header>

          <!-- <q-drawer
            v-model="bools.leftDrawer"
            show-if-above
            :width="220"
            class="bg-light"
            style="
              border-top: 1px solid #fafafa;
              border-bottom: 1px solid #fafafa;
            "
          >
            <div class="q-pa-md">HISTORY</div>
          </q-drawer> -->

          <q-form
            autofocus
            greedy
            autocorrect="off"
            autocomplete="off"
            spellcheck="false"
            ref="assessmentForm"
            @validation-error="validationError"
            @submit="validateAssessment(1)"
          >
            <q-page-container>
              <q-card-section style="height: 80vh !important" class="scroll">
                <div class="row q-col-gutter-y-sm">
                  <!-- <div class="col-12">
                    <q-input
                      stack-label
                      filled
                      v-model="infoDetails.scheduleAt"
                      mask="date"
                      label-slot
                      dense
                      hide-bottom-space
                      square
                    >
                      <template v-slot:label> Date Schedule </template>
                      <template v-slot:append>
                        <q-icon name="event" class="cursor-pointer">
                          <q-popup-proxy
                            cover
                            transition-show="scale"
                            transition-hide="scale"
                          >
                            <q-date v-model="infoDetails.scheduleAt">
                              <div class="row items-center justify-end">
                                <q-btn
                                  v-close-popup
                                  label="Close"
                                  color="red"
                                  size="sm"
                                />
                              </div>
                            </q-date>
                          </q-popup-proxy>
                        </q-icon>
                      </template>
                    </q-input>
                  </div> -->
                  <div
                    class="col-12"
                    v-if="this.infoDetails.workOrderType === 'PREVENTIVE'"
                  >
                    <q-input
                      stack-label
                      filled
                      v-model="infoDetails.scheduleAt"
                      mask="date"
                      label-slot
                      dense
                      hide-bottom-space
                      square
                      :rules="[
                        (val) =>
                          !!val || 'Enter next preventive maintenance date.',
                      ]"
                    >
                      <template v-slot:label>
                        Next Preventive Maintenance Date
                      </template>
                      <template v-slot:append>
                        <q-icon name="event" class="cursor-pointer">
                          <q-popup-proxy
                            cover
                            transition-show="scale"
                            transition-hide="scale"
                          >
                            <q-date v-model="infoDetails.scheduleAt">
                              <div class="row items-center justify-end">
                                <q-btn
                                  v-close-popup
                                  label="Close"
                                  color="red"
                                  size="sm"
                                />
                              </div>
                            </q-date>
                          </q-popup-proxy>
                        </q-icon>
                      </template>
                    </q-input>
                  </div>

                  <div
                    class="col-12"
                    v-if="this.infoDetails.workOrderType === 'PREVENTIVE'"
                  >
                    <q-card square>
                      <q-card-section class="bg-light">
                        TASK LIST
                      </q-card-section>
                      <q-card-section
                        class="q-pa-sm"
                        v-if="this.infoDetails.taskList !== undefined"
                      >
                        <q-list
                          separator
                          dense
                          v-if="this.infoDetails.taskList.length > 0"
                        >
                          <div
                            class="row items-center"
                            v-for="task in this.infoDetails.taskList"
                            :key="task"
                          >
                            <q-item
                              style="
                                border-bottom: 1px solid rgba(0, 0, 0, 0.12);
                              "
                              class="col-8"
                              tag="label"
                              v-ripple
                            >
                              <q-item-section avatar>
                                <q-icon color="primary" name="fa fa-list" />
                              </q-item-section>
                              <q-item-section>
                                <q-item-label>{{
                                  task.description
                                }}</q-item-label>
                              </q-item-section>
                              <q-item-section avatar>
                                <q-toggle
                                  checked-icon="check"
                                  unchecked-icon="clear"
                                  color="primary"
                                  toggle-indeterminate
                                  :true-value="1"
                                  :false-value="0"
                                  :indeterminate-value="null"
                                  :label="
                                    task.taskStatus
                                      ? 'YES'
                                      : task.taskStatus === ''
                                      ? 'N/A'
                                      : 'NO'
                                  "
                                  v-model="task.taskStatus"
                                />
                              </q-item-section>
                            </q-item>

                            <div class="col">
                              <q-input
                                square
                                filled
                                v-model="task.taskRemarks"
                                stack-label
                                label-slot
                                hide-bottom-space
                                dense
                              >
                                <template v-slot:label> Remarks </template>
                              </q-input>
                            </div>
                          </div>
                        </q-list>

                        <div v-else class="text-center text-h6">
                          NO TASK LISTED FOR THIS EQUIPMENT
                        </div>
                      </q-card-section>
                    </q-card>
                  </div>

                  <div class="col-12">
                    <q-input
                      square
                      filled
                      v-model="infoDetails.workOrderDescription"
                      stack-label
                      label-slot
                      hide-bottom-space
                      dense
                      type="textarea"
                      :rules="[
                        (val) => !!val || 'Enter remarks / recommendations.',
                      ]"
                    >
                      <template v-slot:label>
                        Enter remarks / recommendations ...
                        <span class="text-weight-bold text-red"> *</span>
                      </template>
                    </q-input>
                  </div>
                </div>
              </q-card-section>
            </q-page-container>

            <q-footer class="q-pa-sm bg-light">
              <div class="row justify-between items-center">
                <div>
                  <q-chip
                    color="warning"
                    size="sm"
                    icon="fa fa-wrench"
                    text-color="black"
                  >
                    {{ infoDetails.workOrderType }}
                  </q-chip>
                </div>
                <div>
                  <q-btn-group>
                    <!-- <q-btn label="ASSESSMENT" class="bg-dark"></q-btn> -->
                    <q-btn
                      label="PRINT"
                      color="primary"
                      icon="fa fa-print"
                      @click="bools.printoutDialog = true"
                      size="sm"
                    ></q-btn>
                    <q-btn
                      :label="
                        this.dialogAction === 'add'
                          ? 'ASSESS EQUIPMENT'
                          : 'UPDATE ASSESSMENT'
                      "
                      class="info-bg-dark"
                      icon="fa fa-clock"
                      size="sm"
                      type="submit"
                      v-if="infoDetails.workOrderStatusDesc !== 'COMPLETED'"
                    ></q-btn>
                    <q-btn
                      label="COMPLETE"
                      icon="fa fa-check-to-slot"
                      color="positive"
                      size="sm"
                      @click="validateAssessment(2)"
                      v-if="infoDetails.workOrderStatusDesc === 'PENDING'"
                    ></q-btn>
                  </q-btn-group>
                </div>
              </div>
            </q-footer>
          </q-form>
        </q-layout>
      </q-card>
    </q-dialog>

    <q-dialog maximized v-model="bools.printoutDialog">
      <work-order-printout></work-order-printout>
    </q-dialog>

    <q-dialog v-model="bools.assessDialog">
      <q-card class="card-dialog-width">
        <q-card-section class="bg-light">
          <span v-if="this.infoDetails.finalStatus === 1"
            >ASSESS EQUIPMENT</span
          >
          <span v-else>COMPLETE EQUIPMENT ASSESSMENT</span>
        </q-card-section>
        <q-form
          autofocus
          greedy
          autocorrect="off"
          autocomplete="off"
          spellcheck="false"
          ref="assessmentDialogForm"
          @validation-error="validationError"
          @submit="assessEquipment(this.infoDetails.finalStatus)"
        >
          <q-card-section>
            <div class="row q-col-gutter-y-sm">
              <div class="col-12">
                <q-input
                  stack-label
                  filled
                  v-model="infoDetails.assessAt"
                  label-slot
                  dense
                  hide-bottom-space
                  square
                  :rules="[(val) => !!val || 'Enter Assessment Date / Time']"
                >
                  <template v-slot:label>
                    Assessment Date / Time
                    <span class="text-weight-bold text-red"> *</span>
                  </template>
                  <template v-slot:prepend>
                    <q-icon name="event" class="cursor-pointer">
                      <q-popup-proxy
                        cover
                        transition-show="scale"
                        transition-hide="scale"
                      >
                        <q-date
                          v-model="infoDetails.assessAt"
                          mask="YYYY-MM-DD HH:mm"
                        >
                          <div class="row items-center justify-end">
                            <q-btn
                              v-close-popup
                              label="Close"
                              color="primary"
                              flat
                            />
                          </div>
                        </q-date>
                      </q-popup-proxy>
                    </q-icon>
                  </template>
                  <template v-slot:append>
                    <q-icon name="access_time" class="cursor-pointer">
                      <q-popup-proxy
                        cover
                        transition-show="scale"
                        transition-hide="scale"
                      >
                        <q-time
                          v-model="infoDetails.assessAt"
                          mask="YYYY-MM-DD HH:mm"
                          format24h
                        >
                          <div class="row items-center justify-end">
                            <q-btn
                              v-close-popup
                              label="Close"
                              color="primary"
                              flat
                            />
                          </div>
                        </q-time>
                      </q-popup-proxy>
                    </q-icon>
                  </template>
                </q-input>
              </div>
              <div class="col-12">
                <q-input
                  stack-label
                  filled
                  v-model="infoDetails.startWorkAt"
                  label-slot
                  dense
                  hide-bottom-space
                  square:rules="[(val) => !!val || 'Enter Assessment Date / Time']"
                >
                  <template v-slot:label>
                    Start Work Date / Time
                    <span class="text-weight-bold text-red"> *</span>
                  </template>
                  <template v-slot:prepend>
                    <q-icon name="event" class="cursor-pointer">
                      <q-popup-proxy
                        cover
                        transition-show="scale"
                        transition-hide="scale"
                      >
                        <q-date
                          v-model="infoDetails.startWorkAt"
                          mask="YYYY-MM-DD HH:mm"
                        >
                          <div class="row items-center justify-end">
                            <q-btn
                              v-close-popup
                              label="Close"
                              color="primary"
                              flat
                            />
                          </div>
                        </q-date>
                      </q-popup-proxy>
                    </q-icon>
                  </template>
                  <template v-slot:append>
                    <q-icon name="access_time" class="cursor-pointer">
                      <q-popup-proxy
                        cover
                        transition-show="scale"
                        transition-hide="scale"
                      >
                        <q-time
                          v-model="infoDetails.assessAt"
                          mask="YYYY-MM-DD HH:mm"
                          format24h
                        >
                          <div class="row items-center justify-end">
                            <q-btn
                              v-close-popup
                              label="Close"
                              color="primary"
                              flat
                            />
                          </div>
                        </q-time>
                      </q-popup-proxy>
                    </q-icon>
                  </template>
                </q-input>
              </div>
            </div>
          </q-card-section>
          <q-card-section align="right">
            <q-btn
              :label="
                this.dialogAction === 'add'
                  ? 'START ASSESSMENT'
                  : this.infoDetails.finalStatus === 1
                  ? 'UPDATE ASSESSMENT'
                  : 'COMPLETE ASSESSMENT'
              "
              icon="fa fa-arrow-right"
              :class="
                this.infoDetails.finalStatus === 1 ? 'bg-dark' : 'bg-positive'
              "
              :text-color="this.infoDetails.finalStatus === 1 ? '' : 'white'"
              type="submit"
              size="sm"
            ></q-btn>
          </q-card-section>
        </q-form>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script>
const utils = require("src/util");
import { defineComponent } from "vue";
import { mapGetters } from "vuex";
import TableDetails from "src/components/Helpers/TableDetails.vue";
import TableDetailsWorkOrder from "src/components/Helpers/TableDetailsWorkOrder.vue";
import EquipmentForm from "src/components/EquipmentForm.vue";
import WorkOrderPrintout from "src/components/Printout/WorkOrderPrintout.vue";
import { date } from "quasar";

export default defineComponent({
  components: {
    TableDetails,
    TableDetailsWorkOrder,
    EquipmentForm,
    WorkOrderPrintout,
  },
  data() {
    return {
      bools: {
        loading: false,
        infoDialog: false,
        repairDialog: false,
        workOrderDialog: false,
        printoutDialog: false,
        assessDialog: false,
      },
      initTab: "workOrders",
      dialogAction: "add",
      infoDetails: {},
      repairDetails: {},
      rows: [],
      dashboardData: [],
    };
  },
  computed: {
    ...mapGetters({
      equipmentsColumns: "equipments/equipmentsColumns",
      workOrdersColumns: "workOrders/workOrdersColumns",
      equipments: "equipments/equipments",
      suppliersActiveHashMap: "suppliers/suppliersActiveHashMap",
      suppliersActiveOptions: "suppliers/suppliersActiveOptions",
      departmentsActiveHashMap: "departments/departmentsActiveHashMap",
      departmentsActiveOptions: "departments/departmentsActiveOptions",
      equipmentsTypeOptions: "equipments/equipmentsTypeOptions",
      equipmentsTypeHashMap: "equipments/equipmentsTypeHashMap",
      workOrders: "workOrders/workOrders",
    }),
  },
  mounted() {
    // this.formatFilterDates();
    this.initStore();
  },
  watch: {
    initTab(val) {
      this.initStore();
    },
  },
  methods: {
    // formatFilterDates() {
    //   const currentDate = new Date();

    //   // Get the first day of the month
    //   const firstDayOfMonth = new Date(
    //     currentDate.getFullYear(),
    //     currentDate.getMonth(),
    //     1
    //   );

    //   const lastDayOfMonth = new Date(
    //     currentDate.getFullYear(),
    //     currentDate.getMonth() + 1,
    //     0
    //   );

    //   // Format the dates as YYYY/MM/DD
    //   const formatDate = (date) => {
    //     const year = date.getFullYear();
    //     const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are 0-based, so add 1
    //     const day = String(date.getDate()).padStart(2, "0");
    //     return `${year}/${month}/${day}`;
    //   };

    //   this.date.from = formatDate(firstDayOfMonth);
    //   this.date.to = formatDate(lastDayOfMonth);

    //   this.dateLabel = `${this.date.from} - ${this.date.to}`;
    // },
    async initStore() {
      this.bools.loading = true;
      await this.$store.dispatch("equipments/getEquipments");

      if (this.initTab === "workOrders") {
        await this.$store.dispatch("workOrders/getWorkOrders", {
          month: this.$refs.workOrderTable.monthYear,
        });
      }

      this.setAnalyticsDashboard();
      await utils.delay(1500);
      this.bools.loading = false;
    },

    setAnalyticsDashboard() {
      let filterActiveEquipments = this.equipments.filter(
        (filterActiveEquipments) => filterActiveEquipments.active === 1
      );
      let pendingWorkOrders = this.workOrders.filter(
        (filterPending) => filterPending.workOrderStatusDesc !== "COMPLETED"
      );

      let completedWorkOrders = this.workOrders.filter(
        (filterCompleted) => filterCompleted.workOrderStatusDesc === "COMPLETED"
      );
      this.dashboardData = [
        {
          name: "Total Equipment",
          count: this.equipments.length,
          color: "#B3E5FC",
          textColor: "#01579B",
          icon: "fas fa-cogs",
        },
        {
          name: "Equipment Utilization",
          count: filterActiveEquipments.length,
          color: "#FFF9C4",
          textColor: "#424242",
          icon: "fas fa-bar-chart",
        },
        {
          name: "Pending Work Orders",
          count: pendingWorkOrders.length,
          color: "#FFE082",
          textColor: "#BF360C",
          icon: "fas fa-spinner",
        },
        {
          name: "Completed Work Orders",
          count: completedWorkOrders.length,
          color: "#C8E6C9",
          textColor: "#2E7D32",
          icon: "fas fa-clipboard-check",
        },
      ];
    },
    async initDialog() {
      this.bools.infoDialog = false;
      await this.initStore();
    },
    async setNotificationPayload(payload) {
      let notifPayload = {
        displayNotify: payload.displayNotify,
        message: payload.message,
        type: payload.type,
      };
      await this.$store.dispatch("helpers/setNotification", notifPayload);
    },
    openAddDialog(status) {
      this.infoDetails = {
        code: "",
        serialNumber: "",
      };
      this.dialogAction = "add";
      this.bools.infoDialog = status;
    },
    openEditDialog(row) {
      this.dialogAction = "edit";
      this.bools.infoDialog = true;
      this.infoDetails = JSON.parse(JSON.stringify(row));
    },
    validationError(vm) {
      vm.$el.scrollIntoView();
    },

    async repairEquipment() {
      this.$q
        .dialog({
          title: "Confirmation",
          message: "Are you sure you want to tag this equipment as FOR REPAIR?",
          ok: {
            push: true,
          },
          cancel: {
            push: true,
            color: "negative",
          },
        })
        .onOk(async () => {
          const payload = {
            equipmentCode: this.infoDetails.code,
            description: this.repairDetails.description,
          };

          this.bools.loading = true;
          await this.$store.dispatch("equipments/repairEquipment", payload);

          this.bools.infoDialog = false;
          this.bools.repairDialog = false;
          this.repairDetails = {};

          let notifPayload = {
            displayNotify: true,
            message: "Successfully updated the equipment!",
            type: "positive",
          };
          this.setNotificationPayload(notifPayload);
          this.initStore();

          await utils.delay(1500);
          let notifInitPayload = {
            displayNotify: false,
            message: "",
            type: "",
          };
          this.setNotificationPayload(notifInitPayload);

          this.bools.loading = false;
        });
    },

    async openWorkOrderDialog(row) {
      this.bools.workOrderDialog = true;
      this.infoDetails = JSON.parse(JSON.stringify(row));

      if (this.infoDetails.workOrderCode !== null) {
        this.dialogAction = "edit";
      } else {
        this.dialogAction = "add";
      }

      const taskList = await this.$store.dispatch(
        "equipments/getEquipmentsDetails",
        {
          id: this.infoDetails.code,
        }
      );

      this.infoDetails.taskList = taskList.filter(
        (filterActive) => filterActive.active === 1
      );

      const workOrderDetails = await this.$store.dispatch(
        "workOrders/getWorkOrderDetails",
        {
          workOrderCode: this.infoDetails.workOrderCode,
          equipmentCode: this.infoDetails.code,
        }
      );

      if (workOrderDetails.length > 0) {
        this.infoDetails.taskList.forEach((item) => {
          const match = workOrderDetails.find(
            (second) => second.taskCode === item.code
          );

          if (match) {
            item.taskStatus = match.taskStatus === null ? "" : match.taskStatus;
            item.taskRemarks = match.taskRemarks;
            item.taskId = match.taskId;
          }
        });
      }
    },

    async validateAssessment(type) {
      await this.$refs.assessmentForm.validate().then(async (valid) => {
        if (!valid) {
          return false;
        }

        this.bools.assessDialog = true;
        if (this.dialogAction !== "edit") {
          const newDate = Date.now();
          const currentDate = date.formatDate(newDate, "YYYY-MM-DD HH:mm");
          this.infoDetails.assessAt = currentDate;
          this.infoDetails.startWorkAt = currentDate;
        }

        this.infoDetails.finalStatus = type;
      });
    },

    async assessEquipment(status) {
      let messageOpts = {
        message:
          "Are you sure you want to START THE ASSESSMENT of this equipment?",
        afterSave: "Work Order successfully started.",
      };
      if (this.dialogAction === "edit") {
        if (status === 2) {
          messageOpts = {
            message: "Are you sure you want to COMPLETE this WORKORDER?",
            afterSave: "Work Order successfully completed",
          };
        } else {
          messageOpts = {
            message: "Are you sure you want to UPDATE THIS ASSESSMENT?",
            afterSave: "Work Order successfully updated",
          };
        }
      }

      await this.$refs.assessmentDialogForm.validate().then(async (valid) => {
        if (!valid) {
          return false;
        }

        this.$q
          .dialog({
            title: "Confirmation",
            message: messageOpts.message,
            ok: {
              push: true,
            },
            cancel: {
              push: true,
              color: "negative",
            },
          })
          .onOk(async () => {
            this.bools.loading = true;
            const payload = {
              workOrderCode: this.infoDetails.workOrderCode,
              description: this.infoDetails.workOrderDescription,
              status: status,
              scheduleAt: this.infoDetails.scheduleAt,
              startWorkAt: this.infoDetails.startWorkAt,
              assessAt: this.infoDetails.assessAt,
              equipmentCode: this.infoDetails.code,
              type: this.infoDetails.workOrderType,
              taskList: this.infoDetails.taskList.map((mapTaskList) => {
                return {
                  taskId: mapTaskList.taskId,
                  taskCode: mapTaskList.code,
                  description: utils.empty(mapTaskList.taskRemarks)
                    ? null
                    : mapTaskList.taskRemarks,
                  taskStatus: mapTaskList.taskStatus,
                };
              }),
            };

            if (this.dialogAction === "add") {
              await this.$store.dispatch("workOrders/postWorkOrder", payload);
            } else {
              await this.$store.dispatch("workOrders/putWorkOrder", payload);
            }
            let notifPayload = {
              displayNotify: true,
              message: messageOpts.afterSave,
              type: "positive",
            };
            this.setNotificationPayload(notifPayload);
            this.initStore();
            this.bools.workOrderDialog = false;
            this.bools.assessDialog = false;

            await utils.delay(1500);
            let notifInitPayload = {
              displayNotify: false,
              message: "",
              type: "",
            };
            this.setNotificationPayload(notifInitPayload);

            this.bools.loading = false;
          });
      });
    },
  },
});
</script>

<style scoped>
.full-height {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.custom-card {
  border-radius: 8px; /* Smooth rounded corners */
  padding: 5px;
  margin: 6px;
  text-align: center;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); /* Subtle shadow for depth */
  color: #424242; /* Default fallback text color */
}

.card-title {
  font-size: 12.5px;
  font-weight: 500;
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
