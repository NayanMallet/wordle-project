<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { Toaster } from 'vue-sonner'
import 'vue-sonner/style.css'
import Grid from './components/Grid.vue'
import Keyboard from './components/Keyboard.vue'
import { useWordle, type Difficulty } from './composables/useWordle'
import { Trophy, XCircle, RotateCcw, Flame, Swords, Heart } from 'lucide-vue-next'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'

const {
  attempts,
  gameState,
  currentGuess,
  shakeRow,
  letterStatuses,
  maxAttempts,
  currentDifficulty,
  secretWord,
  initGame,
  submitGuess,
  addLetter,
  removeLetter
} = useWordle()

const view = ref<'HOME' | 'GAME'>('HOME')

const startGame = (difficulty: Difficulty) => {
  initGame(difficulty)
  view.value = 'GAME'
}

const goToHome = () => {
  view.value = 'HOME'
}

const canReplay = ref(false)

watch(gameState, (newState) => {
  if (newState !== 'IN PROGRESS') {
    setTimeout(() => {
      canReplay.value = true
    }, 800)
  } else {
    canReplay.value = false
  }
})

const handleReplay = () => {
  if (!canReplay.value) return
  initGame(currentDifficulty.value)
}

const isHardMode = computed(() => currentDifficulty.value === 'HARD')
</script>

