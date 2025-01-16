<template>
  <q-page class="full-height q-pa-md">
    <div>
      <table-details
        class="full-height flex-grow-1"
        :columns="this.departmentsColumns"
        :rows="this.departments"
        :rowKey="'name'"
        :loading="this.bools.loading"
        :title="'DEPARTMENTS'"
        :addBtn="true"
        @emitAddBtn="openAddDialog"
        @emitRow="openEditDialog"
      ></table-details>
    </div>

    <q-dialog v-model="bools.infoDialog">
      <q-card class="card-dialog-width">
        <q-card-section class="bg-light text-body1">
          <div class="row justify-between items-center">
            <span>
              {{ this.dialogAction === "add" ? "REGISTER" : "UPDATE" }}
              DEPARTMENT
            </span>
            <span>
              <span v-if="infoDetails.code !== ''">
                <q-chip color="warning" size="sm" icon="fa fa-check-to-slot">{{
                  infoDetails.code
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
          <q-card-section>
            <div class="row q-col-gutter-y-sm">
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
                  :rules="[(val) => !!val || 'Name is required']"
                  @update:model-value="
                    this.dialogAction === 'add'
                      ? generateCode(infoDetails.name)
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
            </div>
          </q-card-section>
          <q-card-section align="right">
            <q-btn-group>
              <!-- <q-btn
                v-if="this.dialogAction === 'edit'"
                label="DEACTIVATE"
                color="negative"
                icon="fa fa-user-slash"
                @click="updateUser('suspend')"
              ></q-btn> -->
              <q-btn
                v-if="this.dialogAction === 'edit'"
                :label="
                  this.infoDetails.active === 1 ? 'DEACTIVATE' : 'ACTIVATE'
                "
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
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script>
const utils = require("src/util");
import TableDetails from "src/components/Helpers/TableDetails.vue";
import { defineComponent } from "vue";
import { mapGetters } from "vuex";

export default defineComponent({
  components: { TableDetails },
  name: "DepartmentsPage",
  data() {
    return {
      bools: {
        loading: false,
        infoDialog: false,
      },
      dialogAction: "add",
      infoDetails: {},
    };
  },
  computed: {
    ...mapGetters({
      departmentsColumns: "departments/departmentsColumns",
      departments: "departments/departments",
    }),
  },
  mounted() {
    this.initStore();
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
    async initStore() {
      this.bools.loading = true;
      await this.$store.dispatch("departments/getDepartments");
      await utils.delay(1500);
      this.bools.loading = false;
    },
    openAddDialog(status) {
      this.infoDetails = {
        code: "",
        name: "",
        description: "",
      };
      this.dialogAction = "add";
      this.bools.infoDialog = status;
    },

    openEditDialog(row) {
      this.dialogAction = "edit";
      this.bools.infoDialog = true;
      this.infoDetails = JSON.parse(JSON.stringify(row));
      delete this.infoDetails.password;
    },
    validationError(vm) {
      vm.$el.scrollIntoView();
    },
    generateCode(name) {
      this.infoDetails.code = name.replace(/[\s-]+/g, "").toLowerCase();
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
            message: `Are you sure you want to ${messageOpts.message} this department?`,
            ok: {
              push: true,
            },
            cancel: {
              push: true,
              color: "negative",
            },
          })
          .onOk(async () => {
            if (this.dialogAction === "edit") {
              const payload = JSON.parse(JSON.stringify(this.infoDetails));
              delete payload.label;
              delete payload.value;
              delete payload.createdAt;
              delete payload.updatedAt;
              delete payload.status;

              await this.$store.dispatch("departments/putDepartment", payload);
            } else {
              await this.$store.dispatch(
                "departments/postDepartment",
                this.infoDetails
              );
            }

            this.bools.loading = true;
            this.bools.infoDialog = false;

            let notifPayload = {
              displayNotify: true,
              message: `Department successfully ${messageOpts.afterSave}!`,
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
      });
    },
    async updateInfo(type) {
      let messageOpts = {
        message: "Are you sure you want to activate this department?",
        afterSave: "Department activated",
      };
      if (type === "deactivate") {
        messageOpts = {
          message: "Are you sure you want to deactivate this department?",
          afterSave: "Department deactivated",
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
          this.bools.loading = true;
          const filterData = this.departments.filter(
            (filterData) => filterData.id === this.infoDetails.id
          );

          const payload = {
            active: type === "deactivate" ? 0 : 1,
            id: filterData[0].id,
          };

          await this.$store.dispatch("departments/putDepartment", payload);

          this.bools.infoDialog = false;

          let notifPayload = {
            displayNotify: true,
            message: messageOpts.afterSave,
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
  },
});
</script>
