<script setup lang="ts">
import Tile from './Tile.vue'
import type { Attempt } from '@/domain/models/types'

interface Props {
  attempts: Attempt[]
  currentGuess: string
  shakeRow?: boolean
  maxAttempts: number
  isHardMode?: boolean
}

const props = defineProps<Props>()
const COLS = 5
</script>

<template>
  <div 
    class="grid gap-2 p-4 transition-all duration-500"
    :style="{ gridTemplateRows: `repeat(${maxAttempts}, minmax(0, 1fr))` }"
  >
    <!-- Past attempts -->
    <div
      v-for="(attempt, i) in attempts"
      :key="`attempt-${i}`"
      class="flex gap-2"
    >
      <Tile
        v-for="(letter, j) in attempt.evaluatedLetters"
        :key="`tile-${i}-${j}`"
        :letter="letter.letter"
        :status="letter.feedback"
        :delay="j * 150"
        is-revealed
        :is-hard-mode="isHardMode"
      />
    </div>

    <!-- Current guess -->
    <div
      v-if="attempts.length < maxAttempts"
      class="flex gap-2"
      :class="{ 'animate-shake': shakeRow }"
    >
      <Tile
        v-for="i in COLS"
        :key="`current-${i}`"
        :letter="currentGuess[i - 1] || ''"
        :is-hard-mode="isHardMode"
      />
    </div>

    <!-- Empty rows -->
    <div
      v-for="i in Math.max(0, maxAttempts - attempts.length - 1)"
      :key="`empty-${i}`"
      class="flex gap-2"
    >
      <Tile
        v-for="j in COLS"
        :key="`empty-tile-${i}-${j}`"
        letter=""
        :is-hard-mode="isHardMode"
      />
    </div>
  </div>
</template>
