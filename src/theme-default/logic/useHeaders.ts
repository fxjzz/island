import { useState, useEffect } from 'react'
import { Header } from '../../shared/types/index'

export function useHeaders(initHeaders: Header[]) {
  const [headers, setHeaders] = useState(initHeaders)
  //todo
  // useEffect(() => {
  //   if (import.meta.env.DEV && import.meta.hot) {
  //     import.meta.hot.on('mdx-changed', ({ filePath, time }) => {
  //       import(/* @vite-ignore */ `${filePath}?import&t=${time}`).then((module) => {
  //         setHeaders(module.toc)
  //       })
  //       import(`${filePath}`)
  //     })
  //   }
  // })
  return headers
}
