export interface Product {
  id: string
  title: string
  subtitle: string
  price: number
  rating: number
  reviewCount: number
  category: string
  color: string
  icon: string
}

export interface CartItem {
  product: Product
  quantity: number
}

export interface BankApp {
  id: string
  name: string
  color: string
  textColor: string
  section: 'most-used' | 'other'
}

export interface PaymentMethod {
  id: string
  name: string
  subtitle: string
  enabled: boolean
}

export type Screen =
  | 'storefront'
  | 'product'
  | 'cart'
  | 'review'
  | 'payment'
  | 'bankSelect'
  | 'handover'
  | 'bankPayment'
  | 'bankSuccess'
  | 'confirmation'
  | 'notificationOverlay'

export type PaymentVariant = 'choose-each-time' | 'remembered-app' | 'no-handover'

export type FailureMode =
  | 'none'
  | 'app-not-installed'
  | 'approval-timeout'
  | 'merchant-no-update'
  | 'insufficient-balance'

export interface SessionEvent {
  screen: string
  action: string
  timestamp: number
}

export interface AppState {
  screen: Screen
  screenStack: Screen[]
  selectedProduct: Product | null
  cart: CartItem[]
  selectedBank: BankApp | null
  rememberedBank: BankApp | null
  selectedAccount: number
  pinDigits: string
  variant: PaymentVariant
  failureMode: FailureMode
  sessionEvents: SessionEvent[]
  checkoutStartTime: number | null
  orderNumber: string
  orderTimestamp: string
  orderTotal: number
  showControlPanel: boolean
  toastMessage: string | null
  demoTapCount: number
}
