import { ref, computed } from 'vue'
import { Game } from '@/domain/usecases/game'
import { RealDictionary } from '@/infrastructure/RealDictionary'
import type { Attempt, GameState, LetterFeedback } from '@/domain/models/types'
import { InvalidWordError } from '@/domain/models/errors'
import { toast } from 'vue-sonner'

export type Difficulty = 'EASY' | 'NORMAL' | 'HARD'

export function useWordle() {
  const dictionary = new RealDictionary()
  const game = ref<Game | null>(null)

  const attempts = ref<Attempt[]>([])
  const gameState = ref<GameState>('IN PROGRESS')
  const currentGuess = ref('')
  const shakeRow = ref(false)
  const maxAttempts = ref(6)
  const currentDifficulty = ref<Difficulty>('NORMAL')
  const secretWord = ref('')

  const initGame = async (difficulty: Difficulty = 'NORMAL') => {
    currentDifficulty.value = difficulty
    
    switch (difficulty) {
      case 'EASY':
        maxAttempts.value = 8
        break
      case 'HARD':
        maxAttempts.value = 4
        break
      default:
        maxAttempts.value = 6
    }

    const newGame = new Game(dictionary, maxAttempts.value)
    await newGame.start(difficulty)
    game.value = newGame
    attempts.value = []
    gameState.value = 'IN PROGRESS'
    currentGuess.value = ''
    
    // Pour afficher le mot à la fin
    // @ts-ignore - Accès privé pour la démo UI de fin de partie
    secretWord.value = newGame.secretWord || ''
  }

  const submitGuess = async () => {
    if (!game.value || gameState.value !== 'IN PROGRESS') return
    
    if (currentGuess.value.length !== 5) {
      triggerShake()
      toast.error('Le mot doit faire 5 lettres')
      return
    }

    try {
      await game.value.play(currentGuess.value.toUpperCase())
      attempts.value = [...game.value.getAttempts()]
      gameState.value = game.value.getState()
      currentGuess.value = ''
    } catch (e) {
      if (e instanceof InvalidWordError) {
        triggerShake()
        toast.error('Mot non reconnu')
      } else {
        toast.error((e as Error).message)
      }
    }
  }

  const triggerShake = () => {
    shakeRow.value = true
    setTimeout(() => {
      shakeRow.value = false
    }, 500)
  }

  const addLetter = (letter: string) => {
    if (gameState.value !== 'IN PROGRESS') return
    if (currentGuess.value.length < 5 && /^[A-Z]$/i.test(letter)) {
      currentGuess.value += letter.toUpperCase()
    }
  }

  const removeLetter = () => {
    if (gameState.value !== 'IN PROGRESS') return
    currentGuess.value = currentGuess.value.slice(0, -1)
  }

  const letterStatuses = computed(() => {
    const statuses: Record<string, LetterFeedback> = {}
    attempts.value.forEach(attempt => {
      attempt.evaluatedLetters.forEach(({ letter, feedback }) => {
        const char = letter.toUpperCase()
        const current = statuses[char]
        if (feedback === 'CORRECT') {
          statuses[char] = 'CORRECT'
        } else if (feedback === 'MISPLACED' && current !== 'CORRECT') {
          statuses[char] = 'MISPLACED'
        } else if (feedback === 'ABSENT' && !current) {
          statuses[char] = 'ABSENT'
        }
      })
    })
    return statuses
  })

  return {
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
  }
}
