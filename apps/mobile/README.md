# Mobile App Notes

This Expo app talks to the FastAPI backend, not directly to Supabase.

## API Connection

The mobile app resolves its API base URL in this order:

1. Platform-specific override:
   - `EXPO_PUBLIC_API_URL_ANDROID`
   - `EXPO_PUBLIC_API_URL_IOS`
   - `EXPO_PUBLIC_API_URL_WEB`
2. `EXPO_PUBLIC_API_URL`
3. The Expo dev host, rewritten to `http://<your-machine-ip>:8000`
4. Fallback: `http://127.0.0.1:8000`

That means:

- iOS simulator on the same Mac can often use `127.0.0.1:8000`
- Android emulator usually needs `10.0.2.2:8000`
- A physical phone needs your computer's LAN IP, for example `http://192.168.1.25:8000`

## Recommended Local Setup

Create `apps/mobile/.env`:

```bash
EXPO_PUBLIC_API_URL_ANDROID=http://10.0.2.2:8000
EXPO_PUBLIC_API_URL_WEB=http://localhost:8000
```

For a physical phone, use your machine's LAN IP instead, for example:

```bash
EXPO_PUBLIC_API_URL=http://192.168.1.25:8000
```

Then start the backend so it is reachable from your device:

```bash
cd apps/api
uv run fastapi dev app/main.py --host 0.0.0.0 --port 8000
```

Or run your existing API workflow, as long as it listens on `0.0.0.0:8000` during device testing.

## Start Mobile

```bash
cd apps/mobile
pnpm dev
```

If you change `EXPO_PUBLIC_API_URL`, restart Expo so the new public env var is picked up.

## If You Still See Fallback Data

Check these in order:

1. Open `http://<your-api-host>:8000/health/` from the phone browser.
2. Confirm the phone and laptop are on the same network.
3. Confirm the API process is bound to `0.0.0.0`, not only `127.0.0.1`.
4. Restart Expo after editing `.env`.
5. If Android emulator is in use, try `EXPO_PUBLIC_API_URL_ANDROID=http://10.0.2.2:8000`.
6. If Expo web is in use, try `EXPO_PUBLIC_API_URL_WEB=http://localhost:8000`.
