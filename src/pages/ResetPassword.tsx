import { useState, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { supabase } from '../lib/supabase'
import { Heart, Loader2, Lock, CheckCircle2 } from 'lucide-react'

export default function ResetPassword() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  useEffect(() => {
    // Check if we have the reset token in URL
    const accessToken = searchParams.get('access_token')
    const type = searchParams.get('type')

    if (type === 'recovery' && accessToken) {
      // Exchange the token for a session
      supabase.auth
        .getSession()
        .then(({ data: { session } }) => {
          if (!session) {
            // Try to set the session from the token
            supabase.auth.setSession({
              access_token: accessToken,
              refresh_token: searchParams.get('refresh_token') || ''
            } as any)
          }
        })
        .catch(() => {
          setError('Invalid or expired reset link. Please request a new password reset.')
        })
    } else if (!accessToken) {
      setError('Invalid reset link. Please request a new password reset.')
    }
  }, [searchParams])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (password.length < 6) {
      setError('Password must be at least 6 characters long')
      return
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match')
      return
    }

    setLoading(true)

    try {
      const { error: updateError } = await supabase.auth.updateUser({
        password: password
      })

      if (updateError) {
        setError(updateError.message)
        setLoading(false)
      } else {
        setSuccess(true)
        setLoading(false)
        // Redirect to dashboard after 2 seconds
        setTimeout(() => {
          navigate('/')
        }, 2000)
      }
    } catch (err: any) {
      setError(err?.message || 'Failed to reset password')
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-teal-50 to-cyan-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-rose-400 to-teal-400 rounded-full mb-4">
              <Lock className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Reset Password</h1>
            <p className="text-gray-600">Enter your new password below</p>
          </div>

          {success ? (
            <div className="text-center py-4">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Password Reset Successful!</h3>
              <p className="text-gray-600 mb-4">
                Your password has been updated. Redirecting you to the dashboard...
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                  New Password
                </label>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={6}
                  autoFocus
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-rose-400 focus:border-transparent outline-none transition"
                  placeholder="Enter new password"
                />
                <p className="mt-1 text-xs text-gray-500">Must be at least 6 characters</p>
              </div>

              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                  Confirm Password
                </label>
                <input
                  id="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  minLength={6}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-rose-400 focus:border-transparent outline-none transition"
                  placeholder="Confirm new password"
                />
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading || !password || !confirmPassword}
                className="w-full bg-gradient-to-r from-rose-400 to-teal-400 text-white font-semibold py-3 rounded-lg hover:from-rose-500 hover:to-teal-500 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Resetting password...
                  </>
                ) : (
                  'Reset Password'
                )}
              </button>
            </form>
          )}

          <p className="mt-6 text-center text-gray-600 text-sm">
            Remember your password?{' '}
            <button
              onClick={() => navigate('/signin')}
              className="text-rose-500 hover:text-rose-600 font-semibold"
            >
              Sign In
            </button>
          </p>
        </div>
      </div>
    </div>
  )
}


