import { createRoot } from 'react-dom/client'
import { App, initPageData } from './App'
import { BrowserRouter } from 'react-router-dom'
import { DataContext } from './hooks'

async function renderInBrowser() {
  const containerEl = document.getElementById('root')
  if (!containerEl) {
    throw new Error('#root element not found')
  }
  console.log(location.pathname)
  const pageData = await initPageData(location.pathname)
  createRoot(containerEl).render(
    //全局content pageData
    <DataContext.Provider value={pageData}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </DataContext.Provider>
  )
}

renderInBrowser()
