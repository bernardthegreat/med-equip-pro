<template>
  <q-card class="card-dialog-width">
    <q-card-section class="bg-light text-body1">
      <div class="row justify-between items-center">
        <span>
          {{ this.dialogAction === "add" ? "REGISTER" : "UPDATE" }}
          EQUIPMENT
        </span>
        <span>
          <span v-if="infoDetails.serialNumber !== ''">
            <q-chip color="warning" size="sm" icon="fa fa-check-to-slot">{{
              infoDetails.serialNumber
            }}</q-chip>
          </span>
          <span>
            <q-btn
              icon="fa fa-times"
              color="red"
              label="CLOSE"
              v-close-popup
              size="sm"
            ></q-btn>
          </span>
        </span>
      </div>
    </q-card-section>

    <q-form
      autofocus
      greedy
      autocorrect="off"
      autocomplete="off"
      spellcheck="false"
      ref="registrationForm"
      @validation-error="validationError"
      @submit="save"
    >
      <q-card-section class="scroll" style="height: 75vh !important">
        <div class="row q-col-gutter-y-sm">
          <div class="col-12">
            <q-input
              square
              filled
              v-model="infoDetails.serialNumber"
              autofocus
              stack-label
              label-slot
              hide-bottom-space
              dense
              :rules="[(val) => !!val || 'Serial Number is required']"
            >
              <template v-slot:label>
                Serial Number
                <span class="text-weight-bold text-red"> *</span>
              </template>
            </q-input>
          </div>
          <div class="col-12">
            <q-input
              square
              filled
              v-model="infoDetails.propertyCode"
              autofocus
              stack-label
              label-slot
              hide-bottom-space
              dense
              :rules="[(val) => !!val || 'Property Code is required']"
            >
              <template v-slot:label>
                Property Code
                <span class="text-weight-bold text-red"> *</span>
              </template>
            </q-input>
          </div>
          <div class="col-12">
            <q-input
              square
              filled
              v-model="infoDetails.name"
              autofocus
              stack-label
              label-slot
              hide-bottom-space
              dense
              :rules="[(val) => !!val || 'Brand is required']"
              @update:model-value="
                this.dialogAction === 'add'
                  ? generateCode(infoDetails.serialNumber)
                  : ''
              "
            >
              <template v-slot:label>
                Name
                <span class="text-weight-bold text-red"> *</span>
              </template>
            </q-input>
          </div>
          <div class="col-12">
            <q-input
              square
              filled
              v-model="infoDetails.brand"
              autofocus
              stack-label
              label-slot
              hide-bottom-space
              dense
              :rules="[(val) => !!val || 'Brand is required']"
            >
              <template v-slot:label>
                Brand
                <span class="text-weight-bold text-red"> *</span>
              </template>
            </q-input>
          </div>
          <div class="col-12">
            <q-input
              square
              filled
              v-model="infoDetails.model"
              autofocus
              stack-label
              label-slot
              hide-bottom-space
              dense
              :rules="[(val) => !!val || 'Model is required']"
            >
              <template v-slot:label>
                Model
                <span class="text-weight-bold text-red"> *</span>
              </template>
            </q-input>
          </div>
          <div class="col-12">
            <q-input
              square
              filled
              v-model="infoDetails.description"
              autofocus
              stack-label
              label-slot
              hide-bottom-space
              dense
              type="textarea"
            >
              <template v-slot:label> Description </template>
            </q-input>
          </div>

          <div class="col-12">
            <q-input
              stack-label
              filled
              v-model="infoDetails.warrantyPeriod"
              mask="date"
              label-slot
              dense
              hide-bottom-space
              square
              :rules="[(val) => !!val || 'Warranty is required']"
            >
              <template v-slot:label>
                Warranty Period
                <span class="text-weight-bold text-red"> *</span>
              </template>
              <template v-slot:append>
                <q-icon name="event" class="cursor-pointer">
                  <q-popup-proxy
                    cover
                    transition-show="scale"
                    transition-hide="scale"
                  >
                    <q-date v-model="infoDetails.warrantyPeriod">
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

          <div class="col-12">
            <q-select
              stack-label
              square
              filled
              v-model="infoDetails.type"
              :options="this.equipmentsTypeOptions"
              :rules="[(val) => !!val || 'Field is required']"
              emit-value
              map-options
              label-slot
              dense
              class="accent-text-dark"
              options-dense
              hide-bottom-space
            >
              <template v-slot:label>
                Type
                <span class="text-weight-bold text-red"> *</span>
              </template>
            </q-select>
          </div>

          <div class="col-12">
            <q-select
              stack-label
              square
              filled
              v-model="infoDetails.departmentCode"
              :options="this.optionsDepartments"
              :rules="[(val) => !!val || 'Field is required']"
              emit-value
              map-options
              label-slot
              dense
              class="accent-text-dark"
              options-dense
              hide-bottom-space
              use-input
              input-debounce="0"
              fill-input
              hide-selected
              @filter="filterDepartments"
            >
              <template v-slot:label>
                Department
                <span class="text-weight-bold text-red"> *</span>
              </template>
              <template v-slot:no-option>
                <q-item>
                  <q-item-section class="text-grey">
                    No results
                  </q-item-section>
                </q-item>
              </template>
            </q-select>
          </div>

          <div class="col-12">
            <q-select
              stack-label
              square
              filled
              v-model="infoDetails.supplierCode"
              :options="this.optionsSuppliers"
              :rules="[(val) => !!val || 'Field is required']"
              label-slot
              dense
              emit-value
              map-options
              class="accent-text-dark"
              options-dense
              hide-bottom-space
              use-input
              input-debounce="0"
              fill-input
              hide-selected
              @filter="filterSupplier"
            >
              <template v-slot:label>
                Supplier
                <span class="text-weight-bold text-red"> *</span>
              </template>
              <template v-slot:no-option>
                <q-item>
                  <q-item-section class="text-grey">
                    No results
                  </q-item-section>
                </q-item>
              </template>
            </q-select>
          </div>
        </div>
      </q-card-section>
      <q-card-section class="bg-light" align="right">
        <q-btn-group>
          <q-btn
            label="TASK LIST"
            icon="fa fa-question-circle"
            color="orange"
            text-color="black"
            size="sm"
            @click="openTroubleshooting"
            v-if="this.dialogAction === 'edit'"
          ></q-btn>
          <q-btn
            color="warning"
            label="FOR REPAIR"
            v-if="
              this.dialogAction === 'edit' &&
              this.infoDetails.status !== 'FOR REPAIR' &&
              this.infoDetails.active === 1
            "
            size="sm"
            text-color="black"
            icon="fa fa-wrench"
            @click="this.$emit('openRepairDialog')"
          >
          </q-btn>
          <q-btn
            v-if="this.dialogAction === 'edit'"
            :label="this.infoDetails.active === 1 ? 'DEACTIVATE' : 'ACTIVATE'"
            :color="this.infoDetails.active === 1 ? 'negative' : 'info'"
            :icon="
              this.infoDetails.active === 1 ? 'fa fa-times' : 'fa fa-check'
            "
            @click="
              this.updateInfo(
                this.infoDetails.active === 1 ? 'deactivate' : 'activate'
              )
            "
            size="sm"
          ></q-btn>
          <q-btn
            :label="this.dialogAction === 'add' ? 'REGISTER' : 'UPDATE'"
            :icon="
              this.dialogAction === 'add'
                ? 'fa fa-plus-circle'
                : 'fa fa-user-edit'
            "
            color="positive"
            type="submit"
            size="sm"
          ></q-btn>
        </q-btn-group>
      </q-card-section>
    </q-form>

    <q-dialog v-model="bools.troubleshootingDialog">
      <q-card class="card-dialog-width q-ma-lg" style="width: 600px !important">
        <q-card-section class="bg-light text-body1">
          <div class="row justify-between items-center">
            <span> TASK LIST </span>

            <span>
              <span v-if="this.taskList.length > 0">
                <q-chip color="warning" size="sm" icon="fa fa-check-to-slot">
                  LIST: {{ this.taskList.length }}</q-chip
                >
              </span>

              <span>
                <q-btn
                  icon="fa fa-times"
                  color="red"
                  label="CLOSE"
                  v-close-popup
                  size="sm"
                ></q-btn>
              </span>
            </span>
          </div>
        </q-card-section>
        <q-form
          autofocus
          greedy
          autocorrect="off"
          autocomplete="off"
          spellcheck="false"
          ref="taskForm"
          @validation-error="validationError"
          @submit="saveTaskList"
        >
          <q-card-section class="scroll" style="max-height: 75vh !important">
            <div class="row q-col-gutter-y-sm">
              <div class="col-12">
                <draggable
                  class="cursor-pointer"
                  v-model="this.taskList"
                  group="courses"
                  @start="drag = true"
                  @end="drag = false"
                  item-key="appNumber"
                  preventOnFilter="true"
                  :delay="100"
                  :delay-on-touch-only="true"
                  :touch-start-threshold="35"
                  v-bind="{ animation: 250 }"
                >
                  <template #item="{ element, index }">
                    <q-list bordered>
                      <q-item v-ripple>
                        <q-item-section>
                          <q-input
                            square
                            filled
                            v-model="element.description"
                            autofocus
                            stack-label
                            label-slot
                            hide-bottom-space
                            dense
                            :rules="[
                              (val) => !!val || 'Description is required',
                            ]"
                          >
                            <template v-slot:label>
                              Description
                              <span class="text-weight-bold text-red"> *</span>
                            </template>
                          </q-input>
                        </q-item-section>
                        <q-item-section
                          side
                          caption
                          v-if="this.taskList.length > 1"
                        >
                          <q-btn
                            @click="removeToList(element, index)"
                            size="sm"
                            icon="fa fa-times"
                            color="red"
                            round
                          >
                            <q-tooltip> REMOVE </q-tooltip>
                          </q-btn>
                        </q-item-section>
                      </q-item>
                    </q-list>
                  </template>
                </draggable>
              </div>

              <!-- <div
                class="col-12"
                v-for="(task, index) in this.taskList"
                :key="index"
              >
                <q-input
                  square
                  filled
                  v-model="task.description"
                  autofocus
                  stack-label
                  label-slot
                  hide-bottom-space
                  dense
                  :rules="[(val) => !!val || 'Description is required']"
                >
                  <template v-slot:label>
                    Description
                    <span class="text-weight-bold text-red"> *</span>
                  </template>

                  <template v-slot:append>
                    <q-btn
                      @click="removeToList(task, index)"
                      size="sm"
                      icon="fa fa-times"
                      color="red"
                      round
                    >
                      <q-tooltip> REMOVE </q-tooltip>
                    </q-btn>
                  </template>
                </q-input>
              </div> -->
            </div>

            <!-- <q-card>
            Task List:
            <pre>
          {{ this.taskList }}
        </pre
            >
          </q-card>

          <q-card>
            For Deletion:
            <pre>
          {{ this.taskForDeletion }}
        </pre
            >
          </q-card> -->
          </q-card-section>

          <q-card-section align="right">
            <q-btn-group>
              <q-btn
                label="ADD"
                size="sm"
                color="primary"
                icon="fa fa-add"
                @click="addToList"
              ></q-btn>
              <q-btn
                label="SAVE"
                size="sm"
                color="positive"
                icon="fa fa-save"
                type="submit"
              ></q-btn>
            </q-btn-group>
          </q-card-section>
        </q-form>
      </q-card>
    </q-dialog>
  </q-card>
