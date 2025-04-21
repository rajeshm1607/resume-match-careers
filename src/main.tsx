
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.tsx';
import './index.css';
import { Toaster } from "@/components/ui/toaster";

// Add console log for source mapping help
console.log("main.tsx: Initializing application");

// Block Cloudflare analytics
if (window) {
  // @ts-ignore
  window.__cfBeaconDisabled = true;
}

// Make sure we have a root element
const rootElement = document.getElementById("root");
if (!rootElement) {
  console.error("main.tsx: Root element not found");
  throw new Error("Root element not found");
}

createRoot(rootElement).render(
  <BrowserRouter>
    <App />
    <Toaster />
  </BrowserRouter>
);

console.log("main.tsx: Application rendered");
