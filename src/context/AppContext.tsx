import React, { createContext, useContext, useReducer, useCallback, type ReactNode } from 'react'
import type { AppState, Screen, Product, CartItem, BankApp, PaymentVariant, FailureMode, SessionEvent } from '../types'

function generateOrderNumber(): string {
  return 'ORD-' + Math.random().toString(36).substring(2, 8).toUpperCase()
}

function formatTimestamp(): string {
  const now = new Date()
  return now.toLocaleString('en-SG', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  })
}

const initialState: AppState = {
  screen: 'storefront',
  screenStack: [],
  selectedProduct: null,
  cart: [],
  selectedBank: null,
  rememberedBank: null,
  selectedAccount: 0,
  pinDigits: '',
  variant: 'choose-each-time',
  failureMode: 'none',
  sessionEvents: [],
  checkoutStartTime: null,
  orderNumber: '',
  orderTimestamp: '',
  orderTotal: 0,
  showControlPanel: false,
  toastMessage: null,
  demoTapCount: 0,
}

type Action =
  | { type: 'NAVIGATE'; screen: Screen }
  | { type: 'GO_BACK' }
  | { type: 'SELECT_PRODUCT'; product: Product }
  | { type: 'ADD_TO_CART'; product: Product; quantity: number }
  | { type: 'UPDATE_QUANTITY'; productId: string; quantity: number }
  | { type: 'REMOVE_FROM_CART'; productId: string }
  | { type: 'CLEAR_CART' }
  | { type: 'SELECT_BANK'; bank: BankApp }
  | { type: 'REMEMBER_BANK'; bank: BankApp }
  | { type: 'SELECT_ACCOUNT'; index: number }
  | { type: 'SET_PIN_DIGITS'; digits: string }
  | { type: 'SET_VARIANT'; variant: PaymentVariant }
  | { type: 'SET_FAILURE_MODE'; mode: FailureMode }
  | { type: 'LOG_EVENT'; event: SessionEvent }
  | { type: 'START_CHECKOUT' }
  | { type: 'COMPLETE_ORDER' }
  | { type: 'TOGGLE_CONTROL_PANEL' }
  | { type: 'HIDE_CONTROL_PANEL' }
  | { type: 'SHOW_TOAST'; message: string }
  | { type: 'HIDE_TOAST' }
  | { type: 'INCREMENT_DEMO_TAP' }
  | { type: 'RESET_DEMO_TAPS' }
  | { type: 'RESET' }

function reducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case 'NAVIGATE':
      return {
        ...state,
        screen: action.screen,
        screenStack: [...state.screenStack, state.screen],
      }
    case 'GO_BACK': {
      const stack = [...state.screenStack]
      const prev = stack.pop() || 'storefront'
      return { ...state, screen: prev, screenStack: stack }
    }
    case 'SELECT_PRODUCT':
      return { ...state, selectedProduct: action.product }
    case 'ADD_TO_CART': {
      const existing = state.cart.find(i => i.product.id === action.product.id)
      if (existing) {
        return {
          ...state,
          cart: state.cart.map(i =>
            i.product.id === action.product.id
              ? { ...i, quantity: i.quantity + action.quantity }
              : i
          ),
        }
      }
      return {
        ...state,
        cart: [...state.cart, { product: action.product, quantity: action.quantity }],
      }
    }
    case 'UPDATE_QUANTITY':
      return {
        ...state,
        cart: state.cart
          .map(i => (i.product.id === action.productId ? { ...i, quantity: action.quantity } : i))
          .filter(i => i.quantity > 0),
      }
    case 'REMOVE_FROM_CART':
      return {
        ...state,
        cart: state.cart.filter(i => i.product.id !== action.productId),
      }
    case 'CLEAR_CART':
      return { ...state, cart: [] }
    case 'SELECT_BANK':
      return { ...state, selectedBank: action.bank }
    case 'REMEMBER_BANK':
      return { ...state, rememberedBank: action.bank }
    case 'SELECT_ACCOUNT':
      return { ...state, selectedAccount: action.index }
    case 'SET_PIN_DIGITS':
      return { ...state, pinDigits: action.digits }
    case 'SET_VARIANT':
      return { ...state, variant: action.variant }
    case 'SET_FAILURE_MODE':
      return { ...state, failureMode: action.mode }
    case 'LOG_EVENT':
      return { ...state, sessionEvents: [...state.sessionEvents, action.event] }
    case 'START_CHECKOUT':
      return { ...state, checkoutStartTime: Date.now() }
    case 'COMPLETE_ORDER': {
      if (state.cart.length === 0 && state.orderTotal > 0) {
        return state
      }
      const subtotal = state.cart.reduce((s, i) => s + i.product.price * i.quantity, 0)
      const delivery = subtotal >= 60 ? 0 : 3.90
      return {
        ...state,
        orderNumber: state.orderNumber || generateOrderNumber(),
        orderTimestamp: state.orderTimestamp || formatTimestamp(),
        orderTotal: subtotal + delivery,
        cart: [],
      }
    }
    case 'TOGGLE_CONTROL_PANEL':
      return { ...state, showControlPanel: !state.showControlPanel }
    case 'HIDE_CONTROL_PANEL':
      return { ...state, showControlPanel: false }
    case 'SHOW_TOAST':
      return { ...state, toastMessage: action.message }
    case 'HIDE_TOAST':
      return { ...state, toastMessage: null }
    case 'INCREMENT_DEMO_TAP':
      return { ...state, demoTapCount: state.demoTapCount + 1 }
    case 'RESET_DEMO_TAPS':
      return { ...state, demoTapCount: 0 }
    case 'RESET':
      return { ...initialState, variant: state.variant, failureMode: state.failureMode }
    default:
      return state
  }
}

