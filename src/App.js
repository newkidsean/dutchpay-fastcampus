import './App.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import CreateGroup from './components/CreateGroup';
import Addmembers from './components/Addmembers';
import ExpenseMain from './components/ExpenseMain';
import { RecoilRoot } from 'recoil';
import 'bootstrap/dist/css/bootstrap.min.css';

const App = () => (
  <BrowserRouter>
    <RecoilRoot>
      <Routes>
        <Route path='/' element={<CreateGroup />} />
        <Route path='/members' element={<Addmembers />} />
        <Route path='/expense' element={<ExpenseMain />} />
      </Routes>
    </RecoilRoot>
  </BrowserRouter>
)

export default App;
