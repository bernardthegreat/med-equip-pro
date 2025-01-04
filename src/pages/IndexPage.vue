<template>
  <div>INDEX</div>
</template>

<script>
const utils = require("src/util");
import { defineComponent, defineAsyncComponent } from "vue";
import { mapGetters } from "vuex";

export default defineComponent({
  components: {},
  name: "IndexPage",
  data() {
    return {
      bools: {
        loading: false,
      },
    };
  },
  computed: {
    ...mapGetters({
      scrollAreaThumbStyle: "helpers/scrollAreaThumbStyle",
      scrollAreaBarStyle: "helpers/scrollAreaBarStyle",
      currentScreen: "helpers/currentScreen",
      currentScreenProperty: "helpers/currentScreenProperty",
    }),
  },
  watch: {
    appLoading(val) {
      // this.bools.loading = val;
    },
  },
  created() {
    // this.bools.loading = true;
  },
  methods: {},
});
</script>

<style lang="sass" scoped>
.my-card
  width: 100%
  max-width: 300px
  height: 80%
  max-height: 180px
</style>
