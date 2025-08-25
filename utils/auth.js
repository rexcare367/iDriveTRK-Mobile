import { auth } from "../firebase/config";

let tokenRefreshPromise = null;

export async function getAuthToken(forceRefresh = false) {
  try {
    const user = auth.currentUser;
    if (!user) return null;

    if (tokenRefreshPromise && !forceRefresh) {
      return tokenRefreshPromise;
    }

    const token = await user.getIdToken(forceRefresh);
    return token;
  } catch (error) {
    console.error("Error getting auth token:", error);
    return null;
  }
}

export async function refreshToken() {
  try {
    const user = auth.currentUser;
    if (!user) return null;

    tokenRefreshPromise = user.getIdToken(true);
    const token = await tokenRefreshPromise;
    tokenRefreshPromise = null;
    return token;
  } catch (error) {
    console.error("Error refreshing token:", error);
    tokenRefreshPromise = null;
    return null;
  }
}

export function isTokenExpired(token) {
  try {
    const [, payload] = token.split(".");
    const decodedPayload = JSON.parse(atob(payload));
    return decodedPayload.exp < Math.floor(Date.now() / 1000);
  } catch {
    return true;
  }
}

export function decodeToken(token) {
  try {
    const [, payload] = token.split(".");
    return JSON.parse(atob(payload));
  } catch {
    return null;
  }
}

export function setupTokenRefresh() {
  auth.onIdTokenChanged(async (user) => {
    if (user) {
      const token = await user.getIdTokenResult();
      const expirationTime = token.expirationTime
        ? new Date(token.expirationTime).getTime()
        : 0;
      const timeUntilExpiration = expirationTime - Date.now();

      if (timeUntilExpiration < 5 * 60 * 1000) {
        await refreshToken();
      }
    }
  });
}
