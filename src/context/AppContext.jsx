import { createContext, useContext, useState, useCallback } from 'react'

const AppContext = createContext(null)

// Generate unique ID
const uid = () => crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).slice(2)

// Generate quote number: ANB-2026-001
const generateQuoteNumber = (count) => {
    const year = new Date().getFullYear()
    const num = String(count + 1).padStart(3, '0')
    return `ANB-${year}-${num}`
}

const DEFAULT_COMPANY = {
    name: '',
    address: '',
    city: '',
    zip: '',
    ustId: '',
    email: '',
    phone: '',
    bankIban: '',
    bankBic: '',
    bankName: '',
}

const DEFAULT_QUOTE = {
    id: '',
    quoteNumber: '',
    title: 'Neues Angebot',
    clientName: '',
    clientEmail: '',
    clientAddress: '',
    clientCity: '',
    clientZip: '',
    introText: 'vielen Dank für Ihr Interesse. Gerne unterbreiten wir Ihnen folgendes Angebot:',
    outroText: 'Wir freuen uns auf Ihre Rückmeldung und stehen für Rückfragen gerne zur Verfügung.',
    items: [],
    validDays: 30,
    taxRate: 19,
    status: 'draft', // draft, sent, accepted, rejected
    createdAt: '',
}

const STORAGE_KEY = 'aeo_app_data'

function loadData() {
    try {
        const raw = localStorage.getItem(STORAGE_KEY)
        if (raw) return JSON.parse(raw)
    } catch { }
    return { company: DEFAULT_COMPANY, quotes: [], monthlyUsage: {} }
}

function saveData(data) {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
    } catch { }
}

export function AppProvider({ children }) {
    const [data, setData] = useState(loadData)

    const updateData = useCallback((updater) => {
        setData(prev => {
            const next = typeof updater === 'function' ? updater(prev) : { ...prev, ...updater }
            saveData(next)
            return next
        })
    }, [])

    // Company
    const setCompany = useCallback((company) => {
        updateData(prev => ({ ...prev, company }))
    }, [updateData])

    // Quotes
    const createQuote = useCallback(() => {
        const newQuote = {
            ...DEFAULT_QUOTE,
            id: uid(),
            quoteNumber: generateQuoteNumber(data.quotes.length),
            createdAt: new Date().toISOString(),
            items: [
                { id: uid(), description: '', quantity: 1, unit: 'Stück', unitPrice: 0, position: 1 }
            ]
        }
        updateData(prev => ({ ...prev, quotes: [...prev.quotes, newQuote] }))
        return newQuote.id
    }, [data.quotes.length, updateData])

    const updateQuote = useCallback((id, updates) => {
        updateData(prev => ({
            ...prev,
            quotes: prev.quotes.map(q => q.id === id ? { ...q, ...updates } : q)
        }))
    }, [updateData])

    const deleteQuote = useCallback((id) => {
        updateData(prev => ({
            ...prev,
            quotes: prev.quotes.filter(q => q.id !== id)
        }))
    }, [updateData])

    // Items within a quote
    const addItem = useCallback((quoteId) => {
        updateData(prev => ({
            ...prev,
            quotes: prev.quotes.map(q => {
                if (q.id !== quoteId) return q
                const newItem = {
                    id: uid(),
                    description: '',
                    quantity: 1,
                    unit: 'Stück',
                    unitPrice: 0,
                    position: q.items.length + 1
                }
                return { ...q, items: [...q.items, newItem] }
            })
        }))
    }, [updateData])

    const updateItem = useCallback((quoteId, itemId, updates) => {
        updateData(prev => ({
            ...prev,
            quotes: prev.quotes.map(q => {
                if (q.id !== quoteId) return q
                return {
                    ...q,
                    items: q.items.map(item => item.id === itemId ? { ...item, ...updates } : item)
                }
            })
        }))
    }, [updateData])

    const removeItem = useCallback((quoteId, itemId) => {
        updateData(prev => ({
            ...prev,
            quotes: prev.quotes.map(q => {
                if (q.id !== quoteId) return q
                return {
                    ...q,
                    items: q.items.filter(item => item.id !== itemId).map((item, i) => ({ ...item, position: i + 1 }))
                }
            })
        }))
    }, [updateData])

    // Freemium gate
    const getMonthlyUsage = useCallback(() => {
        const month = new Date().toISOString().slice(0, 7) // '2026-03'
        return data.monthlyUsage?.[month] || 0
    }, [data.monthlyUsage])

    const incrementUsage = useCallback(() => {
        const month = new Date().toISOString().slice(0, 7)
        updateData(prev => ({
            ...prev,
            monthlyUsage: {
                ...prev.monthlyUsage,
                [month]: (prev.monthlyUsage?.[month] || 0) + 1
            }
        }))
    }, [updateData])

    const canCreateQuote = useCallback(() => {
        // Free tier: 1 per month
        return getMonthlyUsage() < 1
    }, [getMonthlyUsage])

    return (
        <AppContext.Provider value={{
            company: data.company,
            quotes: data.quotes,
            setCompany,
            createQuote,
            updateQuote,
            deleteQuote,
            addItem,
            updateItem,
            removeItem,
            getMonthlyUsage,
            incrementUsage,
            canCreateQuote,
        }}>
            {children}
        </AppContext.Provider>
    )
}

export function useApp() {
    const context = useContext(AppContext)
    if (!context) throw new Error('useApp must be used within AppProvider')
    return context
}
