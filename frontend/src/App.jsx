import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MonthlyCalendar from './components/Calendar';
import Services from './components/Services';
import UserDetails from './components/userDetails';
import PaymentSuccess from './components/PaymentSuccess';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; 
import PaymentFailure from './components/PaymentFail';
//import Home from './components/Home';


function App() {
  return (
    <div>
      
      <ToastContainer />
      <Router>
        <Routes>
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


