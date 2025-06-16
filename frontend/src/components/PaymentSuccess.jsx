import { useNavigate, useSearchParams } from 'react-router-dom';
//import { CheckCircle } from 'lucide-react';
import axios from 'axios';
import { useEffect,useState,useRef } from 'react';
import { Helmet } from 'react-helmet';
import Lottie from "lottie-react";
import confettiAnimation from "../assets/confetti.json"; // download from lottiefiles.com
//import { FaCheckCircle } from "react-icons/fa";
import { GoCheckCircleFill } from "react-icons/go";

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const message = searchParams.get('message') || 'Payment was successful!';
  const status = 'success';

  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  const [selectedDate,setSelectedDate] = useState();
  const [services,setServices] = useState([]);
  const [invoiceData, setInvoiceData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const paymentUpdatedRef = useRef(false); //Use useRef to prevent duplicate calls
  const bookingId = sessionStorage.getItem('bookingId'); // Get bookingId from sessionStorage
  const [showConfetti, setShowConfetti] = useState(true);
  sessionStorage.removeItem("skipReloadRedirect");//remove reload skip

  //const isNavigatingRef = useRef(false);
  const navigate = useNavigate();


  // Fetch user and company data, then post to generate invoice
  useEffect(() => {
    const fetchDataAndGenerateInvoice = async () => {
     if (!bookingId) return;

     const invoiceLockKey = `invoiceGenerated-${bookingId}`;
     const alreadyGenerated = sessionStorage.getItem(invoiceLockKey);

     if (alreadyGenerated === "true") {
       console.log("Invoice already generated for this booking. Skipping...");
       return;
     }

     sessionStorage.setItem(invoiceLockKey, "true"); // Lock this booking

      try {
        setLoading(true);

        // 1. Fetch user info
        const userRes = await axios.get(`${backendUrl}/api/admin/get-userinfo/${bookingId}`);
        const fullUserData = userRes.data;

        //console.log("fullUserData",fullUserData)

        const selectedDate = fullUserData.data.selectedDate;
        const services = fullUserData.data.services;

       setSelectedDate(selectedDate);
       setServices(services);

      // Use selectedDate and services here
       //console.log("selectedDate: ", selectedDate);
       //console.log("services: ", services);

        const extractedUserInfo = {
          id: fullUserData?.data.userInfo?.id,
          fullName: fullUserData?.data.userInfo?.fullName,
          email: fullUserData?.data.userInfo?.email,
          contactNumber: fullUserData?.data.userInfo?.contactNumber,
          city: fullUserData?.data.userInfo?.city,
          priceSummary: fullUserData?.data.priceSummary,
          services: fullUserData?.data.services,
          addOns: fullUserData?.data.addOns,
          date: fullUserData?.data.createdAt,
          dueDate: fullUserData?.data.selectedDate,
        };

   

        // 2. Fetch company info
        const companyRes = await axios.get(backendUrl+'/api/admin/get-invoiceinfo');
        const fullCompanyData = companyRes.data;

        //console.log("fullCompanyData",fullCompanyData)

        const extractedCompanyInfo = {
          companyAddress: fullCompanyData?.invoice.companyAddress,
          companyContact: fullCompanyData?.invoice.companyContact,
          companyName: fullCompanyData?.invoice.companyName,
          companyWebsite: fullCompanyData?.invoice.companyWebsite,
          invoiceId: fullCompanyData?.invoice.invoiceId,
          logo: fullCompanyData?.invoice.logo,
        };

        // 3. Combine and post to generate invoice
        const payload = {
          userInfo: extractedUserInfo,
          companyInfo: extractedCompanyInfo,
        };

        //console.log("Payload: ",payload)

       const invoiceRes = await axios.post(backendUrl+'/api/admin/generate-invoice', payload);
       console.log("invoice response: ",invoiceRes.data);
       setInvoiceData(invoiceRes.data);

     // 4. Update payment status and send email
     await updatePaymentStatus(selectedDate, services, status);

       //console.log("invoice Response",invoiceRes.data.pdfUrl)
      } catch (err) {
        console.error('Error:', err);
        setError('Failed to generate invoice');
      } finally {
        setLoading(false);
      }
    };

    fetchDataAndGenerateInvoice();
  }, [bookingId, status]);

  
   const updatePaymentStatus = async (selectedDateParam, servicesParam, statusParam) => {
    //console.log("Getting into updatePaymentStatus function")

       if (!bookingId || paymentUpdatedRef.current) {
       return;
      }
      //setPaymentUpdated(true); 
     paymentUpdatedRef.current = true; // Lock after first execution, Immediately prevent further calls
     //console.log("Calling updatePaymentStatus...");

      try {
          await axios.put(`${backendUrl}/api/user/bookings/${bookingId}/payment-status`, {
          paymentStatus: statusParam,
          selectedDate: selectedDateParam,
          services: servicesParam
        });
        console.log('Payment status updated successfully');

        // Send confirmation email after payment update
        await axios.post(backendUrl+'/api/admin/booking/send-confirmation-email', {
          bookingId,
        });
        console.log('Confirmation email sent successfully');

        // Clear bookingId from sessionStorage after payment and email confirmation
        sessionStorage.removeItem('bookingId');
      } catch (error) {
        console.error('Failed to update payment status or send email:', error);
        sessionStorage.removeItem('bookingId');
      }
    };

    useEffect(() => {
       const timer = setTimeout(() => setShowConfetti(false), 5000);
       return () => clearTimeout(timer);
    }, []);



   // Handler for "Go to Homepage" button
  const handleGoHome = async () => {
    await updatePaymentStatus(selectedDate, services, status);
    
    //remove session storage items
    const invoiceLockKey = `invoiceGenerated-${bookingId}`;
    sessionStorage.removeItem(invoiceLockKey);
    sessionStorage.removeItem('bookingId');

    // Soft navigation without triggering unload warning
    navigate('/');
  };


  return (
    <div>
     <Helmet>
              {/* Meta Tags */}
               <title>Pre Wedding | Post Wedding | Maternity | Baby Photoshoot Places in Bangalore</title>
               <meta
                name="description"
                content="Book your next photoshoot online. Find top photoshoot packages for pre-wedding, birthday, and maternity shoots in your city. Packages from ₹500."
              />
               <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
               <meta name="keywords" content="photoshoot, pre-wedding, maternity, book photoshoot online, family photoshoot, photoshoot in bangalore,post wedding photoshoot in bangalore, pre wedding photo shoot places in bangalore, maternity photoshoot in bangalore, photoshoot places in kanakapura road, outdoor photoshoot places in bangalore" />
               <meta name="author" content="Book Event" />
      
              {/* Open Graph for social sharing */}
              <meta property="og:title" content="Book Photoshoot Online" />
              <meta property="og:description" content="Find the best photoshoot packages for every occasion." />
              <meta property="og:type" content="website" />
       </Helmet>
      
    <div className="flex flex-col items-center justify-center min-h-screen ">
      {showConfetti && (
  <div className="fixed top-0 left-0 w-full h-full z-50 pointer-events-none">
    <Lottie
      animationData={confettiAnimation}
      loop={false}
      style={{ width: '100%', height: '100%' }}
    />
  </div>
)}

  <div className="bg-green-50 shadow-2xl rounded-3xl m-4 p-6 md:p-20 lg:p-28 flex flex-col items-center text-center transition-all duration-300 ease-in-out">
  <GoCheckCircleFill className="text-green-500 w-20 h-20 md:w-24 md:h-24 mb-2"/>
  <h2 className="text-xl md:text-3xl font-bold text-green-600"> {message} </h2>
  <p className="items-center text-center font-medium text-gray-700 mt-4">
   Your Order has been confirmed for your date.
  </p>
  <button
    onClick={handleGoHome}
    className="mt-8 px-8 py-3 bg-green-500 text-white rounded-full text-lg font-semibold hover:bg-green-600 shadow-md hover:shadow-lg transition-all duration-200"
  >
    Go to Homepage
  </button>
  <p className="mt-5 text-sm md:text-base font-semibold text-gray-600">
    <span className="text-red-500 text-lg">*</span> We'll reach out to you as soon as possible.
  </p>
</div>

     </div>
    </div>
  );
};

export default PaymentSuccess;
