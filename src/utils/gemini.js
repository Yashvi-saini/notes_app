const API_KEY = import.meta.env.VITE_GEMINI_API_KEY
const ENDPOINT = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent"

const cleanGeminiOutput = (text) => {
  return text
    .replace(/^\s*[-*]+\s*/gm, '') 
    .replace(/\*{1,2}([^*]+)\*{1,2}/g, '$1') 
    .replace(/[`#>]/g, '') 
    .trim()
}

export async function runGeminiTask(type, inputText) {
  const promptMap = {
    summarize: `Summarize this text in plain text (no formatting or markdown):\n\n${inputText}`,
    rewrite: `Rewrite this note clearly and professionally. Only use plain text (no markdown or formatting):\n\n${inputText}`,
    explain: `Explain this note in simpler terms. Return only plain text with no markdown formatting:\n\n${inputText}`,
    title: `Generate a short, clear title for the following note. Just return the title in plain text, no formatting:\n\n${inputText}`,
  }

  const promptText = promptMap[type]

  try {
    const res = await fetch(`${ENDPOINT}?key=${API_KEY}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [
          {
            role: 'user',
            parts: [{ text: promptText }],
          },
        ],
      }),
    })

    const json = await res.json()
    console.log('Gemini response:', json)

    const rawOutput = json?.candidates?.[0]?.content?.parts?.[0]?.text
    const cleanedOutput = cleanGeminiOutput(rawOutput || '')

    return cleanedOutput || 'No response from Gemini'
  } catch (error) {
    console.error('Gemini error:', error)
    return 'Error from Gemini API'
  }
}


