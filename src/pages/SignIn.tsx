import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { Heart, Loader2, Mail } from 'lucide-react'

export default function SignIn() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [magicLinkLoading, setMagicLinkLoading] = useState(false)
  const [error, setError] = useState('')
  const [magicLinkMessage, setMagicLinkMessage] = useState('')
  const { signIn, signInWithMagicLink } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setMagicLinkMessage('')

    const { error: signInError } = await signIn(email, password)
    if (signInError) {
      setError(signInError.message)
      setLoading(false)
    } else {
      navigate('/')
    }
  }

  const handleMagicLink = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email.trim()) {
      setError('Please enter your email address')
      return
    }
    setMagicLinkLoading(true)
    setError('')
    setMagicLinkMessage('')

    const { error: magicLinkError, message } = await signInWithMagicLink(email)
    if (magicLinkError) {
      setError(magicLinkError.message)
      setMagicLinkLoading(false)
    } else {
      setMagicLinkMessage(message || 'Check your email for the magic link!')
      setMagicLinkLoading(false)
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

          {/* Birch & Stone member notice */}
          <div className="mb-4 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
            <p className="font-semibold">Birch &amp; Stone members</p>
            <p className="mt-1">
              If this is your first time using this login, please click the{' '}
              <span className="font-semibold">Sign Up</span> button and fill out your information to activate your account.
            </p>
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
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-rose-400 focus:border-transparent outline-none transition"
                placeholder="you@example.com"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-rose-400 focus:border-transparent outline-none transition"
                placeholder="••••••••"
              />
              <p className="mt-1 text-xs text-gray-500">
                Leave blank to sign in with email link instead
              </p>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            {magicLinkMessage && (
              <div className="bg-green-50 border border-green-200 text-green-600 px-4 py-3 rounded-lg text-sm">
                {magicLinkMessage}
              </div>
            )}

            {password ? (
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-rose-400 to-teal-400 text-white font-semibold py-3 rounded-lg hover:from-rose-500 hover:to-teal-500 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Signing in...
                  </>
                ) : (
                  'Sign In with Password'
                )}
              </button>
            ) : (
              <button
                type="button"
                onClick={handleMagicLink}
                disabled={magicLinkLoading || !email.trim()}
                className="w-full bg-gradient-to-r from-rose-400 to-teal-400 text-white font-semibold py-3 rounded-lg hover:from-rose-500 hover:to-teal-500 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {magicLinkLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Sending link...
                  </>
                ) : (
                  <>
                    <Mail className="w-5 h-5" />
                    Send Magic Link to Email
                  </>
                )}
              </button>
            )}
          </form>

          <p className="mt-6 text-center text-gray-600 text-sm">
            Don't have an account?{' '}
            <Link to="/signup" className="text-rose-500 hover:text-rose-600 font-semibold">
              Sign Up
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

