import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import axios from 'axios'

function App() {
  const [count, setCount] = useState("now nothing")

  const userdata ={
    name:"suraj",
    email:"surajsinha@gmail.com",
    password: "12345"
  }

  axios.post("http://localhost:8000/register", userdata).then((res)=>{
    console.log(res);
    setCount(res);
  }).catch(err=>{
    setCount(err.message)
    console.error(err.message);
  })


  return (
    <>
      <div>
        <h1>Hello people 

          <span>{count}</span>
        </h1>
      </div>
    </>
  )
}

export default App
