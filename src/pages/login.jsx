import { useState } from 'react'
import { supabase } from '../supabaseClient'
import { useNavigate } from 'react-router-dom'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isSignUp, setIsSignUp] = useState(false)
  const [error, setError] = useState('')
  const navigate = useNavigate()
const handleAuth = async (e) => {
  e.preventDefault()

  //email and password inputs
  const cleanedEmail = email.trim().replace(/"/g, '')
  const cleanedPassword = password.trim()

  // Extra validation
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
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
  <div className="w-full max-w-md bg-white shadow-md rounded-lg p-8">
    <h2 className="text-2xl font-semibold text-center text-gray-800 mb-6">
      {isSignUp ? 'Create an Account' : 'Welcome Back'}
    </h2>

    <form onSubmit={handleAuth} className="space-y-5">
      <div>
        <label className="block text-sm font-medium text-gray-700">Email</label>
        <input
          type="email"
          placeholder="you@example.com"
          className="w-full mt-1 px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Password</label>
        <input
          type="password"
          placeholder="••••••••"
          className="w-full mt-1 px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>

      {error && <p className="text-red-500 text-sm">{error}</p>}

      <button
        type="submit"
        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 rounded transition duration-150"
      >
        {isSignUp ? 'Sign Up' : 'Log In'}
      </button>
    </form>

    <p className="mt-6 text-sm text-center text-gray-600">
      {isSignUp ? 'Already have an account?' : "Don't have an account?"}{' '}
      <button
        type="button"
        onClick={() => setIsSignUp(!isSignUp)}
        className="text-blue-600 hover:underline font-medium"
      >
        {isSignUp ? 'Log in' : 'Sign up'}
      </button>
    </p>
  </div>
</div>

  )
}
