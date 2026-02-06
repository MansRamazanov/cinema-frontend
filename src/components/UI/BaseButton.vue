<script setup lang="ts">
type Props = {
  type?: 'button' | 'submit' | 'reset'
  disabled?: boolean
}

withDefaults(defineProps<Props>(), {
  type: 'button',
  disabled: false,
})
</script>

<template>
  <button class="base-button" :type="type" :disabled="disabled">
    <slot />
  </button>
</template>
