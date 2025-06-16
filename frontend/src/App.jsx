import { BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import MonthlyCalendar from './components/Calendar';
import Services from './components/Services';
import UserDetails from './components/userDetails';
import PaymentSuccess from './components/PaymentSuccess';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; 
import PaymentFailure from './components/PaymentFail';
import TestServices from './components/test';
import TestCalendar from './components/testCalendar'
import TestUserDetails from './components/testCheckout';
function App() {
  return (
    <div>
      {/* ✅ Correct placement of ToastContainer  <Route path='/success' element={<SuccessPage />} /> />*/}
      <ToastContainer />
      <Router>
        <Routes>
           <Route path='/user' element={<TestUserDetails/>} />
          <Route path='/calendar' element={<TestCalendar/>} />
          <Route path='/test' element={<TestServices/>}/>
          <Route path='/' element={<MonthlyCalendar />} />
          <Route path='/services' element={<Services />} />
          <Route path='/userdetails' element={<UserDetails />} />
          <Route path='/success' element={<PaymentSuccess />} />
          <Route path='/failure' element={<PaymentFailure />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;


