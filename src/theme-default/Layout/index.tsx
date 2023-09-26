import { useState } from 'react'
import { Content } from '@runtime'

export function Layout() {
  const [count, setCount] = useState(0)
  return (
    <div>
      <h1>This is Layout Component1 </h1>
      <Content />
    </div>
  )
}