</template>

<script>
const utils = require("src/util");
import { defineComponent } from "vue";
import { mapGetters } from "vuex";
import draggable from "vuedraggable";

export default defineComponent({
  name: "EquipmentForm",
  components: {
    draggable,
  },
  props: {
    detailsInfo: {
      type: Object,
    },
    dialogAction: {
      type: String,
    },
  },
  data() {
    return {
      bools: {
        loading: false,
        troubleshootingDialog: false,
      },
      infoDetails: {},
      optionsSuppliers: [],
      optionsDepartments: [],
      taskList: [],
      taskForDeletion: [],
    };
  },
  emits: ["setLoading", "initDialog", "openRepairDialog"],
  mounted() {
    this.optionsSuppliers = this.suppliersActiveOptions;
    this.optionsDepartments = this.departmentsActiveOptions;
    this.infoDetails = JSON.parse(JSON.stringify(this.detailsInfo));

    this.infoDetails.warrantyPeriod = utils.formatDate({
      date: this.infoDetails.warrantyPeriod,
      straightDate: true,
    });
  },
  computed: {
    ...mapGetters({
      equipments: "equipments/equipments",
      suppliersActiveHashMap: "suppliers/suppliersActiveHashMap",
      suppliersActiveOptions: "suppliers/suppliersActiveOptions",
      departmentsActiveHashMap: "departments/departmentsActiveHashMap",
      departmentsActiveOptions: "departments/departmentsActiveOptions",
      equipmentsTypeOptions: "equipments/equipmentsTypeOptions",
      equipmentsTypeHashMap: "equipments/equipmentsTypeHashMap",
    }),
  },
  methods: {
    async setNotificationPayload(payload) {
      let notifPayload = {
        displayNotify: payload.displayNotify,
        message: payload.message,
        type: payload.type,
      };
      await this.$store.dispatch("helpers/setNotification", notifPayload);
    },
    async save() {
      let messageOpts = {
        message: "register",
        afterSave: "registered",
      };
      if (this.dialogAction === "edit") {
        messageOpts = {
          message: "update",
          afterSave: "updated",
        };
      }

      await this.$refs.registrationForm.validate().then(async (valid) => {
        if (!valid) {
          return false;
        }

        this.$q
          .dialog({
            title: "Confirmation",
            message: `Are you sure you want to ${messageOpts.message} this equipment?`,
            ok: {
              push: true,
            },
            cancel: {
              push: true,
              color: "negative",
            },
          })
          .onOk(async () => {
            await this.$emit("setLoading", true);
            if (this.dialogAction === "edit") {
              const clonedPayload = JSON.parse(
                JSON.stringify(this.infoDetails)
              );

              const payload = {
                id: clonedPayload.id,
                serialNumber: clonedPayload.serialNumber,
                propertyCode: clonedPayload.propertyCode,
                name: clonedPayload.name,
                brand: clonedPayload.brand,
                model: clonedPayload.model,
                description: clonedPayload.description,
                type: clonedPayload.type,
                supplierCode: clonedPayload.supplierCode,
                departmentCode: clonedPayload.departmentCode,
                warrantyPeriod: clonedPayload.warrantyPeriod,
              };

              await this.$store.dispatch("equipments/putEquipment", payload);
            } else {
              await this.$store.dispatch(
                "equipments/postEquipment",
                this.infoDetails
              );
            }

            let notifPayload = {
              displayNotify: true,
              message: `Equipment successfully ${messageOpts.afterSave}!`,
              type: "positive",
            };
            this.setNotificationPayload(notifPayload);

            await this.$emit("initDialog");
            await utils.delay(1500);
            let notifInitPayload = {
              displayNotify: false,
              message: "",
              type: "",
            };
            this.setNotificationPayload(notifInitPayload);

            await this.$emit("setLoading", false);
          });
      });
    },

    generateCode(name) {
      this.infoDetails.code = name.replace(/[\s-]+/g, "").toLowerCase();
    },

    validationError(vm) {
      vm.$el.scrollIntoView();
    },

    async openTroubleshooting() {
      this.bools.troubleshootingDialog = true;
      const taskList = await this.$store.dispatch(
        "equipments/getEquipmentsDetails",
        { id: this.detailsInfo.code }
      );

      this.taskList = taskList.filter(
        (filterActive) => filterActive.active === 1
      );

      if (this.taskList.length === 0) {
        this.taskList.push({
          description: "",
        });
      }
      // this.taskList.push({
      //   description: "",
      // });
    },

    async updateInfo(type) {
      await this.$refs.registrationForm.validate().then(async (valid) => {
        if (!valid) {
          return false;
        }
        let messageOpts = {
          message: "Are you sure you want to activate this equipment?",
          afterSave: "Equipment activated",
        };
        if (type === "deactivate") {
          messageOpts = {
            message: "Are you sure you want to deactivate this equipment?",
            afterSave: "Equipment deactivated",
          };
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
            await this.$emit("setLoading", true);
            const filterData = this.equipments.filter(
              (filterData) => filterData.id === this.infoDetails.id
            );

            const payload = {
              active: type === "deactivate" ? 0 : 1,
              id: filterData[0].id,
            };

            await this.$store.dispatch("equipments/putEquipment", payload);

            await this.$emit("initDialog");

            let notifPayload = {
              displayNotify: true,
              message: messageOpts.afterSave,
              type: "positive",
            };
            this.setNotificationPayload(notifPayload);

            await utils.delay(1500);
            let notifInitPayload = {
              displayNotify: false,
              message: "",
              type: "",
            };
            this.setNotificationPayload(notifInitPayload);

            await this.$emit("setLoading", false);
          });
      });
    },

    addToList() {
      this.taskList.push({
        description: "",
      });
    },

    removeToList(item, index) {
      // if (this.items.length > 0) {
      //   this.items.push(item);
      // }

      if (item.code !== undefined) {
        this.taskForDeletion.push(item);
      }

      const shallowCopyArray = Array.from(this.taskList);
      shallowCopyArray.splice(index, 1);
      this.taskList = shallowCopyArray;
    },

    async saveTaskList() {
      await this.$refs.taskForm.validate().then(async (valid) => {
        if (!valid) {
          return false;
        }

        this.$q
          .dialog({
            title: "Confirmation",
            message: `Are you sure you want to save task(s)?`,
            ok: {
              push: true,
            },
            cancel: {
              push: true,
              color: "negative",
            },
          })
          .onOk(async () => {
            await this.$emit("setLoading", true);

            if (this.taskList.length > 0) {
              for (const [index, value] of this.taskList.entries()) {
                value.newSequence = index + 1;
              }
            }

            const insertPayloadMap = this.taskList
              .filter((filterNew) => {
                return filterNew.code === undefined;
              })
              .map((mapInsert, index) => {
                return {
                  equipmentCode: this.infoDetails.code,
                  description: mapInsert.description,
                  sequence: mapInsert.newSequence,
                };
              });
            const updatePayloadMap = this.taskList
              .filter((filterNew) => {
                return filterNew.code !== undefined;
              })
              .map((mapUpdate, index) => {
                return {
                  taskId: mapUpdate.id,
                  code: mapUpdate.code,
                  description: mapUpdate.description,
                  sequence: mapUpdate.newSequence,
                };
              });

            const deletePayloadMap = this.taskForDeletion.map((mapUpdate) => {
              return {
                taskId: mapUpdate.id,
                code: mapUpdate.code,
              };
            });
            const payload = {
              id: this.infoDetails.code,
              insertPayload: insertPayloadMap,
              updatePayload: updatePayloadMap,
              deletionPayload: deletePayloadMap,
            };

            await this.$store.dispatch(
              "equipments/putEquipmentDetails",
              payload
            );

            this.bools.troubleshootingDialog = false;
            await this.$emit("initDialog");

            let notifPayload = {
              displayNotify: true,
              message: "Successfully saved troubleshooting guides",
              type: "positive",
            };
            this.setNotificationPayload(notifPayload);

            await utils.delay(1500);
            let notifInitPayload = {
              displayNotify: false,
              message: "",
              type: "",
            };
            this.setNotificationPayload(notifInitPayload);

            await this.$emit("setLoading", false);
          });
      });
    },

    filterSupplier(val, update) {
      if (val === "") {
        update(() => {
          this.optionsSuppliers = this.suppliersActiveOptions;
        });
        return;
      }

      update(() => {
        const needle = val.toLowerCase();
        this.optionsSuppliers = this.suppliersActiveOptions.filter((v) => {
          return v.name.toLowerCase().indexOf(needle) > -1;
        });
      });
    },

    filterDepartments(val, update) {
      if (val === "") {
        update(() => {
          this.optionsDepartments = this.departmentsActiveOptions;
        });
        return;
      }

      update(() => {
        const needle = val.toLowerCase();
        this.optionsDepartments = this.departmentsActiveOptions.filter((v) => {
          return v.name.toLowerCase().indexOf(needle) > -1;
        });
      });
    },
  },
});
</script>
