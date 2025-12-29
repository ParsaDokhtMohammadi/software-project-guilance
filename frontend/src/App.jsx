import { createBrowserRouter, createRoutesFromElements, Route, RouterProvider } from "react-router"
import Login from "./pages/Login"
import Layout from "./Layout"
import Dashboard from "./pages/Dashboard"
import Admin from "./pages/Admin"
import Register from "./pages/Register"
const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="" element={<Layout></Layout>}>
      <Route path="/" element={<Login></Login>}></Route>
      <Route path="/Register" element={<Register></Register>}></Route>
      <Route path="/Dashboard" element={<Dashboard></Dashboard>}></Route>
      <Route path="/Admin" element={<Admin></Admin>}></Route>
    </Route>
  )
)

import React from 'react'

const App = () => {
  return (
    <>
      <RouterProvider router={router}>

      </RouterProvider>
    </>
  )
}

export default App
