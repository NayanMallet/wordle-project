<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue'
import Key from './Key.vue'
import { Delete, CornerDownLeft } from 'lucide-vue-next'
import type { LetterFeedback } from '@/domain/models/types'

interface Props {
  letterStatuses: Record<string, LetterFeedback>
  disabled?: boolean
  isHardMode?: boolean
}

const props = defineProps<Props>()
const emit = defineEmits<{
  (e: 'key', value: string): void
  (e: 'enter'): void
  (e: 'backspace'): void
}>()

const rows = [
  ['A', 'Z', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
  ['Q', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L', 'M'],
  ['ENTER', 'W', 'X', 'C', 'V', 'B', 'N', 'BACKSPACE']
]

const handlePhysicalKey = (e: KeyboardEvent) => {
  // Bloquer absolument tout si la partie n'est pas en cours
  if (props.disabled) return
  
  if (e.ctrlKey || e.metaKey || e.altKey) return

  if (e.key === 'Enter') {
    e.preventDefault() // Empêche le déclenchement accidentel de boutons focusés
    emit('enter')
  } else if (e.key === 'Backspace') {
    e.preventDefault()
    emit('backspace')
  } else if (/^[a-zA-Z]$/.test(e.key)) {
    emit('key', e.key.toUpperCase())
  }
}

onMounted(() => {
  window.addEventListener('keydown', handlePhysicalKey)
})

onUnmounted(() => {
  window.removeEventListener('keydown', handlePhysicalKey)
})

const onKeyPress = (val: string) => {
  if (props.disabled) return
  if (val === 'ENTER') emit('enter')
  else if (val === 'BACKSPACE') emit('backspace')
  else emit('key', val)
}
</script>

<template>
  <div class="flex flex-col gap-2 p-4 w-full max-w-2xl mx-auto transition-opacity duration-500" :class="{ 'opacity-50 pointer-events-none': disabled }">
    <div v-for="(row, i) in rows" :key="i" class="flex justify-center gap-1 sm:gap-1.5">
      <template v-for="key in row" :key="key">
        <Key
          v-if="key === 'ENTER'"
          value="ENTER"
          wide
          :is-hard-mode="isHardMode"
          @press="onKeyPress"
          class="text-xs sm:text-sm"
        >
          <CornerDownLeft class="w-4 h-4 mr-1" />
          {{ isHardMode ? 'KILL' : 'ENTRÉE' }}
        </Key>
        <Key
          v-else-if="key === 'BACKSPACE'"
          value="BACKSPACE"
          wide
          :is-hard-mode="isHardMode"
          @press="onKeyPress"
        >
          <Delete class="w-5 h-5" />
        </Key>
        <Key
          v-else
          :value="key"
          :status="letterStatuses[key]"
          :is-hard-mode="isHardMode"
          @press="onKeyPress"
        />
      </template>
    </div>
  </div>
</template>
