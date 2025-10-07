// src/utils/gemini.js

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY
const ENDPOINT = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent"

export async function runGeminiTask(type, inputText) {
  const promptMap = {
    summarize: `Summarize this text:\n\n${inputText}`,
    rewrite: `Rewrite this note to make it clearer:\n\n${inputText}`,
    explain: `Explain this note in simpler terms:\n\n${inputText}`,
    title: `Generate a short title for the following note:\n\n${inputText}`,
  }

  const promptText = promptMap[type]  

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

  const output = json?.candidates?.[0]?.content?.parts?.[0]?.text
  return output || 'No response from Gemini'
}

