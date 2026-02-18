import { deleteCookie, getCookie, setCookie } from "cookies-next";
import { cookies } from "next/headers";
import { SPOTIFY_TOKENS_COOKIE_NAME } from "@/utils/constants/api";

/**
 * [Server-side only] Returns the root URL of the app, depending on the environment
 */
export const getRootAppUrl = () => {
  const isDev = process.env.NODE_ENV === "development";

  if (isDev) {
    return "http://127.0.0.1:3000";
  }

  // VERCEL_PROJECT_PRODUCTION_URL is the production domain (e.g. "winamp-classic-js.vercel.app")
  // VERCEL_URL is the deployment-specific URL (includes branch/commit URLs)
  const host =
    process.env.VERCEL_PROJECT_PRODUCTION_URL ||
    process.env.VERCEL_URL ||
    process.env.VERCEL_BASE_URL;

  return `https://${host}`;
};

export const getSpotifyRedirectUri = () => {
  return getRootAppUrl();
};

export const getSpotifyAuthorizationHeader = (
  clientId?: string,
  clientSecret?: string
) => {
  if (!clientId || !clientSecret) {
    console.error(
      "getSpotifyAuthorizationHeader: clientId or clientSecret is undefined"
    );
  }

  return (
    "Basic " + Buffer.from(clientId + ":" + clientSecret).toString("base64")
  );
};

export const setSpotifyTokens = (accessToken: string, refreshToken: string) => {
  const tokenRefreshTimestamp = Date.now().toString();

  setCookie(
    SPOTIFY_TOKENS_COOKIE_NAME,
    `${accessToken},${refreshToken},${tokenRefreshTimestamp}`,
    {
      cookies,
      sameSite: false,
    }
  );
};

export const getSpotifyTokens = () => {
  const spotifyTokens = getCookie(SPOTIFY_TOKENS_COOKIE_NAME, {
    cookies,
  });
  const [storedAccessToken, storedRefreshToken, lastRefreshedTimestamp] =
    spotifyTokens?.split(",") ?? [undefined, undefined, undefined];

  return {
    storedAccessToken,
    storedRefreshToken,
    lastRefreshedTimestamp: parseInt(lastRefreshedTimestamp ?? "") || undefined,
  };
};

export const clearSpotifyTokens = () => {
  deleteCookie(SPOTIFY_TOKENS_COOKIE_NAME, {
    cookies,
  });
};
