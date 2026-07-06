import { createContext, useState, useEffect, useCallback, useContext } from 'react'

const STORAGE_KEY = 'admin-sidebar-collapsed'
const MOBILE_BREAKPOINT = 768

const SidebarContext = createContext(null)

export function SidebarProvider({ children }) {
    const [collapsed, setCollapsed] = useState(() => {
        try {
            return JSON.parse(localStorage.getItem(STORAGE_KEY)) ?? false
        } catch {
            return false
        }
    })

    const [mobileOpen, setMobileOpen] = useState(false)
    const [isMobile, setIsMobile] = useState(
        () => window.innerWidth < MOBILE_BREAKPOINT
    )

    // Track viewport size
    useEffect(() => {
        const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`)
        const handler = (e) => {
            setIsMobile(e.matches)
            if (!e.matches) setMobileOpen(false)
        }
        mql.addEventListener('change', handler)
        return () => mql.removeEventListener('change', handler)
    }, [])

    // Persist collapsed state
    useEffect(() => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(collapsed))
    }, [collapsed])

    // Lock body scroll when mobile drawer is open
    useEffect(() => {
        document.body.style.overflow = mobileOpen ? 'hidden' : ''
        return () => { document.body.style.overflow = '' }
    }, [mobileOpen])

    const toggleCollapsed = useCallback(() => setCollapsed(prev => !prev), [])
    const toggleMobile = useCallback(() => setMobileOpen(prev => !prev), [])
    const closeMobile = useCallback(() => setMobileOpen(false), [])

    return (
        <SidebarContext.Provider
            value={{
                collapsed,
                setCollapsed,
                toggleCollapsed,
                mobileOpen,
                toggleMobile,
                closeMobile,
                isMobile,
            }}
        >
            {children}
        </SidebarContext.Provider>
    )
}

export function useSidebar() {
    const ctx = useContext(SidebarContext)
    if (!ctx) throw new Error('useSidebar must be used within SidebarProvider')
    return ctx
}
