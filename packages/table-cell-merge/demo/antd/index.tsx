import ReactDOM from "react-dom/client"
import App from "./App"

export default () => {
  ;(ReactDOM as any).createRoot(document.querySelector("#app")!).render(<App />)
}
