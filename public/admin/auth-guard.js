/**
 * Auth guard for Decap CMS.
 * Intercepts CMS initialization and checks GitHub OAuth user against authorized list.
 */

function initAuthGuard() {
  const AUTHORIZED_USERS = ["59n"];

  // Hook into CMS initialization to check auth before UI loads
  if (window.CMS_MANUAL_INIT) {
    // Wrap the original init call to check auth first
    const originalInit = window.CMS?.init;

    if (originalInit) {
      window.CMS.init = function (config) {
        console.log("[AuthGuard] Intercepting CMS.init() to check authorization");

        // Call the original init
        const result = originalInit.call(this, config);

        // After CMS initializes, check the auth backend
        checkAuthBackend();

        return result;
      };
    }
  }

  async function checkAuthBackend() {
    try {
      console.log("[AuthGuard] Checking GitHub backend for authenticated user...");

      // The GitHub backend in Decap CMS has an auth method we can call
      // Get the backend instance from CMS after init
      if (!window.CMS) {
        console.log("[AuthGuard] CMS not available yet");
        setTimeout(checkAuthBackend, 500);
        return;
      }

      // Try to get auth status from the CMS backend
      // This is hacky but Decap CMS doesn't expose auth state well
      const backendCheck = await checkGitHubAuth();

      if (!backendCheck.authenticated) {
        console.log(
          "[AuthGuard] User not authenticated yet, waiting for GitHub OAuth..."
        );
        // Keep checking until user logs in or gives up
        setTimeout(checkAuthBackend, 1000);
        return;
      }

      const username = backendCheck.username;

      if (!AUTHORIZED_USERS.includes(username)) {
        // Unauthorized user
        console.warn(
          `[AuthGuard] User "${username}" is not authorized to access this CMS.`
        );
        blockUnauthorizedUser(username);
        return;
      }

      console.log(
        `[AuthGuard] User "${username}" is authorized. Access granted.`
      );
    } catch (error) {
      console.error("[AuthGuard] Error checking auth backend:", error);
      // Retry on error
      setTimeout(checkAuthBackend, 1000);
    }
  }

  async function checkGitHubAuth() {
    try {
      // Check if user has authenticated by looking for GitHub-specific storage
      // or by checking the CMS's internal state

      // Decap CMS with GitHub backend stores a session in IndexedDB or localStorage
      // Look for common keys
      const keys = [
        "github_access_token",
        "netlify_gotrue_access_token",
        "decap_cms_github_auth",
      ];

      for (const key of keys) {
        const stored = localStorage.getItem(key);
        if (stored) {
          console.log(
            `[AuthGuard] Found stored auth in localStorage["${key}"]`
          );
          try {
            const auth = JSON.parse(stored);
            if (auth && auth.access_token) {
              // Verify the token with GitHub API
              const userResp = await fetch("https://api.github.com/user", {
                headers: {
                  Authorization: `token ${auth.access_token}`,
                  Accept: "application/vnd.github.v3+json",
                },
              });

              if (userResp.ok) {
                const user = await userResp.json();
                return {
                  authenticated: true,
                  username: user.login,
                };
              }
            }
          } catch (e) {
            // Ignore parse errors, continue checking other keys
          }
        }
      }

      // Also check IndexedDB (where Decap CMS might store auth)
      return new Promise((resolve) => {
        const request = indexedDB.open("decap_cms");
        request.onsuccess = (event) => {
          try {
            const db = event.target.result;
            const stores = Array.from(db.objectStoreNames);
            console.log("[AuthGuard] IndexedDB stores:", stores);

            // Try to find auth data in IndexedDB
            // This is very implementation-specific, so we'll keep it simple
            resolve({ authenticated: false });
          } catch (e) {
            resolve({ authenticated: false });
          }
        };

        request.onerror = () => {
          resolve({ authenticated: false });
        };

        // Timeout to prevent hanging
        setTimeout(() => resolve({ authenticated: false }), 2000);
      });
    } catch (error) {
      console.error("[AuthGuard] Error checking GitHub auth:", error);
      return { authenticated: false };
    }
  }

  function blockUnauthorizedUser(username) {
    console.warn(`[AuthGuard] Blocking unauthorized user: "${username}"`);

    // Clear all auth data
    localStorage.clear();
    sessionStorage.clear();

    // Show blocking message
    const blocker = document.createElement("div");
    blocker.id = "auth-blocker";
    blocker.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.95);
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      z-index: 99999;
      color: white;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
    `;

    blocker.innerHTML = `
      <div style="text-align: center; max-width: 500px; padding: 2rem;">
        <h1 style="margin: 0 0 1rem 0; font-size: 2rem; color: #ff6b6b;">
          🚫 Access Denied
        </h1>
        <p style="margin: 0 0 1rem 0; font-size: 1.2rem; line-height: 1.6;">
          User <strong>"${username}"</strong> is not authorized to access this CMS.
        </p>
        <p style="margin: 0 0 2rem 0; opacity: 0.8; font-size: 1rem;">
          Please log in with an authorized GitHub account (59n).
        </p>
        <button onclick="location.href='/admin/'" style="
          padding: 0.75rem 1.5rem;
          background: #007bff;
          color: white;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          font-size: 1rem;
          transition: background 0.2s;
        " onhover="this.style.background='#0056b3'">
          Sign In With Different Account
        </button>
      </div>
    `;

    document.body.innerHTML = ""; // Clear the page
    document.body.appendChild(blocker);
    document.body.style.margin = "0";
    document.body.style.padding = "0";
  }

  // Start checking auth
  console.log("[AuthGuard] Initializing auth guard...");
  checkAuthBackend();
}

// Run auth guard as soon as script loads
initAuthGuard();



