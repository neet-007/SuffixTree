import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import { TreeContextProvider } from './TreeContext.tsx'

ReactDOM.createRoot(document.getElementById('root')!).render(
    <TreeContextProvider>
      <App />
    </TreeContextProvider>
)
