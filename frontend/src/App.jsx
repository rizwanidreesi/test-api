
import './App.css'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import CreateStudent from './components/CreateStudent'
import StudentList from './components/StudentList'
import ViewStudent from './components/ViewStudent';
import UpdateStudent from './components/UpdateStudent';


function App() {


  return (
    <>
      {/* <CreateStudent />
      <StudentList /> */}
      <Router>
        <Routes>
          <Route path='/' element ={<StudentList />} />
          <Route path='/create' element ={<CreateStudent />} />
          <Route path='/byId/:id' element ={<ViewStudent />} />
          <Route path='/update/:id' element ={<UpdateStudent />} />
          {/* <Route path="/update/:id" element={<UpdateStudent />} */}
          

        </Routes>
      </Router>
      
    </>
  )
}

export default App
