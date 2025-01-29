<template>
  <q-layout view="hHh lpR fFf">
    <q-drawer
      v-model="bools.leftDrawer"
      show-if-above
      :width="190"
      class="bg-primary"
      style="border-top: 1px solid #fafafa"
    >
      <div class="q-mt-sm">
        <EssentialLink
          v-for="link in this.navigationLinks"
          :key="link.title"
          v-bind="link"
        />
      </div>
    </q-drawer>

    <q-header class="bg-primary text-secondary">
      <q-toolbar class="q-px-sm">
        <div class="text-weight-bold row items-center text-body1">
          <span>
            <q-btn
              @click="this.bools.leftDrawer = !this.bools.leftDrawer"
              icon="fa fa-bars"
              flat
              round
              color="secondary"
            ></q-btn>
            {{ this.projectName }}
          </span>
        </div>
        <q-space></q-space>
        <q-btn-dropdown
          flat
          icon="fa fa-user"
          color="primary"
          text-color="secondary"
          :label="`${
            this.currentScreenProperty.lt.md
              ? ''
              : `${
                  this.userLoginInfo.firstName === undefined
                    ? ''
                    : this.userLoginInfo.firstName
                }`
          }`"
        >
          <div
            class="bg-secondary row no-wrap items-center justify-center q-pa-md"
          >
            <!-- <div class="column">
            </div>
            <q-separator vertical inset class="q-mx-lg" /> -->

            <div class="column items-center justify-center text-center">
              <q-avatar
                size="100px"
                color="primary"
                text-color="secondary"
                class="cursor-pointer shadow-5"
                v-ripple
              >
                {{ formattedAvatarName(this.userLoginInfo.firstName)
                }}{{ formattedAvatarName(this.userLoginInfo.lastName) }}
              </q-avatar>

              <div class="text-caption q-mt-sm q-mb-sm text-uppercase">
                {{ this.userLoginInfo.lastName }},
                {{ this.userLoginInfo.firstName }}
              </div>
              <q-btn-group>
                <q-btn
                  color="primary"
                  label="EDIT PROFILE"
                  push
                  size="sm"
                  @click="openProfileDialog"
                ></q-btn>
                <q-btn
                  color="primary"
                  label="Logout"
                  push
                  size="sm"
                  v-close-popup
                  @click="inauthenticate()"
              /></q-btn-group>
            </div>
          </div>
        </q-btn-dropdown>
      </q-toolbar>
    </q-header>

    <q-page-container>
      <router-view />
      <!-- <div class="fit flex flex-center">
        <q-inner-loading :showing="this.appLoading">
          <q-spinner-puff size="100px" color="primary" />
          <span class="q-pt-md q-py-md text-overline text-center"
            >LOADING, PLEASE WAIT ...</span
          >
        </q-inner-loading>
      </div> -->
    </q-page-container>

    <q-dialog v-model="bools.profileDialog">
      <q-card class="card-dialog-width">
        <q-card-section class="bg-light text-body1">
          <div class="row justify-between items-center">
            <span> EDIT PROFILE </span>

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
          ref="profileForm"
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
                label="CHANGE PASSWORD"
                icon="fa fa-user-edit"
                color="positive"
                @click="bools.passwordChangeDialog = true"
                size="sm"
              ></q-btn>
              <q-btn
                label="UPDATE"
                icon="fa fa-user-edit"
                color="positive"
                type="submit"
                size="sm"
              ></q-btn>
            </q-btn-group>
          </q-card-section>
        </q-form>
      </q-card>
    </q-dialog>

    <PasswordChange
      @closeUpdatePasswordDialog="bools.passwordChangeDialog = false"
      v-if="bools.passwordChangeDialog"
      :persistent="false"
    ></PasswordChange>
  </q-layout>
</template>

<script>
const utils = require("src/util");
import { defineComponent, ref } from "vue";
import EssentialLink from "components/EssentialLink.vue";
import { mapGetters } from "vuex";
import { Dark, Loading } from "quasar";
import PasswordChange from "src/components/Helpers/PasswordChange.vue";

export default defineComponent({
  name: "MainLayout",
  components: {
    EssentialLink,
    PasswordChange,
  },
  data() {
    return {
      drawer: false,
      navigationLinks: [],
      bools: {
        loadingPage: false,
        leftDrawer: false,
        darkModeLayout: false,
        profileDialog: false,
        passwordChangeDialog: false,
      },
      infoDetails: {},
    };
  },
  created() {
    this.checkAccessNavigation();
  },
  methods: {
    // toggleLeftDrawer() {
    //   this.leftDrawer = !this.leftDrawer;
    // },
    validationError(vm) {
      vm.$el.scrollIntoView();
    },
    async setNotificationPayload(payload) {
      let notifPayload = {
        displayNotify: payload.displayNotify,
        message: payload.message,
        type: payload.type,
      };
      await this.$store.dispatch("helpers/setNotification", notifPayload);
    },
    formattedAvatarName(name) {
      return utils.setInitials(name);
    },
    checkAccessNavigation() {
      this.navigationLinks = this.navLinks.filter((filterNavLinks) =>
        filterNavLinks.roles.includes(this.userLoginInfo.role.toLowerCase())
      );
    },
    checkIfActiveNav(route) {
      if (this.$route.path === route) {
        return true;
      }

      return false;
    },

    async inauthenticate() {
      this.$q
        .dialog({
          title: `<div class="text-overline">ARE YOU SURE YOU WANT TO LOGOUT?<div>`,
          ok: {
            push: true,
          },
          cancel: {
            push: true,
            color: "negative",
          },
          html: true,
        })
        .onOk(async () => {
          Loading.show({
            message: "Logging out...",
          });
          await this.$store.dispatch("users/inauthenticate");
          setTimeout(() => {
            Loading.hide();
            this.$router.push("/");
          }, 1500);
        });
    },

    openProfileDialog() {
      this.bools.profileDialog = true;
      this.infoDetails = this.userLoginInfo;
    },

    async save() {
      await this.$refs.profileForm.validate().then(async (valid) => {
        if (!valid) {
          return false;
        }

        this.$q
          .dialog({
            title: "Confirmation",
            message: "Are you sure you want to update your Profile?",
            ok: {
              push: true,
            },
            cancel: {
              push: true,
              color: "negative",
            },
          })
          .onOk(async () => {
            const payload = JSON.parse(JSON.stringify(this.infoDetails));
            delete payload.name;
            delete payload.label;
            delete payload.value;
            delete payload.createdAt;
            delete payload.updatedAt;
            delete payload.password;
            delete payload.status;
            delete payload.iat;
            delete payload.exp;
            delete payload.userToken;

            payload.role = utils.isStr(payload.role)
              ? this.usersRoleHashMap[payload.role].value
              : payload.role;

            await this.$store.dispatch("users/putUser", payload);

            this.bools.profileDialog = false;
            let notifPayload = {
              displayNotify: true,
              message: `Profile successfully updated! You will be logged out automatically`,
              type: "positive",
            };
            this.setNotificationPayload(notifPayload);

            await utils.delay(1500);

            await this.$store.dispatch("helpers/logoffUser", true);
            let notifInitPayload = {
              displayNotify: false,
              message: "",
              type: "",
            };
            this.setNotificationPayload(notifInitPayload);
          });
      });
    },
  },
  computed: {
    projectName() {
      return process.env.PROJECT_NAME;
    },
    projectShortName() {
      return process.env.PROJECT_SHORT_NAME;
    },
    projectVersion() {
      return process.env.PROJECT_VERSION;
    },
    currentYear() {
      return new Date().getFullYear();
    },
    ...mapGetters({
      navLinks: "helpers/navLinks",
      // appLoading: "helpers/appLoading",
      currentScreenProperty: "helpers/currentScreenProperty",
      userLoginInfo: "users/userLoginInfo",
      usersRoleOptions: "users/usersRoleOptions",
      usersRoleHashMap: "users/usersRoleHashMap",
    }),
  },
});
</script>

<style scoped>
.q-page {
  background: #fafafa !important;
}
</style>
