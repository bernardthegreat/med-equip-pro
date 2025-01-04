<template>
  <q-input
    stack-label
    outlined
    debounce="300"
    type="number"
    :label="opts.label"
    :disable="opts.disable"
    :placeholder="opts.placeholder"
    @keypress="(evt) => evt.stopPropagation()"
    @click="(evt) => evt.stopPropagation()"
    :rules="[
      (val) => {
        if (
          (val === null ||
            val === undefined ||
            (typeof val === 'string' && val.trim() === '')) &&
          opts.required
        )
          return opts.requiredMessage ?? 'This field is required.';
      },
    ]"
    v-model="value"
  />
</template>

<script>
import { defineComponent } from "vue";

export default defineComponent({
  name: "FieldTypeNumber",
  props: ["opts"],
  data() {
    return {
      value: null,
    };
  },
  watch: {
    value(val) {
      this.$emit("valueChanged", val);
    },
    initialValue: {
      handler(val) {
        this.value = val;
      },
      immediate: true, // handler will be called immediately at creation and then after every change of `initialValue`
    },
  },
});
</script>
