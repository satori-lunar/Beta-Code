import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

// We now use a single email-only flow for both
// new and existing users on the Sign In page.
// This page simply redirects there.

export default function SignUp() {
  const navigate = useNavigate()

  useEffect(() => {
    navigate('/signin', { replace: true })
  }, [navigate])

  return null
}