interface AppContextType {
  state: AppState
  dispatch: React.Dispatch<Action>
  navigate: (screen: Screen) => void
  goBack: () => void
  addToCart: (product: Product, quantity: number) => void
  getCartTotal: () => number
  getCartCount: () => number
  getDeliveryFee: () => number
  getOrderTotal: () => number
  logEvent: (screen: string, action: string) => void
}

const AppContext = createContext<AppContextType | null>(null)

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState)

  const navigate = useCallback((screen: Screen) => {
    dispatch({ type: 'NAVIGATE', screen })
    dispatch({ type: 'LOG_EVENT', event: { screen, action: 'navigate', timestamp: Date.now() } })
  }, [])

  const goBack = useCallback(() => {
    dispatch({ type: 'GO_BACK' })
  }, [])

  const addToCart = useCallback((product: Product, quantity: number) => {
    dispatch({ type: 'ADD_TO_CART', product, quantity })
    dispatch({ type: 'LOG_EVENT', event: { screen: 'cart', action: `add:${product.id}:${quantity}`, timestamp: Date.now() } })
  }, [])

  const getCartTotal = useCallback(() => {
    return state.cart.reduce((sum: number, item: CartItem) => sum + item.product.price * item.quantity, 0)
  }, [state.cart])

  const getCartCount = useCallback(() => {
    return state.cart.reduce((sum: number, item: CartItem) => sum + item.quantity, 0)
  }, [state.cart])

  const getDeliveryFee = useCallback(() => {
    const subtotal = state.cart.reduce((sum: number, item: CartItem) => sum + item.product.price * item.quantity, 0)
    return subtotal >= 60 ? 0 : 3.90
  }, [state.cart])

  const getOrderTotal = useCallback(() => {
    const subtotal = state.cart.reduce((sum: number, item: CartItem) => sum + item.product.price * item.quantity, 0)
    const delivery = subtotal >= 60 ? 0 : 3.90
    return subtotal + delivery
  }, [state.cart])

  const logEvent = useCallback((screen: string, action: string) => {
    dispatch({ type: 'LOG_EVENT', event: { screen, action, timestamp: Date.now() } })
  }, [])

  return (
    <AppContext.Provider
      value={{ state, dispatch, navigate, goBack, addToCart, getCartTotal, getCartCount, getDeliveryFee, getOrderTotal, logEvent }}
    >
      {children}
    </AppContext.Provider>
  )
}

export function useApp() {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useApp must be used within AppProvider')
  return ctx
}
