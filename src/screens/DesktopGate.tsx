import { useState, useEffect } from 'react'
import { generateQRDataUrl } from '../utils/qrcode'

const PUBLIC_URL_OVERRIDE = import.meta.env.VITE_PUBLIC_URL as string | undefined

function isLocalDev(): boolean {
  const h = window.location.hostname
  return h === 'localhost' || h === '127.0.0.1'
}

export default function DesktopGate() {
  const [qrUrl, setQrUrl] = useState<string>('')
  const [displayUrl, setDisplayUrl] = useState<string>('')

  useEffect(() => {
    if (PUBLIC_URL_OVERRIDE) {
      const normalized = PUBLIC_URL_OVERRIDE.endsWith('/')
        ? PUBLIC_URL_OVERRIDE
        : PUBLIC_URL_OVERRIDE + '/'
      setDisplayUrl(normalized)
      generateQRDataUrl(normalized).then(setQrUrl)
      return
    }

    generateQRDataUrl(window.location.href).then(setQrUrl)

    if (isLocalDev()) {
      const port = window.location.port || '5173'
      detectLanIp().then(ip => {
        if (ip) {
          const lanUrl = `http://${ip}:${port}/`
          setDisplayUrl(lanUrl)
          generateQRDataUrl(lanUrl).then(setQrUrl)
        }
      })
    } else {
      setDisplayUrl(window.location.href)
    }
  }, [])

  return (
    <div className="h-screen-dvh bg-navy flex flex-col items-center justify-center text-center p-8">
      <div className="text-amazon-yellow font-bold text-3xl mb-2 tracking-tight">ShopMart</div>
      <p className="text-gray-400 text-sm mb-8">PayNow Deep-Link Prototype</p>

      <div className="bg-white p-6 rounded-2xl shadow-2xl mb-6">
        {qrUrl ? (
          <img src={qrUrl} alt="QR code" className="w-64 h-64" />
        ) : (
          <div className="w-64 h-64 bg-gray-100 rounded animate-pulse" />
        )}
      </div>

      <p className="text-white text-xl font-medium mb-2">Open this on your phone.</p>

      <div className="bg-navy-light rounded-xl p-4 mb-4 max-w-md">
        {displayUrl ? (
          <>
            <p className="text-gray-300 text-sm mb-2">
              {PUBLIC_URL_OVERRIDE
                ? 'Scan the QR code or open this URL on your phone:'
                : 'Your phone must be on the same Wi-Fi network.'}
            </p>
            <p className="text-amazon-yellow font-mono text-base break-all select-all">
              {displayUrl}
            </p>
          </>
        ) : (
          <p className="text-gray-300 text-sm">
            Make sure your phone is on the same Wi-Fi network, then scan the QR code or type your computer's IP address with port 5173 in your phone browser.
          </p>
        )}
      </div>

      <div className="mt-8 text-gray-600 text-xs">
        <span className="bg-red-600 text-white text-[10px] font-bold px-2 py-0.5 rounded mr-2">DEMO</span>
        No real payments. Stimulus for consumer focus groups only.
      </div>
    </div>
  )
}

async function detectLanIp(): Promise<string | null> {
  try {
    const pc = new RTCPeerConnection({ iceServers: [] })
    pc.createDataChannel('')
    const offer = await pc.createOffer()
    await pc.setLocalDescription(offer)

    return new Promise((resolve) => {
      const timeout = setTimeout(() => {
        pc.close()
        resolve(null)
      }, 3000)

      pc.onicecandidate = (e) => {
        if (!e.candidate) return
        const match = e.candidate.candidate.match(/(\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3})/)
        if (match && !match[1].startsWith('0.') && match[1] !== '0.0.0.0') {
          clearTimeout(timeout)
          pc.close()
          resolve(match[1])
        }
      }
    })
  } catch {
    return null
  }
}
