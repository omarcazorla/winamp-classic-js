import { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Winamp Classic",
    short_name: "Winamp",
    description: "Winamp 2 rebuilt for the web — with Spotify & Apple Music.",
    start_url: "/",
    display: "standalone",
    theme_color: "#3a3a3a",
    background_color: "#3a3a3a",
  };
}
