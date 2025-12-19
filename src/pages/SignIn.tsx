import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { Heart, Loader2 } from 'lucide-react'

export default function SignIn() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [emailSent, setEmailSent] = useState(false)
  const { signInPasswordless } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setEmailSent(false)

    const { error: pwdlessError, requiresPassword } = await signInPasswordless(email)
    
    if (requiresPassword) {
      // User has password - direct them to reset it
      setError('This account was created with a password. Please use the "Forgot Password" option to reset it, or contact support.')
      setLoading(false)
      return
    }

    if (pwdlessError) {
      setError(pwdlessError.message)
      setLoading(false)
    } else {
      // Email was sent - show success message
      setEmailSent(true)
      setLoading(false)
      // Don't navigate yet - wait for user to click email link
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-teal-50 to-cyan-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-rose-400 to-teal-400 rounded-full mb-4">
              <Heart className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome Back</h1>
            <p className="text-gray-600">Sign in to continue your wellness journey</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={loading}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-rose-400 focus:border-transparent outline-none transition disabled:opacity-50"
                placeholder="you@example.com"
                autoFocus
              />
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            {emailSent && (
              <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg text-sm">
                <p className="font-semibold mb-1">Check your email!</p>
                <p>We've sent a sign-in link to <strong>{email}</strong>. Click the link in the email to complete sign in.</p>
              </div>
            )}

            {!emailSent && (
              <button
                type="submit"
                disabled={loading || !email.trim()}
                className="w-full bg-gradient-to-r from-rose-400 to-teal-400 text-white font-semibold py-3 rounded-lg hover:from-rose-500 hover:to-teal-500 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Sending...
                  </>
                ) : (
                  'Continue'
                )}
              </button>
            )}
          </form>

          {!emailSent && (
            <p className="mt-4 text-center text-gray-500 text-xs">
              Enter your email to sign in. If you're new, we'll create an account for you automatically.
            </p>
          )}
        </div>
      </div>
    </div>
  )
}

