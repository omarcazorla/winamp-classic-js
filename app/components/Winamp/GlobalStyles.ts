import { createGlobalStyle } from "styled-components";

export const GlobalStyles = createGlobalStyle`
  body {
    height: 100dvh;
    display: flex;
    justify-content: center;
    align-items: center;
    margin: 0;
    font-family: Arial, Helvetica, sans-serif;
    background: #3a3a3a;
    overflow: auto;
  }

  a {
    color: inherit;
    text-decoration: none;
  }

  * {
    box-sizing: border-box;
  }
`;
