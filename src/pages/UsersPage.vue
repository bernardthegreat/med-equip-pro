<template>
  <q-page class="full-height q-pa-md">
    <div>
      <table-details
        class="full-height flex-grow-1"
        :columns="this.usersColumns"
        :rows="this.currentUsers"
        :rowKey="'name'"
        :loading="this.bools.loading"
        :title="'USERS'"
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
              {{ this.dialogAction === "add" ? "REGISTER" : "UPDATE" }} USER
            </span>

            <span>
              <q-btn
                icon="fa fa-times"
                color="red"
                label="CLOSE"
                size="sm"
                v-close-popup
              ></q-btn>
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
                  v-model="infoDetails.username"
                  autofocus
                  stack-label
                  label-slot
                  hide-bottom-space
                  dense
                  :rules="[(val) => !!val || 'Username is required']"
                >
                  <template v-slot:label>
                    Username
                    <span class="text-weight-bold text-red"> *</span>
                  </template>
                </q-input>
              </div>
              <div class="col-12" v-if="this.dialogAction === 'add'">
                <q-input
                  square
                  filled
                  v-model="infoDetails.password"
                  autofocus
                  stack-label
                  label-slot
                  hide-bottom-space
                  dense
                  type="password"
                  :rules="[(val) => !!val || 'Password is required']"
                >
                  <template v-slot:label>
                    Password
                    <span class="text-weight-bold text-red"> *</span>
                  </template>
                </q-input>
              </div>
              <div class="col-12">
                <q-input
                  square
                  filled
                  v-model="infoDetails.lastName"
                  autofocus
                  stack-label
                  label-slot
                  hide-bottom-space
                  dense
                  :rules="[(val) => !!val || 'Lastname is required']"
                >
                  <template v-slot:label>
                    Lastname
                    <span class="text-weight-bold text-red"> *</span>
                  </template>
                </q-input>
              </div>
              <div class="col-12">
                <q-input
                  square
                  filled
                  v-model="infoDetails.firstName"
                  autofocus
                  stack-label
                  label-slot
                  hide-bottom-space
                  dense
                  :rules="[(val) => !!val || 'Firstname is required']"
                >
                  <template v-slot:label>
                    Firstname
                    <span class="text-weight-bold text-red"> *</span>
                  </template>
                </q-input>
              </div>
              <div class="col-12">
                <q-input
                  square
                  filled
                  v-model="infoDetails.middleName"
                  autofocus
                  stack-label
                  label-slot
                  hide-bottom-space
                  dense
                >
                  <template v-slot:label> Middlename </template>
                </q-input>
              </div>

              <div class="col-12">
                <q-select
                  stack-label
                  square
                  filled
                  v-model="infoDetails.role"
                  :options="this.usersRoleOptions"
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
                    Role
                    <span class="text-weight-bold text-red"> *</span>
                  </template>
                </q-select>
              </div>
            </div>
          </q-card-section>
          <q-card-section align="right">
            <q-btn-group>
              <q-btn
                v-if="this.dialogAction === 'edit'"
                :label="this.infoDetails.active === 1 ? 'suspend' : 'unsuspend'"
                :color="this.infoDetails.active === 1 ? 'negative' : 'info'"
                :icon="
                  this.infoDetails.active === 1
                    ? 'fa fa-user-slash'
                    : 'fa fa-user-check'
                "
                @click="
                  updateUser(
                    this.infoDetails.active === 1 ? 'suspend' : 'unsuspend'
                  )
                "
                size="sm"
              ></q-btn>
              <q-btn
                v-if="this.dialogAction === 'edit'"
                label="RESET PASSWORD"
                color="warning"
                icon="fa fa-unlock"
                text-color="black"
                @click="updateUser('reset')"
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
  name: "UsersPage",
  data() {
    return {
      bools: {
        loading: false,
        infoDialog: false,
      },
      dialogAction: "add",
      infoDetails: {},
      currentUsers: [],
    };
  },
  computed: {
    ...mapGetters({
      usersColumns: "users/usersColumns",
      users: "users/users",
      usersRoleOptions: "users/usersRoleOptions",
      usersRoleHashMap: "users/usersRoleHashMap",
      userLoginInfo: "users/userLoginInfo",
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
      await this.$store.dispatch("users/getUsers");
      this.currentUsers = this.users.filter(
        (filterCurrentUsers) =>
          filterCurrentUsers.username !== this.userLoginInfo.username
      );
      await utils.delay(1500);
      this.bools.loading = false;
    },
    openAddDialog(status) {
      this.infoDetails = {
        username: "",
        password: "",
        lastName: "",
        firstName: "",
        middleName: "",
        suffix: "",
        role: "",
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
            message: `Are you sure you want to ${messageOpts.message} this user?`,
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
              delete payload.name;
              delete payload.label;
              delete payload.value;
              delete payload.createdAt;
              delete payload.updatedAt;
              delete payload.password;
              delete payload.status;

              payload.role = utils.isStr(payload.role)
                ? this.usersRoleHashMap[payload.role].value
                : payload.role;

              await this.$store.dispatch("users/putUser", payload);
            } else {
              await this.$store.dispatch("users/postUser", this.infoDetails);
            }

            this.bools.loading = true;
            this.bools.infoDialog = false;

            let notifPayload = {
              displayNotify: true,
              message: `User successfully ${messageOpts.afterSave}!`,
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

    async updateUser(type) {
      let messageOpts = {
        message: "Are you sure you want to reset the password of this user?",
        afterSave: "User password reset successful",
      };
      if (type === "suspend") {
        messageOpts = {
          message: "Are you sure you want to suspend this user?",
          afterSave: "User suspended!",
        };
      } else if (type === "unsuspend") {
        messageOpts = {
          message: "Are you sure you want to unsuspend this user?",
          afterSave: "User unsuspended!",
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
          const filterUser = this.users.filter(
            (filterUser) => filterUser.id === this.infoDetails.id
          );

          if (type === "reset") {
            await this.$store.dispatch(
              "users/resetPasswordUser",
              filterUser[0]
            );
          } else {
            const payload = {
              active: type === "suspend" ? 0 : 1,
              id: filterUser[0].id,
            };
            await this.$store.dispatch("users/putUser", payload);
          }

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
