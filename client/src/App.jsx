import { useState } from 'react'
import Register from './Admin/Register'
import Login from './Login'
import Home from './Home'
import Dashboard from './Admin/Dasboard'
import QuestionPapersTable from './QuestionPapersTable'
import "./index.css";
import {BrowserRouter,Routes,Route} from 'react-router-dom'


function App() {
  

  return (
    <BrowserRouter>
    <Routes>
      <Route path="/Admin/register" element={<Register />} />
      <Route path="/login" element={<Login />} />
      <Route path="/home" element={<Home />} />
      <Route path="/questionpapers" element={<QuestionPapersTable />} />
      <Route path="/Admin/dashboard" element={<Dashboard/>} />
    </Routes>
    </BrowserRouter>
  )
}

export default App
