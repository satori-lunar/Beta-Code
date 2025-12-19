import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { Heart, Loader2, Mail, X } from 'lucide-react'

export default function SignIn() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [requiresPassword, setRequiresPassword] = useState(false)
  const [showForgotPassword, setShowForgotPassword] = useState(false)
  const [resetEmail, setResetEmail] = useState('')
  const [resetLoading, setResetLoading] = useState(false)
  const [resetSuccess, setResetSuccess] = useState('')
  const { signIn, signInPasswordless, resetPassword } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    // If password is required (existing user with password), use password auth
    if (requiresPassword && password) {
      const { error: signInError } = await signIn(email, password)
      if (signInError) {
        setError(signInError.message)
        setLoading(false)
      } else {
        navigate('/')
      }
      return
    }

    // Try passwordless first
    if (!requiresPassword) {
      const { error: pwdlessError, requiresPassword: needsPwd } = await signInPasswordless(email)
      
      if (needsPwd) {
        // User has password - show password field
        setRequiresPassword(true)
        setLoading(false)
        return
      }

      if (pwdlessError) {
        setError(pwdlessError.message)
        setLoading(false)
      } else {
        // Success - navigate will happen via auth state change
        navigate('/')
      }
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
                onChange={(e) => {
                  setEmail(e.target.value)
                  setRequiresPassword(false) // Reset when email changes
                  setPassword('')
                }}
                required
                disabled={loading}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-rose-400 focus:border-transparent outline-none transition disabled:opacity-50"
                placeholder="you@example.com"
              />
            </div>

            {requiresPassword && (
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                    Password
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      setResetEmail(email)
                      setShowForgotPassword(true)
                    }}
                    className="text-sm text-rose-500 hover:text-rose-600 font-medium"
                  >
                    Forgot password?
                  </button>
                </div>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoFocus
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-rose-400 focus:border-transparent outline-none transition"
                  placeholder="Enter your password"
                />
                <p className="mt-1 text-xs text-gray-500">
                  This account was created with a password. Please enter it to continue.
                </p>
              </div>
            )}

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading || (requiresPassword && !password)}
              className="w-full bg-gradient-to-r from-rose-400 to-teal-400 text-white font-semibold py-3 rounded-lg hover:from-rose-500 hover:to-teal-500 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  {requiresPassword ? 'Signing in...' : 'Signing in...'}
                </>
              ) : (
                requiresPassword ? 'Sign In' : 'Continue'
              )}
            </button>
          </form>

          {!requiresPassword && (
            <p className="mt-4 text-center text-gray-500 text-xs">
              Enter your email to sign in. If you're new, we'll create an account for you automatically.
            </p>
          )}
        </div>
      </div>

      {/* Forgot Password Modal */}
      {showForgotPassword && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-900">Reset Password</h2>
              <button
                onClick={() => {
                  setShowForgotPassword(false)
                  setResetEmail('')
                  setResetSuccess('')
                  setError('')
                }}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            {resetSuccess ? (
              <div className="text-center py-4">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Mail className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Check Your Email</h3>
                <p className="text-gray-600 mb-4">
                  We've sent a password reset link to <strong>{resetEmail}</strong>
                </p>
                <p className="text-sm text-gray-500 mb-4">
                  Click the link in the email to reset your password. The link will expire in 1 hour.
                </p>
                <button
                  onClick={() => {
                    setShowForgotPassword(false)
                    setResetEmail('')
                    setResetSuccess('')
                  }}
                  className="w-full bg-gradient-to-r from-rose-400 to-teal-400 text-white font-semibold py-2 rounded-lg hover:from-rose-500 hover:to-teal-500 transition"
                >
                  Got it
                </button>
              </div>
            ) : (
              <form
                onSubmit={async (e) => {
                  e.preventDefault()
                  if (!resetEmail.trim()) {
                    setError('Please enter your email address')
                    return
                  }

                  setResetLoading(true)
                  setError('')
                  setResetSuccess('')

                  const { error: resetError, message } = await resetPassword(resetEmail)

                  if (resetError) {
                    setError(resetError.message || 'Failed to send reset email')
                    setResetLoading(false)
                  } else {
                    setResetSuccess(message || 'Password reset email sent!')
                    setResetLoading(false)
                  }
                }}
                className="space-y-4"
              >
                <div>
                  <label htmlFor="resetEmail" className="block text-sm font-medium text-gray-700 mb-1">
                    Email Address
                  </label>
                  <input
                    id="resetEmail"
                    type="email"
                    value={resetEmail}
                    onChange={(e) => setResetEmail(e.target.value)}
                    required
                    disabled={resetLoading}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-rose-400 focus:border-transparent outline-none transition disabled:opacity-50"
                    placeholder="you@example.com"
                    autoFocus
                  />
                  <p className="mt-1 text-xs text-gray-500">
                    Enter the email address associated with your account
                  </p>
                </div>

                {error && (
                  <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">
                    {error}
                  </div>
                )}

                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      setShowForgotPassword(false)
                      setResetEmail('')
                      setError('')
                    }}
                    disabled={resetLoading}
                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition disabled:opacity-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={resetLoading || !resetEmail.trim()}
                    className="flex-1 bg-gradient-to-r from-rose-400 to-teal-400 text-white font-semibold py-2 rounded-lg hover:from-rose-500 hover:to-teal-500 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {resetLoading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Sending...
                      </>
                    ) : (
                      'Send Reset Link'
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

