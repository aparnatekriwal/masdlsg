import { PaymentMethod } from '../types'

export const paymentMethods: PaymentMethod[] = [
  { id: 'paynow', name: 'PayNow', subtitle: 'Instant. No card details needed.', enabled: true },
  { id: 'card', name: 'Credit or Debit Card', subtitle: 'Visa, Mastercard, Amex', enabled: false },
  { id: 'applepay', name: 'Apple Pay', subtitle: 'Pay with Face ID', enabled: false },
  { id: 'grabpay', name: 'GrabPay', subtitle: 'Use your GrabPay wallet', enabled: false },
  { id: 'shopeepay', name: 'ShopeePay', subtitle: 'Pay via ShopeePay', enabled: false },
  { id: 'nets', name: 'NETS', subtitle: 'Pay with NETS', enabled: false },
  { id: 'atome', name: 'Atome', subtitle: 'Pay in 3 interest-free instalments', enabled: false },
]
