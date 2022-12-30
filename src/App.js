import logo from './logo.svg';
import './App.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import CreateGroup from './components/CreateGroup';
import Addmembers from './components/Addmembers';
import ExpenseMain from './components/ExpenseMain';

const App = () => (
  <BrowserRouter>
    <Routes>
      <Route path='/' element={<CreateGroup />} />
      <Route path='/members' element={<Addmembers />} />
      <Route path='/expense' element={<ExpenseMain />} />
    </Routes>
  </BrowserRouter>
)

export default App;
