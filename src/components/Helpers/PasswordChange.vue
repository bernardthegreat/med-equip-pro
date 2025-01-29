<template>
  <q-dialog v-model="bools.openDialog" persistent>
    <div class="row full-width justify-center">
      <q-card square class="q-ma-xs col-lg-9 col-md-12 col-sm-12 col-xs-12">
        <q-card-section class="bg-light text-body1 text-white" align="center">
          <div class="row justify-between items-center">
            <span>UPDATE PASSWORD</span>
            <span v-if="!this.persistent">
              <q-btn
                label="CLOSE"
                size="sm"
                icon="fa fa-times"
                color="negative"
                v-close-popup
                @click="this.$emit('closeUpdatePasswordDialog')"
              ></q-btn>
            </span>
          </div>
        </q-card-section>
        <q-form
          ref="newPasswordForm"
          @submit="submitNewPassword"
          v-if="!this.bools.newPasswordLoading"
        >
          <q-card-section>
            <q-input
              square
              filled
              dense
              autofocus
              v-model="userPassword.password"
              stack-label
              label="Password"
              :type="bools.isPwd ? 'password' : 'text'"
              :rules="[(val) => !!val || 'Field is required']"
            >
              <template v-slot:append>
                <q-icon
                  :name="bools.isPwd ? 'visibility_off' : 'visibility'"
                  class="cursor-pointer"
                  @click="bools.isPwd = !bools.isPwd"
                />
              </template>
            </q-input>
            <q-input
              square
              filled
              dense
              v-model="userPassword.confirmPassword"
              stack-label
              label="Confirm Password"
              :type="bools.isPwd ? 'password' : 'text'"
              :rules="[(val) => !!val || 'Field is required']"
            >
              <template v-slot:append>
                <q-icon
                  :name="bools.isPwd ? 'visibility_off' : 'visibility'"
                  class="cursor-pointer"
                  @click="bools.isPwd = !bools.isPwd"
                />
              </template>
            </q-input>
          </q-card-section>
          <q-card-section align="right">
            <q-btn-group>
              <q-btn
                type="submit"
                color="primary"
                label="UPDATE"
                icon="fa fa-sign-in"
                size="sm"
              />
              <q-btn
                v-if="persistent"
                color="negative"
                label="Logout"
                icon="fa fa-xmark"
                size="sm"
                @click="inauthenticate()"
              />
            </q-btn-group>
          </q-card-section>
        </q-form>
        <q-card-section style="height: 23vh" v-else></q-card-section>
        <q-inner-loading :showing="this.bools.newPasswordLoading">
          <q-spinner-puff size="100px" color="primary" />
          <span class="q-pt-md text-overline">PROCESSING REQUEST ...</span>
        </q-inner-loading>
      </q-card>
    </div>
    <NotifyMessage
      v-if="this.bools.displayNotify"
      :message="notification.message"
      :type="notification.type"
    ></NotifyMessage>
  </q-dialog>
</template>

<script>
import { defineComponent } from "vue";
import { mapGetters } from "vuex";
import NotifyMessage from "./NotifyMessage.vue";
import { Loading } from "quasar";
export default defineComponent({
  name: "PasswordChange",
  components: { NotifyMessage },
  props: {
    persistent: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
      bools: {
        isPwd: true,
        newPasswordLoading: false,
        openDialog: false,
        displayNotify: false,
      },
      userPassword: {
        username: "",
        password: "",
        confirmPassword: "",
      },
      notification: {
        message: "",
        type: "",
      },
    };
  },
  created() {
    this.initialize();
  },
  computed: {
    ...mapGetters({
      userLoginInfo: "users/userLoginInfo",
    }),
  },
  emits: ["closeUpdatePasswordDialog"],
  methods: {
    initialize() {
      this.bools.openDialog = true;
    },
    confirmPassword() {
      if (this.userPassword.password !== this.userPassword.confirmPassword)
        return false;
      return true;
    },
    async submitNewPassword() {
      this.$refs.newPasswordForm.validate().then(async (valid) => {
        if (!valid) {
          return false;
        }
        if (!this.confirmPassword()) {
          this.notification.message = "Passwords do not match!";
          this.notification.type = "negative";
          this.bools.displayNotify = true;

          setTimeout(() => {
            this.notification.message = "";
            this.notification.type = "";
            this.bools.displayNotify = false;
          }, 1500);
          return false;
        }
        this.bools.newPasswordLoading = true;
        const payloadData = {
          id: this.userLoginInfo.id,
          username: this.userLoginInfo.username,
          password: this.userPassword.password,
          initialLogin: 0,
        };

        const status = await this.$store.dispatch("users/putUser", payloadData);
        if (!status) {
          this.notification.message = status.message;
          this.notification.type = "negative";
          this.bools.displayNotify = true;

          setTimeout(() => {
            this.notification.message = "";
            this.notification.type = "";
            this.bools.displayNotify = false;
            this.bools.newPasswordLoading = false;
            this.$emit("closeUpdatePasswordDialog");
          }, 1500);
          return false;
        }

        this.notification.message =
          "You have successfully updated your password, please login again!";
        this.notification.type = "positive";
        this.bools.displayNotify = true;

        await this.$store.dispatch("helpers/logoffUser", true);

        this.$emit("closeUpdatePasswordDialog");
        setTimeout(() => {
          this.notification.message = "";
          this.notification.type = "";
          this.bools.displayNotify = false;
          this.bools.newPasswordLoading = false;
          this.bools.openDialog = false;
        }, 1500);
      });
    },
    async inauthenticate() {
      await this.$store.dispatch("helpers/logoffUser", false);
      this.$emit("closeUpdatePasswordDialog");
      Loading.show({
        message: "Logging out...",
      });
      await this.$store.dispatch("users/inauthenticate");
      setTimeout(() => {
        Loading.hide();
        this.$router.push("/");
      }, 1500);
    },
  },
});
</script>
