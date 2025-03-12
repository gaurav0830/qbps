import { useState } from 'react'
import Register from './Admin/Register'
import UserList from './Admin/Displayuser'
import Login from './Login'
import Home from './Home'
import Dashboard from './Admin/Dasboard'
import AddSubjects from './Admin/AddSubjects'
import QuestionPapersTable from './QuestionPapersTable'
import Question from './Question'
import "./index.css";
import {BrowserRouter,Routes,Route} from 'react-router-dom'
import Displayuser from './Admin/Displayuser'


function App() {
  

  return (
    <BrowserRouter>
    <Routes>
      <Route path="/Admin/register" element={<Register />} />
      <Route path="/" element={<Login />} />
      <Route path="/home" element={<Home />} />
      <Route path="/questionpapers" element={<QuestionPapersTable />} />
      <Route path="/Admin/dashboard" element={<Dashboard/>} />
      <Route path="/Admin/users" element={<UserList/>}/>
      <Route path="/Admin/subjects" element={<AddSubjects/>}/>
      <Route path="/question" element={<Question/>}/>
    </Routes>
    </BrowserRouter>
  )
}

export default App
