<script setup lang="ts">
const attrs = useAttrs();
const props = defineProps<{ icon: string; size?: number; hover?: boolean }>();
const width = computed(() => (props.size ? props.size + "px" : "16px"));

const IconComp = computed(() =>
  h("iconify-icon", {
    ...attrs,
    width: width.value,
    height: width.value,
    icon: props.icon,
    class: { hover: props.hover },
  })
);
</script>
<template>
  <component :is="IconComp" />
</template>

<style scoped lang="less">
.hover {
  cursor: pointer;
  opacity: 0.8;

  &:hover {
    opacity: 1;
  }
}
</style>
