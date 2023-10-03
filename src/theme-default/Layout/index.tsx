import { useState } from 'react'
import { Content } from '@runtime'
import 'uno.css'
export function Layout() {
  const [count, setCount] = useState(0)
  return (
    <div p="5">
      <h1>This is Layout Component1 </h1>
      <Content />
    </div>
  )
}