<template>
  <div 
    class="min-h-screen transition-colors duration-700 flex flex-col items-center"
    :class="[
      isHardMode ? 'bg-black text-red-600' : 'bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100'
    ]"
  >
    <div v-if="isHardMode" class="fixed inset-0 pointer-events-none opacity-20 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>

    <header class="py-8 text-center relative z-10">
      <h1 
        class="text-5xl font-black tracking-tighter uppercase transition-all duration-500"
        :class="isHardMode ? 'text-red-700 italic skew-x-[-10deg] drop-shadow-[0_0_10px_rgba(220,38,38,0.5)]' : 'text-zinc-900 dark:text-white'"
      >
        Wordle<span :class="isHardMode ? 'text-red-500' : 'text-emerald-500'">Master</span>
      </h1>
      <div 
        class="h-1.5 w-24 mx-auto rounded-full mt-2 transition-all duration-500"
        :class="isHardMode ? 'bg-red-800 w-48 blur-sm' : 'bg-emerald-500'"
      ></div>
    </header>

    <main class="flex-grow flex flex-col items-center justify-center w-full max-w-2xl px-4 relative z-10">
      <div v-if="view === 'HOME'" class="flex flex-col gap-8 w-full animate-in fade-in zoom-in duration-500">
        <div class="text-center space-y-2">
          <p class="text-zinc-500 dark:text-zinc-400 text-lg font-medium">Choisissez votre défi</p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <button @click="startGame('EASY')" class="group p-8 rounded-3xl bg-white dark:bg-zinc-900 border-4 border-emerald-100 dark:border-emerald-900/30 hover:border-emerald-500 transition-all duration-300 hover:scale-105 shadow-xl">
            <div class="flex flex-col items-center gap-4">
              <div class="p-4 bg-emerald-100 dark:bg-emerald-900/50 rounded-2xl text-emerald-600"><Heart class="w-10 h-10" /></div>
              <h3 class="text-2xl font-bold text-emerald-600">EASY</h3>
              <p class="text-sm text-zinc-500 dark:text-zinc-400 text-center">8 tentatives<br>Mots courants</p>
            </div>
          </button>
          <button @click="startGame('NORMAL')" class="group p-8 rounded-3xl bg-white dark:bg-zinc-900 border-4 border-amber-100 dark:border-amber-900/30 hover:border-amber-500 transition-all duration-300 hover:scale-105 shadow-xl">
            <div class="flex flex-col items-center gap-4">
              <div class="p-4 bg-amber-100 dark:bg-amber-900/50 rounded-2xl text-amber-600"><Swords class="w-10 h-10" /></div>
              <h3 class="text-2xl font-bold text-amber-600">NORMAL</h3>
              <p class="text-sm text-zinc-500 dark:text-zinc-400 text-center">6 tentatives<br>Standard</p>
            </div>
          </button>
          <button @click="startGame('HARD')" class="group p-8 rounded-3xl bg-zinc-950 border-4 border-red-950 hover:border-red-600 transition-all duration-500 hover:scale-110 shadow-2xl relative overflow-hidden">
            <div class="flex flex-col items-center gap-4 relative z-10">
              <div class="p-4 bg-red-900/20 rounded-2xl text-red-600 animate-pulse"><Flame class="w-10 h-10" /></div>
              <h3 class="text-2xl font-black text-red-600 italic tracking-widest">HARD</h3>
              <p class="text-sm text-red-900 font-bold text-center uppercase">4 tentatives<br>DÉMONIAQUE</p>
            </div>
          </button>
        </div>
      </div>

      <div v-else class="flex flex-col items-center w-full animate-in slide-in-from-bottom-10 duration-700">
        <div class="mb-4 flex justify-between w-full max-w-md items-center px-4">
          <button @click="goToHome" class="text-sm font-bold opacity-50 hover:opacity-100 transition-opacity flex items-center gap-1">
            <RotateCcw class="w-4 h-4" /> Accueil
          </button>
          <div class="px-3 py-1 rounded-full text-xs font-black uppercase tracking-widest" :class="isHardMode ? 'bg-red-900 text-red-200 animate-pulse' : 'bg-zinc-200 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400'">
            {{ currentDifficulty }} MODE
          </div>
        </div>

        <Grid :attempts="attempts" :currentGuess="currentGuess" :shake-row="shakeRow" :max-attempts="maxAttempts" :is-hard-mode="isHardMode" />

        <div class="w-full mt-8">
          <Keyboard :letter-statuses="letterStatuses" :disabled="gameState !== 'IN PROGRESS'" :is-hard-mode="isHardMode" @key="addLetter" @enter="submitGuess" @backspace="removeLetter" />
        </div>
      </div>
    </main>

    <Dialog :open="gameState !== 'IN PROGRESS' && view === 'GAME'">
      <DialogContent 
        class="sm:max-w-md transition-all duration-500"
        :class="isHardMode ? 'bg-black border-4 border-red-600 text-red-600 rounded-none' : 'bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 rounded-3xl'"
      >
        <DialogHeader class="items-center text-center">
          <div v-if="gameState === 'WON'" class="w-20 h-20 rounded-full flex items-center justify-center mb-4 transition-colors" :class="isHardMode ? 'bg-red-600/20 text-red-600' : 'bg-emerald-500/20 text-emerald-500'">
            <Trophy class="w-12 h-12 animate-bounce" />
          </div>
          <div v-else class="w-20 h-20 rounded-full flex items-center justify-center mb-4 transition-colors" :class="isHardMode ? 'bg-red-600 text-black' : 'bg-red-500/20 text-red-500'">
            <XCircle class="w-12 h-12 animate-pulse" />
          </div>
          
          <DialogTitle 
            class="text-4xl font-black uppercase tracking-tighter" 
            :class="[
              isHardMode ? 'italic text-red-600' : 'text-slate-900 dark:text-white'
            ]"
          >
            {{ gameState === 'WON' ? 'VICTOIRE !' : 'DÉFAITE' }}
          </DialogTitle>
          <DialogDescription 
            class="text-lg font-medium" 
            :class="[
              isHardMode ? 'text-red-900 uppercase' : 'text-zinc-500 dark:text-zinc-400'
            ]"
          >
            {{ gameState === 'WON' ? 'Vous avez triomphé du destin.' : 'Le mot vous a échappé...' }}
          </DialogDescription>
        </DialogHeader>

        <div class="flex flex-col items-center gap-6 mt-6">
          <div 
            class="text-center p-6 w-full rounded-2xl" 
            :class="isHardMode ? 'bg-red-950/30 border-2 border-red-900' : 'bg-zinc-100 dark:bg-zinc-800'"
          >
            <p class="text-xs uppercase tracking-[0.3em] mb-1 font-bold opacity-50" :class="isHardMode ? 'text-red-900' : 'text-slate-900 dark:text-white'">
              Le mot secret était
            </p>
            <p 
              class="text-4xl font-black tracking-widest uppercase" 
              :class="isHardMode ? 'text-red-500' : 'text-slate-900 dark:text-white'"
            >
              {{ secretWord }}
            </p>
          </div>

          <div class="grid grid-cols-2 gap-4 w-full">
            <Button
              @click="handleReplay"
              :disabled="!canReplay"
              class="h-16 text-lg font-bold transition-all duration-300 disabled:opacity-50"
              :class="isHardMode ? 'bg-red-600 hover:bg-red-500 text-black rounded-none skew-x-[-5deg]' : 'bg-emerald-600 hover:bg-emerald-500 text-white rounded-2xl'"
            >
              REJOUER
            </Button>
            <Button
              @click="goToHome"
              variant="outline"
              class="h-16 text-lg font-bold transition-all duration-300"
              :class="isHardMode ? 'border-red-900 text-red-900 hover:bg-red-950/20 rounded-none skew-x-[-5deg]' : 'border-zinc-200 dark:border-zinc-800 rounded-2xl'"
            >
              ACCUEIL
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>

    <Toaster />
  </div>
</template>

<style>
[data-sonner-toast] {
  border-radius: 1rem !important;
  font-weight: 600 !important;
}

.perspective-1000 { perspective: 1000px; }
.backface-hidden { backface-visibility: hidden; }
.rotate-y-180 { transform: rotateY(180deg); }
.preserve-3d { transform-style: preserve-3d; }
@keyframes shake {
  0%, 100% { transform: translateX(0); }
  20%, 60% { transform: translateX(-5px); }
  40%, 80% { transform: translateX(5px); }
}
.animate-shake { animation: shake 0.4s ease-in-out; }
</style>
