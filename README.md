# 魁星 Mini Program Shell

A thin native shell that loads [kuixing.cloud](https://kuixing.cloud) inside a cross-platform webview.

## Platforms

| Platform | Command |
|---|---|
| H5 (web) | `npm run dev:h5` |
| WeChat Mini Program | `npm run dev:mp-weixin` |
| Android / iOS App | `npm run dev:app` |

## Quick Start

```bash
npm install
npm run dev:h5
```

## Project Structure

```
├── App.vue                  # Root component — reads agentId on launch
├── main.js                  # SSR-compatible entry point
├── pages.json               # Page routes & navigation config
├── manifest.json            # Platform-specific settings
├── uni.scss                 # Global design tokens
├── components/
│   └── FeatureCard.vue      # Reusable icon + label card
├── pages/
│   ├── splash/splash.vue    # Animated splash (3 s → home)
│   ├── home/home.vue        # Feature grid + CTA
│   └── webview/webview.vue  # Full-screen webview → kuixing.cloud
├── utils/
│   └── agent.js             # AgentId persistence & URL builder
└── static/                  # Static assets (icons, images)
```

## Agent ID Flow

When the app is launched via a QR code containing an `agentId`, the ID is:

1. Parsed from the scene / query parameters in `App.vue`
2. Stored in memory + `uni.setStorageSync`
3. Appended to the webview URL as `?agentId=XXXX`

## WebView ↔ Native Communication

The embedded web page can send messages via `uni.postMessage`. Supported message types:

| type | payload | behaviour |
|---|---|---|
| `saveImage` | `{ url: '...' }` | Downloads the image and saves to the device photo album |
