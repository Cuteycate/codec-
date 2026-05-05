# Mobile Fueling App (MVP Scaffold)

## Prerequisites
- Node.js 20+
- npm 10+
- Expo Go app on your phone (optional) or Android/iOS simulator

## Install
```bash
npm install
```

## Run (recommended)
```bash
npm run start
```
Then in the Expo terminal:
- press `w` to open web
- press `a` for Android emulator
- press `i` for iOS simulator (macOS only)
- or scan the QR code with Expo Go

## Other scripts
```bash
npm run web
npm run android
npm run ios
npm run typecheck
```

## Current behavior
- You can create a fuel session with station/pump/limit values.
- You can tap **Advance Session** to move state from `CREATED` to `CLOSED`.

## Next backend integration
A starter API client is provided at `src/services/api.ts` for:
- `POST /v1/fuel-sessions`
- `POST /v1/fuel-sessions/{sessionId}/enable-pump`
- `POST /v1/fuel-sessions/{sessionId}/finalize`

By default, the app still uses local in-memory flow (`FuelSessionService`) until backend endpoints are wired.

## Troubleshooting: `npm install` gets HTTP 403
If you see `403 Forbidden - GET https://registry.npmjs.org/...` in this environment, the container network policy is blocking registry downloads.

Use one of these options:
1. Run the same repo on a machine/network with npm registry access.
2. Ask your admin for an allowed internal npm registry URL and then run:
   ```bash
   npm config set registry <YOUR_INTERNAL_REGISTRY>
   npm install
   ```


## 403 Forbidden: practical fix checklist
Run this first:
```bash
./scripts_check_npm_access.sh
```

Then apply in order:
1. **Use your company registry** (most common in locked environments):
   ```bash
   npm config set registry <INTERNAL_REGISTRY_URL>
   npm ping
   npm install
   ```
2. **Authenticate to that registry** (if required):
   ```bash
   npm login --registry <INTERNAL_REGISTRY_URL>
   npm install
   ```
3. **Set proxy credentials** if your proxy blocks anonymous outbound requests:
   ```bash
   npm config set proxy http://<user>:<pass>@<host>:<port>
   npm config set https-proxy http://<user>:<pass>@<host>:<port>
   npm install
   ```
4. **Verify no stale project/user `.npmrc` overrides**:
   ```bash
   npm config list
   ```

If `npm ping` still returns `403` after step 1-3, access is being denied by your network policy and must be opened by your admin.
