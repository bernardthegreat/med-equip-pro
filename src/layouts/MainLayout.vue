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
          v-for="link in navLinks"
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
          label="TEST LABEL"
        >
          <!-- :label="`${
            this.currentScreenProperty.lt.md
              ? ''
              : `${
                  this.userLoginInfo.firstName === undefined
                    ? ''
                    : this.userLoginInfo.firstName
                }`
          }`" -->
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
                icon="fa fa-user"
              >
                <!-- {{ formattedAvatarName(this.userLoginInfo.firstName)
                }}{{ formattedAvatarName(this.userLoginInfo.lastName) }} -->
              </q-avatar>

              <div class="text-caption q-mt-sm text-uppercase">
                TEST LABEL
                <!-- {{ this.userLoginInfo.lastName }},
                {{ this.userLoginInfo.firstName }} -->
              </div>
              <div class="text-caption q-mb-xs text-uppercase">
                <!-- REFERENCE NO.: {{ this.userLoginInfo.code }} -->
              </div>
              <q-btn-group>
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
  </q-layout>
</template>

<script>
import { defineComponent, ref } from "vue";
import EssentialLink from "components/EssentialLink.vue";
import { mapGetters } from "vuex";
import { Dark, Loading } from "quasar";

export default defineComponent({
  name: "MainLayout",
  components: {
    EssentialLink,
  },
  data() {
    return {
      drawer: false,
      bools: {
        loadingPage: false,
        leftDrawer: false,
        darkModeLayout: false,
      },
    };
  },
  methods: {
    // toggleLeftDrawer() {
    //   this.leftDrawer = !this.leftDrawer;
    // },
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
    }),
  },
});
</script>

<style>
.q-page {
  background: #fafafa !important;
}
</style>
