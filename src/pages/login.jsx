// src/pages/Login.jsx
import { useState } from 'react'
import { supabase } from '../supabaseClient'
import { useNavigate } from 'react-router-dom'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isSignUp, setIsSignUp] = useState(false)
  const [error, setError] = useState('')
  const navigate = useNavigate()

 /* const handleAuth = async (e) => {
  e.preventDefault()
  const cleanedEmail = email.trim()
  const cleanedPassword = password.trim()

  let result
  if (isSignUp) {
    result = await supabase.auth.signUp({
      email: cleanedEmail,
      password: cleanedPassword,
    })
  } else {
    result = await supabase.auth.signInWithPassword({
      email: cleanedEmail,
      password: cleanedPassword,
    })
  }

  if (result.error) setError(result.error.message)
  else navigate('/')
}*/
const handleAuth = async (e) => {
  e.preventDefault()

  // Sanitize email and password inputs
  const cleanedEmail = email.trim().replace(/"/g, '')
  const cleanedPassword = password.trim()

  // Extra validation (optional but recommended)
  const isValidEmail = /^[^\s@"]+@[^\s@"]+\.[^\s@"]+$/.test(cleanedEmail)
  if (!isValidEmail) {
    setError('Invalid email format.')
    return
  }

  console.log("Sending Email:", cleanedEmail)
  console.log("Sending Password:", cleanedPassword)

  let result
  if (isSignUp) {
    result = await supabase.auth.signUp({
      email: cleanedEmail,
      password: cleanedPassword,
    })
  } else {
    result = await supabase.auth.signInWithPassword({
      email: cleanedEmail,
      password: cleanedPassword,
    })
  }

  if (result.error) {
    console.error("Supabase Auth Error:", result.error.message)
    setError(result.error.message)
  } else {
    navigate('/')
  }
}




  return (
    <div className="p-8 max-w-md mx-auto">
      <h2 className="text-xl font-bold mb-4">{isSignUp ? 'Sign Up' : 'Log In'}</h2>
      <form onSubmit={handleAuth} className="space-y-4">
        <input
          type="email"
          placeholder="Email"
          className="w-full p-2 border"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          className="w-full p-2 border"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        {error && <p className="text-red-500">{error}</p>}
        <button className="bg-blue-600 text-white px-4 py-2 rounded w-full">
          {isSignUp ? 'Create Account' : 'Log In'}
        </button>
      </form>
      <p className="mt-4 text-sm text-center">
        {isSignUp ? 'Already have an account?' : "Don't have an account?"}{' '}
        <button className="underline" onClick={() => setIsSignUp(!isSignUp)}>
          {isSignUp ? 'Log in' : 'Sign up'}
        </button>
      </p>
    </div>
  )
}
