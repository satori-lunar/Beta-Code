import { useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { Loader2 } from 'lucide-react'

export default function AuthCallback() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()

  useEffect(() => {
    const handleAuthCallback = async () => {
      // Extract tokens from URL hash or query params
      const hashParams = new URLSearchParams(window.location.hash.substring(1))
      const accessToken = hashParams.get('access_token')
      const refreshToken = hashParams.get('refresh_token')
      const type = hashParams.get('type')

      if (accessToken && refreshToken) {
        // Set the session with the tokens from the callback
        const { error } = await supabase.auth.setSession({
          access_token: accessToken,
          refresh_token: refreshToken
        })

        if (error) {
          console.error('Error setting session:', error)
          navigate('/signin?error=auth_failed')
        } else {
          // Success - redirect to dashboard
          navigate('/')
        }
      } else if (type === 'recovery') {
        // Password reset flow
        navigate('/reset-password')
      } else {
        // No tokens found
        navigate('/signin?error=no_tokens')
      }
    }

    handleAuthCallback()
  }, [navigate])

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-teal-50 to-cyan-50 flex items-center justify-center">
      <div className="text-center">
        <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-rose-500" />
        <p className="text-gray-600">Completing sign in...</p>
      </div>
    </div>
  )
}
