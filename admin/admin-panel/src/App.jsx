import React, { useState } from 'react'
import Navbar from './components/Navbar'
import Sidebar from "./components/Sidebar"
import { Navigate, Route, Routes } from 'react-router-dom'
import Add from './pages/Add'
import List from './pages/List'
import Orders from './pages/Orders'
import Login from './components/Login'
import { toast, ToastContainer } from "react-toastify"
import 'react-toastify/dist/ReactToastify.css'
import { useEffect } from 'react'
import EditProduct from './pages/EditProduct'
import Invoice from './components/Invoice'
import Dashboard from './pages/Dashboard'
import ReviewPage from './pages/ReviewPage'


export const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";

const App = () => {

  const [token, setToken] = useState(localStorage.getItem('token') ? localStorage.getItem('token') : "")


  useEffect(() => {
    localStorage.setItem('token', token)
  }, [token])
  return (
    <div className='bg-gray-50 min-h-screen'>
      <ToastContainer />
      {token === ""
        ? <Login setToken={setToken} />
        :
        <>
          <Navbar setToken={setToken} />
          <hr />
          <div className='flex w-full'>
            <Sidebar />
            <div className='w-[70%] mx-auto ml-[max(5vw,25px)] my-8 text-gray-600 text-base'>
              <Routes>
                <Route path="/" element={<Dashboard token={token} />} />
                <Route path='/add' element={<Add token={token} />} />
                <Route path='/list' element={<List token={token} />} />
                <Route path='/orders' element={<Orders token={token} />} />
                <Route path="/edit-product/:productId" element={<EditProduct token={token} />} />
                <Route path='/reviews' element={<ReviewPage token={token} />} />


                {/* <Route path="/invoice/:orderId" element={<Invoice />} /> */}


              </Routes>
            </div>
          </div>
        </>
      }
    </div>
  )
}

export default App