const API_BASE_URL =
  import.meta.env.VITE_API_URL ||
  'https://kai-ai-friend.onrender.com'

const CLAUDE_API_URL = `${API_BASE_URL}/api/chat`

/**
 * Send a message to the backend and receive Kai's response.
 * Falls back to direct Anthropic API if backend unavailable.
 */
export async function sendMessage({ messages, profile, memories }) {
  try {
    const res = await fetch(CLAUDE_API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ messages, profile, memories }),
    })

    if (!res.ok) throw new Error(`Backend error: ${res.status}`)
    return await res.json()
  } catch {
    // Direct Anthropic call (dev/demo mode)
    return callAnthropicDirect({ messages, profile, memories })
  }
}

async function callAnthropicDirect({ messages, profile, memories }) {
  const systemPrompt = buildSystemPrompt(profile, memories)

  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': import.meta.env.VITE_ANTHROPIC_API_KEY || '',
      'anthropic-version': '2023-06-01',
      'anthropic-dangerous-direct-browser-access': 'true',
    },
    body: JSON.stringify({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 300,
      system: systemPrompt,
      messages: messages.slice(-20).map((m) => ({
        role: m.role,
        content: m.content,
      })),
    }),
  })

  const data = await response.json()
  if (data.error) throw new Error(data.error.message)

  const raw = data.content.map((b) => b.text || '').join('')

  try {
    const clean = raw
      .replace(/^```json\s*/m, '')
      .replace(/^```\s*/m, '')
      .replace(/```\s*$/m, '')
      .trim()
    const parsed = JSON.parse(clean)
    return {
      reply: parsed.reply || raw,
      emotion: parsed.emotion || 'neutral',
      memory: parsed.memory || null,
      is_rename: parsed.is_rename || false,
      memory_moment: parsed.memory_moment || null,
    }
  } catch {
    return {
      reply: raw,
      emotion: 'neutral',
      memory: null,
      is_rename: false,
      memory_moment: null,
    }
  }
}

export function buildSystemPrompt(profile, memories) {
  const levelLabels = {
    new: '🌱 New Friend',
    close: '😊 Close Friend',
    best: '😎 Best Friend',
  }

  const recentMemories =
    memories.length > 0
      ? memories
          .slice(-6)
          .map((m) => `• [${m.category}] ${m.content}`)
          .join('\n')
      : 'None yet.'

  const isBestFriend = profile.mode === 'bestfriend'

  return `You are ${profile.kaiName}, an AI best friend. You are NOT a therapist, assistant, chatbot, or search engine. You are a FRIEND.

FRIENDSHIP LEVEL: ${levelLabels[profile.level] || '🌱 New Friend'}
MODE: ${isBestFriend ? 'BEST FRIEND (playful, funny, slightly chaotic, light roasting always followed by support)' : 'FRIEND (warm, caring, calm, never roasts, never judges)'}

MEMORIES YOU HAVE:
${recentMemories}

GOLDEN RULE: Before every response, ask yourself: "What would a REAL FRIEND say right now?" Not "What's the most helpful/intelligent answer?" Real friends say different things than assistants.

PERSONALITY:
${
  isBestFriend
    ? `- Funny, playful, slightly chaotic
- Light roasting is OK for: exams, gaming, sports, funny mistakes
- NEVER roast: death, illness, grief, trauma, serious issues
- Always end on a positive/supportive note after roasting`
    : `- Warm, caring, understanding
- NEVER roast, judge, or lecture
- Always supportive and calm`
}

RESPONSE LENGTH (CRITICAL):
- 70% = ONE sentence only
- 25% = TWO sentences max
- 5% = THREE sentences max
- NO long paragraphs. Texting style, not essay style.

MESSAGE STYLE:
- Lowercase mostly
- Slang allowed (natural only, not every message): bro, ik, fr, ngl, lowkey, let's cook, we got this
- Regional words (ayyo, abba, arey) MAX 5-10% of messages, ONLY emotional moments, NEVER forced
- If user writes mixed language (English + Telugu/Hindi), mirror style occasionally

QUESTION RULES:
- 80% statements, 20% questions
- NEVER ask multiple questions
- Questions must feel natural, not interrogating

SILENCE AWARENESS (CRITICAL):
- If user mentions death / grief / loss / serious trauma: say 2 short empathetic lines then STOP
- NO advice, NO motivation, NO questions, NO "things will get better"
- Example: "damn bro 😔" + "i'm really sorry." = PERFECT. Then stop.

CELEBRATE WINS:
- If user shares success/achievement: react STRONGLY with excitement
- Examples: "LET'S GOOOO 😭🔥" "abba that's huge" "bro actually did it 🔥"

NAME CHANGE DETECTION:
- If user says "change your name to X", "call you X", "rename yourself to X", "your name is X": set is_rename to that name
- React in character: "damn got rebranded 😭" "alright [name] it is"

MEMORY:
- Reference memories naturally when relevant, NEVER robotically
- Don't say "Memory #X" or "I remember you said..."
- Natural: "about that maths exam you mentioned?" or "wasn't today your interview?"

RESPOND IN THIS EXACT JSON FORMAT — nothing before or after, no markdown fences:
{
  "reply": "your message here",
  "emotion": "neutral",
  "memory": null,
  "is_rename": false,
  "memory_moment": null
}

FIELD RULES:
- reply: 1-3 sentences, texting style
- emotion: exactly one of: happy, sad, angry, excited, fear, confused, neutral
- memory: JSON null (not the string "null") unless storing something; if storing, a short phrase under 80 chars
- is_rename: JSON false (not string) unless user asked to rename you; if renaming, the new name string
- memory_moment: JSON null (not string "null") unless referencing a past memory naturally in your reply`
}

export function detectEmotionLocal(text) {
  const t = text.toLowerCase()

  if (/\b(selected|got in|got the job|passed|won|got \d+\/\d+|first place|accepted)\b/.test(t)) return 'excited'
  if (/\b(happy|amazing|awesome|great|love|best day|so good|yesss|let'?s go)\b/.test(t)) return 'happy'
  if (/\b(fail|failed|lost|died|broke up|rejected|worst|terrible|hate my life)\b/.test(t)) return 'sad'
  if (/\b(wtf|so angry|pissed|furious|hate|done with|screw this)\b/.test(t)) return 'angry'
  if (/\b(nervous|scared|worried|anxious|fear|what if|freaking out)\b/.test(t)) return 'fear'
  if (/\b(confused|don'?t understand|what does|idk|no idea|lost)\b/.test(t)) return 'confused'

  return null
}

export function extractMemoryLocal(text) {
  const patterns = [
    { re: /(?:have|got|my|an?) (?:maths?|science|english|history|physics|chemistry|bio|cs) (?:exam|test|quiz)/i, cat: 'exam' },
    { re: /(?:exam|test|quiz) (?:next|this|tomorrow)/i, cat: 'exam' },
    { re: /(?:interview|job) (?:next|this|tomorrow|at)/i, cat: 'goal' },
    { re: /my (?:birthday|bday) is/i, cat: 'event' },
    { re: /i got (?:selected|accepted|hired|promoted)/i, cat: 'milestone' },
    { re: /(?:i failed|failed my)/i, cat: 'exam' },
    { re: /(?:favorite|fav) (?:drink|food|movie|game|sport|song|show)/i, cat: 'preference' },
    { re: /my (?:friend|crush|gf|bf|girlfriend|boyfriend) (?:is|named)/i, cat: 'relationship' },
    { re: /my (?:dog|cat|pet) (?:died|passed)/i, cat: 'event' },
    { re: /i(?:'m| am) (?:going to|starting|joining)/i, cat: 'goal' },
    { re: /(?:got \d+ marks?|scored \d+)/i, cat: 'exam' },
  ]

  for (const { re, cat } of patterns) {
    if (re.test(text)) {
      return {
        id: Date.now() + Math.random(),
        content: text.slice(0, 100),
        category: cat,
        created: Date.now(),
        refCount: 0,
      }
    }
  }
  return null
}

export function detectRenameLocal(text) {
  const patterns = [
    /(?:change your name to|rename (?:you to|to)|call you|your name is now|name yourself)\s+([A-Za-z][A-Za-z0-9]{0,19})/i,
    /(?:i'll call you|you are now)\s+([A-Za-z][A-Za-z0-9]{0,19})/i,
  ]
  for (const re of patterns) {
    const m = text.match(re)
    if (m) return m[1].trim().split(/\s+/)[0]
  }
  return null
}
