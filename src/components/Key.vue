<script setup lang="ts">
import { computed } from 'vue'
import type { LetterFeedback } from '@/domain/models/types'

interface Props {
  value: string
  status?: LetterFeedback
  wide?: boolean
  isHardMode?: boolean
}

const props = defineProps<Props>()
const emit = defineEmits<{
  (e: 'press', value: string): void
}>()

const statusClasses = computed(() => {
  if (props.isHardMode) {
    switch (props.status) {
      case 'CORRECT':
        return 'bg-red-600 text-black shadow-[0_0_10px_rgba(220,38,38,0.5)]'
      case 'MISPLACED':
        return 'bg-orange-700 text-black'
      case 'ABSENT':
        return 'bg-zinc-900 text-red-950 opacity-40'
      default:
        return 'bg-zinc-950 text-red-900 border border-red-950 hover:bg-red-950 hover:text-red-600'
    }
  }

  switch (props.status) {
    case 'CORRECT':
      return 'bg-correct text-white'
    case 'MISPLACED':
      return 'bg-misplaced text-white'
    case 'ABSENT':
      return 'bg-zinc-300 text-zinc-500 dark:bg-zinc-800 dark:text-zinc-600'
    default:
      return 'bg-zinc-100 text-zinc-700 hover:bg-zinc-200 dark:bg-zinc-700 dark:text-zinc-100 dark:hover:bg-zinc-600'
  }
})
</script>

<template>
  <button
    @click="emit('press', value)"
    class="flex items-center justify-center h-14 rounded-xl font-bold uppercase transition-all active:scale-95 duration-200 select-none shadow-sm"
    :class="[
      statusClasses,
      wide ? 'px-4 sm:px-6 text-sm' : 'w-10 sm:w-12 text-lg',
      isHardMode ? 'rounded-none font-serif italic' : 'rounded-xl'
    ]"
  >
    <slot>{{ value }}</slot>
  </button>
</template>
