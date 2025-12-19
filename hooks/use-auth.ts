"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import { createClient } from "@/lib/supabase/client"
import type { AuthUser, Profile } from "@/lib/auth-client"
import { appCache, CACHE_KEYS, CACHE_TTL, STALE_TTL } from "@/lib/cache"

interface UseAuthReturn {
  user: AuthUser | null
  profile: Profile | null
  loading: boolean
  error: string | null
  isStale: boolean
  refetch: () => Promise<void>
}

// Singleton to track polling across components
let globalPollingInterval: ReturnType<typeof setInterval> | null = null
let subscriberCount = 0
let lastFetchTime = 0
let lastVisibilityFetchTime = 0
const MIN_FETCH_INTERVAL = 2000 // Prevent rapid refetching
const VISIBILITY_FETCH_INTERVAL = 5000 // Min time between visibility refetches
const AUTH_TIMEOUT = 3000 // 3 second timeout for auth calls

function withTimeout<T>(promise: Promise<T>, ms: number, fallback: T): Promise<T> {
  return Promise.race([promise, new Promise<T>((resolve) => setTimeout(() => resolve(fallback), ms))])
}

export function useAuth(): UseAuthReturn {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isStale, setIsStale] = useState(false)
  const mountedRef = useRef(true)
  const initialLoadDone = useRef(false)
  const supabase = createClient()

  const fetchUser = useCallback(
    async (isBackground = false, forceRefresh = false) => {
      // Prevent rapid refetching
      const now = Date.now()
      if (isBackground && !forceRefresh && now - lastFetchTime < MIN_FETCH_INTERVAL) {
        return
      }
      lastFetchTime = now

      try {
        // Check cache first for immediate response
        const cachedUser = appCache.get<AuthUser>(CACHE_KEYS.USER_PROFILE)

        if (cachedUser && isBackground && !forceRefresh) {
          // Background refresh - check if we need to revalidate
          const cacheStatus = appCache.getWithStatus<AuthUser>(CACHE_KEYS.USER_PROFILE)
          if (!cacheStatus.needsRevalidation) {
            return // Cache is still fresh
          }
        }

        // If we have cached data, use it immediately (stale-while-revalidate)
        if (cachedUser && !mountedRef.current) {
          return
        }

        if (cachedUser && isBackground) {
          appCache.markRevalidating(CACHE_KEYS.USER_PROFILE)
        }

        if (forceRefresh) {
          try {
            await withTimeout(supabase.auth.refreshSession(), AUTH_TIMEOUT, {
              data: { session: null, user: null },
              error: null,
            })
          } catch {
            // Ignore refresh errors, continue with getSession
          }
        }

        const sessionResult = await withTimeout(supabase.auth.getSession(), AUTH_TIMEOUT, {
          data: { session: null },
          error: null,
        })

        if (!mountedRef.current) return

        if (!sessionResult.data.session) {
          appCache.delete(CACHE_KEYS.USER_PROFILE)
          setUser(null)
          setProfile(null)
          setLoading(false)
          setError(null)
          initialLoadDone.current = true
          appCache.clearRevalidating(CACHE_KEYS.USER_PROFILE)
          return
        }

        const authResult = await withTimeout(supabase.auth.getUser(), AUTH_TIMEOUT, {
          data: { user: null },
          error: new Error("Auth timeout"),
        })

        if (!mountedRef.current) return

        const {
          data: { user: authUser },
          error: authError,
        } = authResult

        if (authError || !authUser) {
          // Clear cache on auth error
          appCache.delete(CACHE_KEYS.USER_PROFILE)
          setUser(null)
          setProfile(null)
          if (!isBackground) setLoading(false)
          initialLoadDone.current = true
          appCache.clearRevalidating(CACHE_KEYS.USER_PROFILE)
          return
        }

        // Fetch profile with timeout
        const profileResult = await withTimeout(
          supabase.from("profiles").select("*").eq("id", authUser.id).single(),
          AUTH_TIMEOUT,
          { data: null, error: new Error("Profile fetch timeout") },
        )

        if (!mountedRef.current) return

        const { data: profileData, error: profileError } = profileResult

        const authUserData: AuthUser = {
          id: authUser.id,
          email: authUser.email ?? null,
          profile: profileError ? null : (profileData as Profile),
        }

        // Cache the user data with 8-second TTL and 24-second stale time
        appCache.set(CACHE_KEYS.USER_PROFILE, authUserData, CACHE_TTL.USER_PROFILE, STALE_TTL.USER_PROFILE)
        appCache.clearRevalidating(CACHE_KEYS.USER_PROFILE)

        setUser(authUserData)
        setProfile(authUserData.profile)
        setIsStale(false)
        setError(null)
      } catch (err: any) {
        if (!mountedRef.current) return
        setError(err.message || "Failed to fetch user")
        appCache.clearRevalidating(CACHE_KEYS.USER_PROFILE)
        if (!isBackground) {
          setUser(null)
          setProfile(null)
        }
      } finally {
        if (mountedRef.current) {
          setLoading(false)
          initialLoadDone.current = true
        }
      }
    },
    [supabase],
  )

  const refetch = useCallback(async () => {
    setLoading(true)
    await fetchUser(false)
  }, [fetchUser])

  // Initial load - try cache first for instant UI
  useEffect(() => {
    mountedRef.current = true
    initialLoadDone.current = false

    // Check cache immediately for instant data
    const cachedUser = appCache.get<AuthUser>(CACHE_KEYS.USER_PROFILE)
    if (cachedUser) {
      setUser(cachedUser)
      setProfile(cachedUser.profile)
      setLoading(false)
      initialLoadDone.current = true

      // Check if cache is stale
      const cacheStatus = appCache.getWithStatus<AuthUser>(CACHE_KEYS.USER_PROFILE)
      setIsStale(cacheStatus.isStale)

      // Revalidate in background if stale
      if (cacheStatus.needsRevalidation) {
        fetchUser(true)
      }
    } else {
      // No cache, fetch fresh
      fetchUser(false)

      const fallbackTimeout = setTimeout(() => {
        if (mountedRef.current && !initialLoadDone.current) {
          setLoading(false)
          initialLoadDone.current = true
        }
      }, AUTH_TIMEOUT + 500) // Slightly longer than auth timeout

      return () => {
        clearTimeout(fallbackTimeout)
        mountedRef.current = false
      }
    }

    return () => {
      mountedRef.current = false
    }
  }, [fetchUser])

  // Setup 8-second polling interval (shared across all useAuth instances)
  useEffect(() => {
    subscriberCount++

    if (!globalPollingInterval) {
      globalPollingInterval = setInterval(() => {
        // Background refresh every 8 seconds
        const cachedUser = appCache.get<AuthUser>(CACHE_KEYS.USER_PROFILE)
        if (cachedUser) {
          // Only refetch if there are active subscribers
          fetchUser(true)
        }
      }, 8000) // 8 second polling
    }

    return () => {
      subscriberCount--
      if (subscriberCount === 0 && globalPollingInterval) {
        clearInterval(globalPollingInterval)
        globalPollingInterval = null
      }
    }
  }, [fetchUser])

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        const now = Date.now()
        // Only refetch if enough time has passed since last visibility fetch
        if (now - lastVisibilityFetchTime > VISIBILITY_FETCH_INTERVAL) {
          lastVisibilityFetchTime = now
          // Force refresh session when returning to tab
          fetchUser(true, true)
        }
      }
    }

    const handleFocus = () => {
      const now = Date.now()
      if (now - lastVisibilityFetchTime > VISIBILITY_FETCH_INTERVAL) {
        lastVisibilityFetchTime = now
        fetchUser(true, true)
      }
    }

    const handleOnline = () => {
      // When network comes back, refresh the session
      fetchUser(true, true)
    }

    document.addEventListener("visibilitychange", handleVisibilityChange)
    window.addEventListener("focus", handleFocus)
    window.addEventListener("online", handleOnline)

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange)
      window.removeEventListener("focus", handleFocus)
      window.removeEventListener("online", handleOnline)
    }
  }, [fetchUser])

  // Listen to auth state changes
  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === "SIGNED_OUT") {
        appCache.delete(CACHE_KEYS.USER_PROFILE)
        setUser(null)
        setProfile(null)
      } else if (event === "SIGNED_IN" || event === "TOKEN_REFRESHED") {
        // Refetch on sign in or token refresh
        fetchUser(false)
      }
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [supabase, fetchUser])

  return {
    user,
    profile,
    loading,
    error,
    isStale,
    refetch,
  }
}

// Helper to get cached user synchronously (for immediate access)
export function getCachedUser(): AuthUser | null {
  return appCache.get<AuthUser>(CACHE_KEYS.USER_PROFILE)
}

// Helper to clear user cache (for logout)
export function clearUserCache(): void {
  appCache.delete(CACHE_KEYS.USER_PROFILE)
}
