/**
 * Authentication Examples for Birch and Stone User Dashboard
 * Complete examples of authentication flows using Supabase
 */

import React, { useState, useEffect } from 'react'
import { supabase } from './supabase-client'

// ============================================================================
// SIGN UP COMPONENT
// ============================================================================

export function SignUpForm() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [fullName, setFullName] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage('')

    try {
      // Sign up the user
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
          },
        },
      })

      if (error) throw error

      if (data.user) {
        // Create user profile
        const { error: profileError } = await supabase
          .from('user_profiles')
          .insert({
            id: data.user.id,
            email: data.user.email,
            full_name: fullName,
          })

        if (profileError) throw profileError

        // Create default dashboard settings
        const { error: settingsError } = await supabase
          .from('dashboard_settings')
          .insert({
            user_id: data.user.id,
            theme: 'light',
            language: 'en',
          })

        if (settingsError) throw settingsError

        setMessage('Account created successfully! Please check your email to verify.')
      }
    } catch (error: any) {
      setMessage(error.message || 'An error occurred during sign up')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSignUp} className="space-y-4 max-w-md mx-auto p-6">
      <h2 className="text-2xl font-bold">Sign Up</h2>
      
      <div>
        <label className="block text-sm font-medium mb-1">Full Name</label>
        <input
          type="text"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          required
          className="w-full px-3 py-2 border rounded-md"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Email</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full px-3 py-2 border rounded-md"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Password</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          minLength={6}
          className="w-full px-3 py-2 border rounded-md"
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 disabled:opacity-50"
      >
        {loading ? 'Creating Account...' : 'Sign Up'}
      </button>

      {message && (
        <p className={`text-sm ${message.includes('error') ? 'text-red-600' : 'text-green-600'}`}>
          {message}
        </p>
      )}
    </form>
  )
}

// ============================================================================
// SIGN IN COMPONENT
// ============================================================================

export function SignInForm() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage('')

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) throw error

      if (data.user) {
        // Log the sign-in activity
        await supabase.from('activity_log').insert({
          user_id: data.user.id,
          action: 'sign_in',
          description: 'User signed in successfully',
        })

        setMessage('Signed in successfully!')
      }
    } catch (error: any) {
      setMessage(error.message || 'An error occurred during sign in')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSignIn} className="space-y-4 max-w-md mx-auto p-6">
      <h2 className="text-2xl font-bold">Sign In</h2>

      <div>
        <label className="block text-sm font-medium mb-1">Email</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full px-3 py-2 border rounded-md"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Password</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="w-full px-3 py-2 border rounded-md"
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 disabled:opacity-50"
      >
        {loading ? 'Signing In...' : 'Sign In'}
      </button>

      {message && (
        <p className={`text-sm ${message.includes('error') ? 'text-red-600' : 'text-green-600'}`}>
          {message}
        </p>
      )}
    </form>
  )
}

// ============================================================================
// PASSWORD RESET COMPONENT
// ============================================================================

export function PasswordResetForm() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage('')

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      })

      if (error) throw error

      setMessage('Password reset email sent! Please check your inbox.')
    } catch (error: any) {
      setMessage(error.message || 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handlePasswordReset} className="space-y-4 max-w-md mx-auto p-6">
      <h2 className="text-2xl font-bold">Reset Password</h2>

      <div>
        <label className="block text-sm font-medium mb-1">Email</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full px-3 py-2 border rounded-md"
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 disabled:opacity-50"
      >
        {loading ? 'Sending...' : 'Send Reset Email'}
      </button>

      {message && (
        <p className={`text-sm ${message.includes('error') ? 'text-red-600' : 'text-green-600'}`}>
          {message}
        </p>
      )}
    </form>
  )
}

// ============================================================================
// UPDATE PASSWORD COMPONENT (After reset)
// ============================================================================

export function UpdatePasswordForm() {
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage('')

    if (password !== confirmPassword) {
      setMessage('Passwords do not match')
      setLoading(false)
      return
    }

    try {
      const { error } = await supabase.auth.updateUser({
        password: password,
      })

      if (error) throw error

      setMessage('Password updated successfully!')
    } catch (error: any) {
      setMessage(error.message || 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleUpdatePassword} className="space-y-4 max-w-md mx-auto p-6">
      <h2 className="text-2xl font-bold">Update Password</h2>

      <div>
        <label className="block text-sm font-medium mb-1">New Password</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          minLength={6}
          className="w-full px-3 py-2 border rounded-md"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Confirm Password</label>
        <input
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
          minLength={6}
          className="w-full px-3 py-2 border rounded-md"
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 disabled:opacity-50"
      >
        {loading ? 'Updating...' : 'Update Password'}
      </button>

      {message && (
        <p className={`text-sm ${message.includes('error') || message.includes('not match') ? 'text-red-600' : 'text-green-600'}`}>
          {message}
        </p>
      )}
    </form>
  )
}

// ============================================================================
// SOCIAL AUTH COMPONENT
// ============================================================================

export function SocialAuthButtons() {
  const [loading, setLoading] = useState<string | null>(null)

  const handleSocialAuth = async (provider: 'google' | 'github' | 'discord') => {
    setLoading(provider)

    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${window.location.origin}/dashboard`,
        },
      })

      if (error) throw error
    } catch (error: any) {
      console.error('Social auth error:', error.message)
      setLoading(null)
    }
  }

  return (
    <div className="space-y-3 max-w-md mx-auto p-6">
      <h3 className="text-lg font-semibold text-center mb-4">Or continue with</h3>

      <button
        onClick={() => handleSocialAuth('google')}
        disabled={loading !== null}
        className="w-full flex items-center justify-center gap-2 px-4 py-2 border rounded-md hover:bg-gray-50 disabled:opacity-50"
      >
        {loading === 'google' ? 'Loading...' : 'Continue with Google'}
      </button>

      <button
        onClick={() => handleSocialAuth('github')}
        disabled={loading !== null}
        className="w-full flex items-center justify-center gap-2 px-4 py-2 border rounded-md hover:bg-gray-50 disabled:opacity-50"
      >
        {loading === 'github' ? 'Loading...' : 'Continue with GitHub'}
      </button>

      <button
        onClick={() => handleSocialAuth('discord')}
        disabled={loading !== null}
        className="w-full flex items-center justify-center gap-2 px-4 py-2 border rounded-md hover:bg-gray-50 disabled:opacity-50"
      >
        {loading === 'discord' ? 'Loading...' : 'Continue with Discord'}
      </button>

      <p className="text-xs text-gray-500 text-center mt-4">
        Note: Social auth providers must be enabled in your Supabase dashboard
      </p>
    </div>
  )
}

// ============================================================================
// AUTH STATE HOOK
// ============================================================================

export function useAuth() {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
      setLoading(false)
    })

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
      setLoading(false)
    })

    return () => subscription.unsubscribe()
  }, [])

  return { user, loading }
}

