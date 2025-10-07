// src/pages/Notes.jsx
import { useEffect, useState } from 'react'
import { supabase } from '../supabaseClient'

export default function Notes() {
  const [notes, setNotes] = useState([])

  useEffect(() => {
    fetchNotes()
  }, [])

  async function fetchNotes() {
    const { data, error } = await supabase.from('notes').select('*')
    if (!error) setNotes(data)
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    location.reload() // or use navigate
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Your Notes</h1>
      <button onClick={handleLogout} className="bg-red-500 text-white px-4 py-2 rounded mb-6">
        Log Out
      </button>
      <ul>
        {notes.map(note => (
          <li key={note.id} className="p-2 bg-gray-100 rounded mb-2">{note.content}</li>
        ))}
      </ul>
    </div>
  )
}
