import { createGlobalStyle } from "styled-components";

export const GlobalStyles = createGlobalStyle`
  body {
    height: 100dvh;
    display: flex;
    justify-content: center;
    align-items: flex-start;
    padding-top: 5vh;
    margin: 0;
    font-family: Arial, Helvetica, sans-serif;
    background: #3a3a3a url('/wallpaper.webp') no-repeat center center / cover;
    overflow: hidden;
  }

  a {
    color: inherit;
    text-decoration: none;
  }

  * {
    box-sizing: border-box;
  }
`;
