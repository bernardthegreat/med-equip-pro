<template>
  <router-view />
  <NotifyMessage
    v-if="notification.displayNotify"
    :message="notification.message"
    :type="notification.type"
  ></NotifyMessage>
</template>

<script>
import { defineComponent } from "vue";
import { mapGetters } from "vuex";
import NotifyMessage from "./components/Helpers/NotifyMessage.vue";
export default defineComponent({
  name: "App",
  components: { NotifyMessage },
  computed: {
    ...mapGetters({
      currentScreenProperty: "helpers/currentScreenProperty",
      notification: "helpers/notification",
      logoffUser: "helpers/logoffUser",
    }),
  },
  created() {
    this.initializeStore();
  },
  methods: {
    async initializeStore() {
      // await this.$store.dispatch("helpers/setAppLoading", true);
      // await this.$store.dispatch("config/getProcessors");
      // await this.$store.dispatch("config/getBillers");
      // await this.$store.dispatch("config/getApplications");
      // await this.$store.dispatch("helpers/setAppLoading", false);
    },
  },
});
</script>
