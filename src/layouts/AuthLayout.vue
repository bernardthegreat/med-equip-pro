<template>
  <q-layout view="hHh lpR fFf" class="bg-overlay">
    <video-background></video-background>
    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
import { defineComponent, ref } from "vue";
import { mapGetters } from "vuex";
import VideoBackground from "src/components/Helpers/VideoBackground.vue";

export default defineComponent({
  name: "AuthLayout",
  components: {
    VideoBackground,
    // EssentialLink,
  },
  data() {
    return {};
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
      uermLogo: "helpers/uermLogo",
    }),
  },
});
</script>
