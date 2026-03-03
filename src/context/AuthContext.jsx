import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { supabase, isSupabaseConfigured } from '../lib/supabase'

const AuthContext = createContext(null)

// Demo user for local development without Supabase
const DEMO_USER = {
    id: 'demo-user-001',
    email: 'demo@angeboterstellenonline.de',
    isDemo: true
}

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        if (!isSupabaseConfigured()) {
            setLoading(false)
            return
        }

        // Check active session
        supabase.auth.getSession().then(({ data: { session } }) => {
            setUser(session?.user ?? null)
            setLoading(false)
        })

        // Listen for auth changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setUser(session?.user ?? null)
        })

        return () => subscription.unsubscribe()
    }, [])

    const signIn = useCallback(async (email) => {
        if (!isSupabaseConfigured()) {
            // Demo mode: instant login
            setUser({ ...DEMO_USER, email })
            return { error: null }
        }
        const { error } = await supabase.auth.signInWithOtp({
            email,
            options: { emailRedirectTo: window.location.origin + '/app' }
        })
        return { error }
    }, [])

    const signOut = useCallback(async () => {
        if (!isSupabaseConfigured()) {
            setUser(null)
            return
        }
        await supabase.auth.signOut()
        setUser(null)
    }, [])

    return (
        <AuthContext.Provider value={{ user, loading, signIn, signOut }}>
            {children}
        </AuthContext.Provider>
    )
}

export function useAuth() {
    const context = useContext(AuthContext)
    if (!context) throw new Error('useAuth must be used within AuthProvider')
    return context
}
