import { App } from './App'
import { renderToString } from 'react-dom/server'

//服务端build
export function render() {
  return renderToString(<App />)
}
