import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { Heart, Loader2 } from 'lucide-react'

export default function SignUp() {
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const { signInPasswordless } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    // Use passwordless auth (will create account if new, sign in if exists)
    const { error: authError } = await signInPasswordless(email)

    if (authError) {
      setError(authError.message)
      setLoading(false)
    } else {
      // Success - update user metadata with name if provided
      if (fullName) {
        // This will be handled by the trigger that creates the user profile
        // The Edge Function already sets name from email, but we can update it
        try {
          const { supabase } = await import('../lib/supabase')
          const { data: { user } } = await supabase.auth.getUser()
          if (user) {
            await supabase.auth.updateUser({
              data: { name: fullName }
            })
          }
        } catch (err) {
          // Non-critical - name update failed
        }
      }
      // Navigate will happen via auth state change
      navigate('/')
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
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Create Account</h1>
            <p className="text-gray-600">Start your wellness journey today</p>
          </div>

          {/* Birch & Stone member notice */}
          <div className="mb-4 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
            <p className="font-semibold">Birch &amp; Stone members</p>
            <p className="mt-1">
              If this is your first time using this login, you&apos;re in the right place — please complete the form below to finish setting up your account.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-1">
                Full Name <span className="text-gray-400 font-normal">(optional)</span>
              </label>
              <input
                id="fullName"
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-rose-400 focus:border-transparent outline-none transition"
                placeholder="John Doe"
              />
            </div>

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
              />
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-rose-400 to-teal-400 text-white font-semibold py-3 rounded-lg hover:from-rose-500 hover:to-teal-500 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Creating account...
                </>
              ) : (
                'Create Account'
              )}
            </button>
          </form>

          <p className="mt-4 text-center text-gray-500 text-xs">
            Enter your email to create an account. No password needed!
          </p>

          <p className="mt-6 text-center text-gray-600 text-sm">
            Already have an account?{' '}
            <Link to="/signin" className="text-rose-500 hover:text-rose-600 font-semibold">
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
