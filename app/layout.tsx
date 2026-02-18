import { getRootAppUrl } from "@/api/spotify/utils";
import StyledComponentsRegistry from "@/lib/registry";
import { Metadata, Viewport } from "next";
import Script from "next/script";

const favicon32Url = `${getRootAppUrl()}/favicon-32x32.png`;
const favicon16Url = `${getRootAppUrl()}/favicon-16x16.png`;

export const metadata: Metadata = {
  title: "Winamp Classic",
  description: "Winamp 2 rebuilt for the web — with Spotify & Apple Music.",
  metadataBase: new URL(getRootAppUrl()),
  openGraph: {
    url: getRootAppUrl(),
    title: "Winamp Classic",
    description: "Winamp 2 rebuilt for the web — with Spotify & Apple Music.",
    type: "website",
  },
  icons: [
    {
      rel: "icon",
      type: "image/png",
      sizes: "32x32",
      url: favicon32Url,
    },
    {
      rel: "icon",
      type: "image/png",
      sizes: "16x16",
      url: favicon16Url,
    },
    {
      rel: "apple-touch-icon",
      sizes: "180x180",
      url: `${getRootAppUrl()}/apple-touch-icon.png`,
    },
  ],
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html>
      <body>
        <StyledComponentsRegistry>{children}</StyledComponentsRegistry>
      </body>
      <Script src="https://js-cdn.music.apple.com/musickit/v3/musickit.js" />
    </html>
  );
}
