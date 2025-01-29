<template>
  <q-page class="row items-center justify-center full-width q-pa-md">
    <div class="col-xl-3 col-lg-3 col-md-auto col-sm-auto col-xs-auto">
      <q-card class="login-card">
        <q-form ref="authForm" @submit="submitForm">
          <q-card-section class="header-bg">
            <div class="column items-center q-col-gutter-md justify-center">
              <div
                class="text-overline text-weight-bolder text-grey-1"
                style="font-size: 15px"
              >
                MED-EQUIP-PRO
              </div>
            </div>
          </q-card-section>
          <q-card-section>
            <div class="row q-pa-xs q-col-gutter-y-md">
              <div class="col-12">
                <q-input
                  square
                  filled
                  v-model="loginInfo.username"
                  autofocus
                  stack-label
                  label-slot
                  ref="username"
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
                  type="password"
                  v-model="loginInfo.password"
                  stack-label
                  label-slot
                  dense
                  hide-bottom-space
                  :rules="[(val) => !!val || 'Password is required']"
                >
                  <template v-slot:label>
                    Password
                    <span class="text-weight-bold text-red"> *</span>
                  </template>
                </q-input>
              </div>
            </div>
          </q-card-section>
          <q-card-section class="header-bg-bottom q-mt-sm">
            <q-btn
              :label="this.submitBtn.label"
              :icon="this.submitBtn.icon"
              color="light-blue"
              text-color="grey-1"
              class="full-width q-pa-md"
              type="submit"
            ></q-btn>

            <!--

              type="submit"
            -->
          </q-card-section>
          <q-inner-loading :showing="this.bools.loginLoading">
            <q-spinner-puff size="100px" color="primary" />
            <span class="q-pt-md text-overline">{{ loadingMessage }} ...</span>
          </q-inner-loading>
        </q-form>
      </q-card>
    </div>
  </q-page>
</template>

<script>
import { defineComponent } from "vue";
import { mapGetters } from "vuex";

export default defineComponent({
  name: "AuthPage",
  data() {
    return {
      bools: {
        loginLoading: false,
        enableSubmit: false,
        showRecaptcha: true,
      },
      loadingMessage: "",
      loginInfo: {
        username: null,
        password: null,
      },
    };
  },
  computed: {
    ...mapGetters({
      currentScreenProperty: "helpers/currentScreenProperty",
      currentScreen: "helpers/currentScreen",
      userLoginInfo: "users/userLoginInfo",
      moduleLinks: "helpers/moduleLinks",
      notification: "helpers/notification",
    }),
    submitBtn() {
      return {
        icon: "fa fa-person-walking-dashed-line-arrow-right",
        label: "LOGIN",
      };
    },
  },
  created() {
    this.setInit();
  },
  methods: {
    setInit() {
      this.loginInfo.username = "";
      this.loginInfo.password = "";
    },
    submitForm() {
      this.$refs.authForm.validate().then(async (valid) => {
        if (!valid) {
          return false;
        }

        await this.authenticate();
      });
    },
    async authenticate() {
      this.loadingMessage = "AUTHENTICATING";
      this.bools.loginLoading = true;

      // const accessRights = await this.initAccessRights();
      // if (!accessRights) {
      //   this.bools.loginLoading = false;
      //   this.setInit();
      //   return;
      // }

      const payload = {
        username: this.loginInfo.username,
        password: this.loginInfo.password,
      };
      const auth = await this.$store.dispatch("users/authenticate", payload);
      if (auth !== undefined) {
        if (!auth) {
          this.bools.loginLoading = false;
          this.setInit();

          setTimeout(async () => {
            this.setInit();
            const notifInitPayload = {
              displayNotify: false,
              message: "",
              type: "",
            };
            await this.$store.dispatch(
              "helpers/setNotification",
              notifInitPayload
            );
          }, 2000);
          return false;
        }
      }
      this.$refs.username.focus();

      let successNotifPayload = {
        displayNotify: true,
        message: `Welcome ${this.userLoginInfo.lastName}, ${this.userLoginInfo.firstName}`,
        type: "positive",
      };
      await this.$store.dispatch(
        "helpers/setNotification",
        successNotifPayload
      );
      this.setInit();
      this.$router.push("/dashboard");

      setTimeout(async () => {
        this.bools.loginLoading = false;
        this.setInit();
        const notifInitPayload = {
          displayNotify: false,
          message: "",
          type: "",
        };
        await this.$store.dispatch("helpers/setNotification", notifInitPayload);
      }, 2000);
    },
  },
});
</script>

<style>
.login-card {
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  border-radius: 8px;
}

.header-bg {
  border-radius: 8px 8px 0 0;
  background: #03a9f4;
  /* background: linear-gradient(135deg, #00b8ff, #00719c); */
}

.header-bg-bottom {
  border-radius: 0 0 8px 8px;
  /* background: linear-gradient(135deg, #00b8ff, #00719c); */
}
</style>
