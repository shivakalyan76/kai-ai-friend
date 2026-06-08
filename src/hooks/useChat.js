import { useCallback } from 'react'
import { useAppStore } from '../store/appStore.js'
import { sendMessage, detectEmotionLocal, extractMemoryLocal, detectRenameLocal } from '../utils/api.js'
import { spawnConfetti, showToast } from '../utils/helpers.js'

export function useChat() {
  const {
    profile,
    messages,
    memories,
    addMessage,
    addMemory,
    setEmotion,
    setIsTyping,
    updateProfile,
    gainXP,
  } = useAppStore()

  const sendUserMessage = useCallback(
    async (text) => {
      if (!text.trim() || !profile) return

      // Optimistic local rename detection
      const localRename = detectRenameLocal(text)

      // Add user message
      const userMsg = {
        id: Date.now(),
        role: 'user',
        content: text,
        ts: Date.now(),
        emotion: null,
        memoryMoment: null,
      }
      addMessage(userMsg)
      setIsTyping(true)

      try {
        // Build message history for API.
        // Claude API requires first message role = 'user' and alternating roles.
        // The welcome message is role 'assistant' — strip any leading assistant messages.
        const rawHistory = [...messages, userMsg]
          .slice(-20)
          .map((m) => ({ role: m.role, content: m.content }))
        const firstUserIdx = rawHistory.findIndex((m) => m.role === 'user')
        const apiMessages = firstUserIdx > 0 ? rawHistory.slice(firstUserIdx) : rawHistory

        // Quick local emotion detection for immediate avatar feedback
        const localEmotion = detectEmotionLocal(text)
        if (localEmotion) setEmotion(localEmotion)

        // Call Claude
        const result = await sendMessage({
          messages: apiMessages,
          profile,
          memories,
        })

        const detectedEmotion = result.emotion || 'neutral'
        setEmotion(detectedEmotion)

        // Handle rename
        const newName = result.is_rename || localRename
        if (newName && typeof newName === 'string' && newName.length > 0 && newName.length < 24) {
          updateProfile({ kaiName: newName.charAt(0).toUpperCase() + newName.slice(1) })
          showToast(`Name changed to ${newName} 🎉`)
        }

        // Handle memory
        // Guard: Claude sometimes returns the string "null" instead of JSON null
        const rawMemory = result.memory
        const memoryFromAI = (rawMemory && typeof rawMemory === 'string' && rawMemory !== 'null')
          ? rawMemory : null
        const rawMoment = result.memory_moment
        const memoryMoment = (rawMoment && typeof rawMoment === 'string' && rawMoment !== 'null')
          ? rawMoment : null
        const memoryFromLocal = extractMemoryLocal(text)

        let xpGain = 2
        if (['sad', 'excited', 'fear', 'angry'].includes(detectedEmotion)) xpGain += 5

        if (memoryFromAI && typeof memoryFromAI === 'string') {
          addMemory({
            id: Date.now() + 1,
            content: memoryFromAI,
            category: 'general',
            created: Date.now(),
            refCount: 0,
          })
          xpGain += 3
        } else if (memoryFromLocal) {
          addMemory(memoryFromLocal)
          xpGain += 3
        }

        gainXP(xpGain)

        // Add Kai's response
        const aiMsg = {
          id: Date.now() + 2,
          role: 'assistant',
          content: result.reply,
          emotion: detectedEmotion,
          ts: Date.now(),
          memoryMoment: memoryMoment,
        }
        addMessage(aiMsg)

        // Confetti on excited
        if (detectedEmotion === 'excited') {
          setTimeout(spawnConfetti, 300)
        }

        return aiMsg
      } catch (err) {
        console.error('Chat error:', err)
        const errMsg = {
          id: Date.now() + 3,
          role: 'assistant',
          content: "ngl something went wrong on my end 😅 try again?",
          emotion: 'confused',
          ts: Date.now(),
          memoryMoment: null,
        }
        addMessage(errMsg)
        setEmotion('confused')
      } finally {
        setIsTyping(false)
      }
    },
    [profile, messages, memories, addMessage, addMemory, setEmotion, setIsTyping, updateProfile, gainXP]
  )

  return { sendUserMessage }
}
