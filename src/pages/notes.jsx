import { useState } from 'react'
import { supabase } from '../supabaseClient'
import { useNavigate } from 'react-router-dom'
import { runGeminiTask } from '../utils/gemini'

export default function Notes() {
  const [note, setNote] = useState('')
  const [output, setOutput] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleLogout = async () => {
    await supabase.auth.signOut()
    navigate('/login')
  }

  const handleGeminiAction = async (type) => {
    if (!note.trim()) return
    setLoading(true)
    setOutput('Thinking...')

    try {
      const result = await runGeminiTask(type, note)
      setOutput(result)
    } catch (error) {
      console.error('Gemini error:', error)
      setOutput('Error from Gemini API')
    }

    setLoading(false)
  }

  return (
    <div className="max-w-3xl mx-auto p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">📝 AI Notes Assistant</h1>
        <button onClick={handleLogout} className="bg-red-500 text-white px-4 py-2 rounded">
          Logout
        </button>
      </div>

      <textarea
        rows="8"
        value={note}
        onChange={(e) => setNote(e.target.value)}
        className="w-full p-4 border rounded mb-4"
        placeholder="Write your note here..."
      />

      <div className="flex flex-wrap gap-2 mb-6">
        <button onClick={() => handleGeminiAction('summarize')} className="bg-blue-600 text-white px-4 py-2 rounded">
          Summarize
        </button>
        <button onClick={() => handleGeminiAction('rewrite')} className="bg-green-600 text-white px-4 py-2 rounded">
          Rewrite
        </button>
        <button onClick={() => handleGeminiAction('explain')} className="bg-yellow-500 text-white px-4 py-2 rounded">
          Explain
        </button>
        <button onClick={() => handleGeminiAction('title')} className="bg-purple-600 text-white px-4 py-2 rounded">
          Generate Title
        </button>
      </div>

      <div className="bg-gray-100 p-4 rounded min-h-[100px]">
        {loading ? 'Processing...' : <pre className="whitespace-pre-wrap">{output}</pre>}
      </div>
    </div>
  )
}

