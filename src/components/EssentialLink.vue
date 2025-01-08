<template>
  <div class="q-py-sm q-px-sm">
    <q-btn
      color="secondary"
      rounded
      flat
      :to="link"
      class="full-width"
      :class="this.checkIfActiveNav(link) ? 'active-class' : ''"
    >
      <span
        class="row full-width items-center text-body2 text-weight-bold"
        style="font-size: 12.5px"
      >
        <span class="col-4 text-center">
          <q-icon :name="icon" class="q-pr-sm"></q-icon>
        </span>
        <span class="">{{ title }}</span></span
      >
      <!-- <span class="">{{ title }}</span> -->
    </q-btn>
  </div>
  <!-- <q-item-section v-if="icon" avatar>
      <q-icon :name="icon" />
    </q-item-section>

    <q-item-section>
      <q-item-label>{{ title }}</q-item-label>
      </q-item-section> -->
</template>

<script>
import { defineComponent } from "vue";

export default defineComponent({
  name: "EssentialLink",
  props: {
    title: {
      type: String,
      required: true,
    },

    caption: {
      type: String,
      default: "",
    },

    link: {
      type: String,
      default: "#",
    },

    icon: {
      type: String,
      default: "",
    },
  },

  methods: {
    checkIfActiveNav(route) {
      if (this.$route.path === route) {
        return true;
      }

      return false;
    },
  },
});
</script>

<style scoped>
.active-class {
  background: rgba(255, 255, 255, 0.3);
}
</style>
