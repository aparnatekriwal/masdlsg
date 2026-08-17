# PayNow Deep-Link Prototype

A clickable mobile-first prototype demonstrating PayNow deep-linking for Singapore online checkout. Built as stimulus for consumer focus groups.

**No real payments are processed. No data leaves the device. All state is in-memory only.**

## Quick Start

```bash
# Install dependencies
npm install        # or: bun install

# Run dev server (accessible from phones on the same network)
npm run dev -- --host
# or: bun run dev --host

# Build for production
npm run build      # or: bun run build

# Preview production build
npm run preview    # or: bun run preview
```

## Deploy

### Vercel

```bash
npx vercel --prod
```

### Netlify

```bash
npx netlify deploy --prod --dir=dist
```

### GitHub Pages

Push the `dist/` folder contents to a `gh-pages` branch, or use:

```bash
npx gh-pages -d dist
```

## Live URL

> **Placeholder**: Replace with your deployed URL after first deploy.
>
> `https://your-prototype.vercel.app`

Display the QR code below on a room screen so participants can open the prototype on their own phones.

![QR Code](https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=https://your-prototype.vercel.app)

*(Update the URL in the image source above after deployment.)*

## What It Does

Participants open the URL on their own phone (iPhone Safari or Android Chrome) and walk through a simulated e-commerce checkout with PayNow deep-linking:

1. **Storefront** - Browse 10 office-humour products
2. **Product detail** - Add items to cart
3. **Cart** - Review items, see delivery fee logic (free above SGD 60)
4. **Review order** - Confirm address, delivery, and order summary
5. **Payment** - PayNow is pre-selected; other methods show "Not part of this demo"
6. **Bank app selector** - Choose from 10 Singapore banking apps
7. **Bank handover** - Full-screen transition simulating leaving the shop
8. **Bank payment** - Pre-filled payment details, account selector
9. **PIN / Face ID** - On-screen 6-digit keypad or Face ID option
10. **Bank success** - Confirmation with auto-return to merchant
11. **Order confirmed** - Paid order with delivery date and receipt

### Three Payment Variants

Switchable from the hidden control panel:

| Variant | Behaviour |
|---------|-----------|
| **App chosen each time** | User picks a bank app on every checkout |
| **App remembered** | Bank selector is skipped after first use |
| **No handover** | Payment approved via notification overlay without leaving the merchant page |

### Four Failure Modes

Also configurable from the control panel:

- Bank app not installed
- Approval times out (8 seconds)
- Payment succeeds but merchant page does not update
- Insufficient balance

## Hidden Control Panel

Access on a phone (no keyboard needed):
- **Long-press** the header bar for 2 seconds, OR
- **Tap the "DEMO" badge** 5 times quickly

On desktop: press the **D** key.

The panel shows:
- Step counter and elapsed timer from checkout start
- Variant selector (3 options)
- Failure mode selector (5 options)
- Export session as JSON
- Reset to storefront

## Technical Details

- **Stack**: React 19 + Vite + Tailwind CSS 3 + TypeScript
- **Runtime**: No backend, no database, no API calls, no CDN dependencies
- **State**: All in-memory (no localStorage/sessionStorage)
- **Fonts**: System font stack only (no external font requests)
- **Icons**: All inline SVG (no image files)
- **Bundle size**: ~85 KB gzipped (HTML + CSS + JS)
- **Offline**: Works fully after first load

## Mobile Optimisations

- `viewport-fit=cover` with safe-area-inset padding
- `100dvh` for full-height layouts (handles iOS Safari collapsing address bar)
- `touch-action: manipulation` (no double-tap zoom)
- `overscroll-behavior: none` (no pull-to-refresh)
- Minimum 44px tap targets throughout
- No hover-dependent interactions
- No system keyboard required (custom PIN pad)
- Web app manifest for home-screen install

## Desktop Behaviour

On desktop viewports, the app shows a single screen with a QR code and "Open this on your phone."

## Device Testing

> **Fill in after testing:**
>
> | Device | OS | Browser | Status |
> |--------|----|---------|--------|
> | iPhone XX | iOS XX | Safari | Pending |
> | Android XX | Android XX | Chrome | Pending |

## Constraints

- No real bank logos, scheme marks, or retailer trademarks
- No real UENs or account numbers
- "DEMO" badge visible on every screen
- No data persistence — refresh clears everything
- No network requests after initial page load
