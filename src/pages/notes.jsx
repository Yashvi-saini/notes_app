import { useState,useEffect } from 'react'
import { supabase } from '../supabaseClient'
import { useNavigate } from 'react-router-dom'
import { runGeminiTask } from '../utils/gemini'

export default function Notes() {
  const [note, setNote] = useState('')
  const [title, setTitle] = useState('')
  const [output, setOutput] = useState('')
  const [loading, setLoading] = useState(false)
  const [notes, setNotes] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const navigate = useNavigate()
  useEffect(() => {
  fetchNotes()
}, [])

const fetchNotes = async () => {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return navigate('/login')

  const { data, error } = await supabase
    .from('notes')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  if (error) console.error('Error fetching notes:', error)
  else setNotes(data)
}


const extractFirstTitle = (text) => {
  const match = text.match(/\*+\s*\*?(.+?)\*?\s*$/m) // match first * Title *
  return match ? match[1].trim() : null
}




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
         if (type === 'title') {
         const firstTitle = extractFirstTitle(result)
         setTitle(firstTitle || 'Untitled Note')
          }
       else {
        setOutput(result)
        }
     } catch (error) {
      console.error('Gemini error:', error)
      setOutput('Error from Gemini API')
     }

    setLoading(false)
  }

  const generateId = () => {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
  }

 const handleSaveNote = async () => {
  if (!title.trim() || !note.trim()) return

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return navigate('/login')

  const { data, error } = await supabase
    .from('notes')
    .insert([{ title, content: note, user_id: user.id }])
    .select()

  if (error) {
    console.error('Error saving note:', error)
    return
  }

  setNotes([data[0], ...notes])
  setNote('')
  setTitle('')
  setOutput('')
}

const handleDeleteNote = async (id) => {
  const { error } = await supabase.from('notes').delete().eq('id', id)
  if (error) {
    console.error('Error deleting note:', error)
    return
  }
  setNotes(notes.filter((n) => n.id !== id))
}

  
  const filteredNotes = notes.filter((n) =>
    n.title.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="max-w-5xl mx-auto p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">📝 AI Notes Assistant</h1>
        <button
          onClick={handleLogout}
          className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded transition"
        >
          Logout
        </button>
      </div>

      {/* Note Input */}
      <div className="bg-white shadow p-6 rounded mb-6">
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Note Title"
          className="w-full p-3 border rounded mb-4 text-lg"
        />

        <textarea
          rows="6"
          value={note}
          onChange={(e) => setNote(e.target.value)}
          className="w-full p-3 border rounded mb-4"
          placeholder="Write your note here..."
        />

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-2 mb-4">
          <button onClick={() => handleGeminiAction('summarize')} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded">
            Summarize
          </button>
          <button onClick={() => handleGeminiAction('rewrite')} className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded">
            Rewrite
          </button>
          <button onClick={() => handleGeminiAction('explain')} className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded">
            Explain
          </button>
          <button onClick={() => handleGeminiAction('title')} className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded">
            Generate Title
          </button>
          <button onClick={handleSaveNote} className="bg-gray-800 hover:bg-black text-white px-4 py-2 rounded">
            Save Note
          </button>
        </div>

        {/* Output Box */}
        {output && (
          <div className="bg-gray-100 p-4 rounded text-gray-700 whitespace-pre-wrap">
            {loading ? 'Processing...' : output}
          </div>
        )}
      </div>

      {/* Search Bar */}
      <div className="mb-4">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search notes..."
          className="w-full p-3 border rounded"
        />
      </div>

      {/* Saved Notes List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredNotes.map((n) => (
          <div key={n.id} className="bg-white shadow p-4 rounded border hover:shadow-lg transition">
            <div className="flex justify-between items-start mb-2">
              <h2 className="text-lg font-semibold">{n.title}</h2>
              <button
                onClick={() => handleDeleteNote(n.id)}
                className="text-red-500 hover:text-red-700 text-sm"
              >
                Delete
              </button>
            </div>
            <p className="text-sm text-gray-500 mb-2">{n.date}</p>
            <p className="text-gray-700 text-sm whitespace-pre-wrap">{n.content}</p>
          </div>
        ))}

        {filteredNotes.length === 0 && (
          <p className="text-gray-500">No notes found.</p>
        )}
      </div>
    </div>
  )
}



