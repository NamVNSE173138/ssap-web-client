import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import "./css/style.css";
import "./css/satoshi.css";
// import 'jsvectormap/dist/css/jsvectormap.css';
import "flatpickr/dist/flatpickr.min.css";
import { Theme } from "@radix-ui/themes";

ReactDOM.createRoot(document.getElementById("root")!).render(
  // <React.StrictMode>
  // </React.StrictMode>,
  <Theme>
    <App />
  </Theme>,
);
