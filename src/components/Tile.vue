<script setup lang="ts">
import { computed } from 'vue'
import type { LetterFeedback } from '@/domain/models/types'

interface Props {
  letter?: string
  status?: LetterFeedback
  delay?: number
  isRevealed?: boolean
  isHardMode?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  letter: '',
  delay: 0,
  isRevealed: false,
  isHardMode: false
})

const statusClasses = computed(() => {
  if (!props.isRevealed) return props.isHardMode ? 'border-red-900 bg-black' : 'border-zinc-300 dark:border-zinc-700 bg-transparent'
  
  if (props.isHardMode) {
    switch (props.status) {
      case 'CORRECT':
        return 'bg-red-600 border-red-600 text-black shadow-[0_0_15px_rgba(220,38,38,0.8)]'
      case 'MISPLACED':
        return 'bg-orange-600 border-orange-600 text-black'
      case 'ABSENT':
        return 'bg-zinc-900 border-zinc-950 text-red-900 opacity-50'
      default:
        return 'border-red-900 bg-black'
    }
  }

  switch (props.status) {
    case 'CORRECT':
      return 'bg-correct border-correct text-white'
    case 'MISPLACED':
      return 'bg-misplaced border-misplaced text-white'
    case 'ABSENT':
      return 'bg-zinc-500 border-zinc-500 text-white dark:bg-absent dark:border-absent dark:text-zinc-400'
    default:
      return 'border-zinc-300 dark:border-zinc-700 bg-transparent'
  }
})

const animationStyle = computed(() => ({
  transitionDelay: `${props.delay}ms`
}))
</script>

<template>
  <div class="perspective-1000 w-14 h-14 sm:w-16 sm:h-16">
    <div
      class="relative w-full h-full transition-transform duration-500 preserve-3d"
      :class="{ 
        'rotate-y-180': isRevealed,
        'animate-pulse': isHardMode && !isRevealed && letter
      }"
      :style="animationStyle"
    >
      <!-- Front -->
      <div
        class="absolute inset-0 flex items-center justify-center text-2xl font-black uppercase border-2 backface-hidden transition-all duration-200"
        :class="[
          isHardMode ? 'rounded-none border-red-900 bg-black text-red-600 font-serif' : 'rounded-xl',
          letter ? (isHardMode ? 'border-red-500 scale-110 shadow-[0_0_10px_rgba(239,68,68,0.5)]' : 'border-zinc-500 scale-105') : (isHardMode ? 'border-zinc-900' : 'border-zinc-200 dark:border-zinc-800')
        ]"
      >
        {{ letter }}
      </div>

      <!-- Back -->
      <div
        class="absolute inset-0 flex items-center justify-center text-2xl font-black uppercase border-2 rotate-y-180 backface-hidden transition-all duration-500"
        :class="[
          statusClasses,
          isHardMode ? 'rounded-none font-serif' : 'rounded-xl'
        ]"
      >
        {{ letter }}
      </div>
    </div>
  </div>
</template>
