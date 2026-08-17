import QRCode from 'qrcode'

export async function generateQRDataUrl(text: string): Promise<string> {
  return QRCode.toDataURL(text, {
    width: 280,
    margin: 2,
    color: { dark: '#131921', light: '#ffffff' },
  })
}
