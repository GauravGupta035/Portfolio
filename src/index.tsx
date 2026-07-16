import React from "react";
import ReactDOM from "react-dom/client";
// @ts-ignore
import "./index.css";
// @ts-ignore
import { ChakraProvider } from "@chakra-ui/react";
import App from "./App";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement,
);
root.render(
  <ChakraProvider>
    <App />
  </ChakraProvider>,
);
