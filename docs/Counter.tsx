import { useState } from 'react'

export default function Counter() {
  const [count, setCount] = useState(0)
  return (
    <div>
      <p>{count}1</p>
      <button onClick={() => setCount((count) => count + 1)}>点击加1</button>
    </div>
  )
}
