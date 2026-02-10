# Debug: Redirect to Login When Clicking "Post a Task"

The redirect to `/login?next=/tasks/new` is done by **Next.js proxy** (`proxy.ts`), not by the API. The proxy treats you as unauthenticated when you try to open `/tasks/new`.

**Fix applied:** "Post a task" links now use `prefetch={false}` so the first request to `/tasks/new` happens on click (with cookies), avoiding a prefetched response that was cached without the auth cookie.

---

## 1. Confirm where the redirect comes from

- **URL is `/login?next=/tasks/new`** → Redirect is from **proxy** (middleware). It only checks for an auth cookie; it does **not** call your API.
- **URL is `/auth/login`** (no `next`)** → Redirect is from **API client** after a 401 and failed refresh (`lib/auth/session.ts` → `handleAuthError`).

Your case is the first one, so focus on **cookies and proxy**.

---

## 2. Check the cookie the proxy uses

The proxy considers you logged in only if one of these cookies is present:

- `extrahand_auth` with value `"1"`
- `__session` (any value)
- `idToken` (any value)

**Steps:**

1. Open DevTools → **Application** (Chrome) or **Storage** (Firefox).
2. Go to **Cookies** → select `https://extrahand.in` (or your app origin).
3. **Right after login (before clicking “Post a task”):**
   - Do you see `extrahand_auth` with value `1`?
   - Note **Domain** and **Path** (e.g. `Path=/`, Domain empty or your domain).

If `extrahand_auth=1` is **missing** after login, the store’s `login()` is either not run or not setting the cookie in time.  
If it **is** present, the next step is to see if it’s sent when you go to `/tasks/new`.

---

## 3. Check if the cookie is sent when opening “Post a task”

1. DevTools → **Network**.
2. Clear the list, then click **“Post a Task”** (so you get redirected to `/login?next=/tasks/new`).
3. In the list, find the request that goes to **`/tasks/new`** (or the RSC/route request that leads to the redirect). Click it.
4. Open **Headers** → **Request Headers**.
5. Look at the **Cookie** header.

**What to note:**

- Is **`extrahand_auth=1`** (or `extrahand_auth=...`) present in the Cookie header for that request?
  - **No** → Cookie is not sent (domain/path/SameSite or timing).
  - **Yes** → Proxy should see it; we need to check proxy logic or deployment (e.g. edge vs node).

Write down: “Cookie header for /tasks/new request: present / absent” and, if present, the exact cookie names you see.

---

## 4. Check when `extrahand_auth` is set

1. DevTools → **Application** → **Cookies**.
2. **Before** submitting OTP: note if `extrahand_auth` exists (and its value).
3. Submit OTP and wait for “Welcome back” / redirect to home.
4. **Immediately** check **Cookies** again (without refreshing).

**What to note:**

- Is `extrahand_auth` set **right after** OTP success (before you click anything)?
- If it appears only **after** a full page refresh, then it’s set on a later run (e.g. hydrate/restore), not right after login.

---

## 5. Optional: log in the proxy

In `proxy.ts`, temporarily add a log so you can see what the proxy sees on the server:

```ts
function checkAuthenticated(req: NextRequest): boolean {
   const authCookie = req.cookies.get("extrahand_auth")?.value;
   const sessionCookie = req.cookies.get("__session")?.value;
   const idTokenCookie = req.cookies.get("idToken")?.value;

   // DEBUG: remove after fixing
   console.log("[proxy] checkAuthenticated", {
      pathname: req.nextUrl.pathname,
      extrahand_auth: authCookie ?? "(missing)",
      hasSession: Boolean(sessionCookie),
      hasIdToken: Boolean(idTokenCookie),
      result: authCookie === "1" || Boolean(sessionCookie) || Boolean(idTokenCookie),
   });

   return (
      authCookie === "1" || Boolean(sessionCookie) || Boolean(idTokenCookie)
   );
}
```

Redeploy or run locally, reproduce the flow (login → click “Post a task”), then check **server logs** for the request to `/tasks/new`. Note what `extrahand_auth` and `result` are.

---

## 6. Summary to report back

Please share:

1. **After login, before clicking “Post a task”:** Is `extrahand_auth=1` present in Application → Cookies? (Yes/No)
2. **Request to `/tasks/new` (the one that leads to redirect):** In Request Headers, is `extrahand_auth` (or `extrahand_auth=1`) present in the Cookie header? (Yes/No)
3. **When does `extrahand_auth` appear?** Right after OTP success, or only after a full page refresh?
4. **(If you added the log)** For the `/tasks/new` request, what does the proxy log show for `extrahand_auth` and `result`?

With that, we can tell whether the fix is: setting `extrahand_auth` earlier/always after login, fixing cookie domain/path, or adjusting the proxy.
