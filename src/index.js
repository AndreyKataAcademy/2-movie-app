import { ConfigProvider } from "antd";
import React from "react";
import ReactDOM from "react-dom/client";

import { MainProvider } from "./contexts/MainContext";
import App from "./pages/App.js";
import "./styles/styles.css";

const theme = {
  components: {
    Pagination: {
      itemActiveBg: "#1890FF",
      colorPrimary: "#FFF",
      colorPrimaryHover: "#FFF",
    },
  },
};
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <MainProvider>
      <ConfigProvider theme={theme}>
        <App />
      </ConfigProvider>
    </MainProvider>
  </React.StrictMode>,
);
