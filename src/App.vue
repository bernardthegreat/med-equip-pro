<template>
  <router-view />
  <NotifyMessage
    v-if="notification.displayNotify"
    :message="notification.message"
    :type="notification.type"
  ></NotifyMessage>

  <PasswordChange
    @closeUpdatePasswordDialog="bools.passwordChangeDialog = false"
    v-if="bools.passwordChangeDialog"
  ></PasswordChange>
</template>

<script>
const utils = require("src/util");
import { defineComponent } from "vue";
import { mapGetters } from "vuex";
import { Cookies } from "quasar";
import NotifyMessage from "./components/Helpers/NotifyMessage.vue";
import PasswordChange from "./components/Helpers/PasswordChange.vue";
export default defineComponent({
  name: "App",
  components: { NotifyMessage, PasswordChange },
  data() {
    return {
      bools: {
        passwordChangeDialog: false,
      },
    };
  },
  watch: {
    // IMPORTANT: Do not make this watcher "immediate".
    "$router.currentRoute.value.name": {
      async handler(val) {
        if (!this.logoffUser) {
          this.initializeRouting(val);
          // await this.watchLocation();
        }
      },
    },

    logoffUser(val) {
      if (val) {
        this.removeCookies();
      }
    },
  },
  computed: {
    ...mapGetters({
      currentScreenProperty: "helpers/currentScreenProperty",
      departments: "departments/departments",
      suppliers: "suppliers/suppliers",
      equipments: "equipments/equipments",
      notification: "helpers/notification",
      logoffUser: "helpers/logoffUser",
      userLoginInfo: "users/userLoginInfo",
    }),
  },
  mounted() {
    this.initializeRouting(this.$router.currentRoute.value.name);
  },
  methods: {
    async removeCookies() {
      Cookies.remove("user-access-token");
      const notifInitPayload = {
        displayNotify: true,
        message: "You have been logged out!",
        type: "negative",
      };
      await this.$store.dispatch("helpers/setNotification", notifInitPayload);
      setTimeout(async () => {
        const notifInitPayload = {
          displayNotify: false,
          message: "",
          type: "",
        };
        await this.$store.dispatch("helpers/setNotification", notifInitPayload);
      }, 1500);
      this.$router.push("/");
    },
    async initializeRouting(val) {
      const cookieStatus = await this.checkCookie();
      if (val === "Auth" || val === undefined) {
        if (cookieStatus) {
          this.$router.push("/dashboard");
        } else {
          this.$router.push("/");
          return;
        }
      }
      await this.redirectUser();
      await this.initializeStore();
    },
    async initializeStore() {
      if (Object.keys(this.userLoginInfo).length === 0) {
        return;
      }
      this.checkInitialLogin();

      await this.$store.dispatch("departments/getDepartments");
      await this.$store.dispatch("suppliers/getSuppliers");
      await this.$store.dispatch("equipments/getEquipments");
      // await this.$store.dispatch("helpers/setAppLoading", true);
      // await this.$store.dispatch("helpers/setAppLoading", false);
    },

    async checkInitialLogin() {
      this.bools.passwordChangeDialog = false;
      if (this.userLoginInfo.initialLogin) {
        this.bools.passwordChangeDialog = true;
      }
    },

    async redirectUser() {
      if (utils.objEmpty(this.userLoginInfo)) {
        this.$router.push("/");
        return;
      }
    },

    async checkCookie() {
      if (Cookies.has("user-access-token")) {
        await this.$store.dispatch("users/setUserCookies");
        return true;
      }

      return false;
    },
  },
});
</script>
