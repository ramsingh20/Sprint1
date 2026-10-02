import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";

import { ThemeProvider } from "./context/ThemeContext";
import { Provider } from "react-redux";
import { store } from "./store/store.js";
import { connectSocket } from "./services/socketService.js";

connectSocket();

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Provider store={store}>
      <ThemeProvider>
        <App />
      </ThemeProvider>
    </Provider>
  </StrictMode>
);