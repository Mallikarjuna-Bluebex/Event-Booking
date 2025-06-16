import { useState,useContext,useEffect } from "react";
import { BookingContext } from '../context/BookingContext';
import axios from 'axios';
import { v4 as uuidv4 } from "uuid";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import AddOn from "./AddOn";
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';

const testUserDetails = () => {
  const { updateBookingData, bookingData } = useContext(BookingContext);
  const [isChecked, setIsChecked] = useState(false);
  const [showSaveButton,setShowSaveButton] = useState(true);
  const [showPaymentButton, setShowPaymentButton] = useState(false); // New state
  const [fadeIn, setFadeIn] = useState(false); 
  const [showCheckboxError, setShowCheckboxError] = useState(false);
  const [phone, setPhone] = useState("+91");
  //const [invoiceId, setInvoiceId] = useState("");
  const [emailError, setEmailError] = useState("");
  const [confirmEmailError, setConfirmEmailError] = useState("");
  const [gateway, setGateway] = useState(null);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [formData, setFormData] = useState({
    id:"",
    fullName: "",
    email: "",
    confirmEmail: "",
    contactNumber: "",
    city: "",
    referralSource: ""
  });

  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const navigate = useNavigate();


  const ItemPrice = bookingData.services.reduce((total, service) => total + (service.price*service.quantity), 0);
  const totalDiscount = bookingData.services.reduce((total, service) => total + (service.discount || 0), 0);

  const serviceTotal = bookingData.services.reduce((total, service) => {
    const discountedPrice = (service.price*service.quantity) - (service.discount || 0);
    return total + discountedPrice;
  }, 0);
  
  const addOnTotal = bookingData.addOns?.reduce((total, addOn) => {
    return total + addOn.price;
  }, 0) || 0;
  
  const totalAmount = serviceTotal + addOnTotal;
  

  useEffect(() => {
    updateBookingData({
      priceSummary: { ItemPrice: ItemPrice + addOnTotal, 
                      totalDiscount, 
                      totalAmount 
                    },
      });
  }, [ItemPrice, totalDiscount, totalAmount, updateBookingData]);


   // Generate invoiceId once on mount
  useEffect(() => {
    const newId = `${uuidv4().slice(0, 8).toUpperCase()}`;
    //setInvoiceId(newId);
    setFormData(prev => ({ ...prev, id: newId }));
  }, []);


//reload page
   useEffect(() => {
    //Check if user should be redirected home after reload
    const shouldRedirect = sessionStorage.getItem("shouldRedirectHome") === "true";
    const shouldSkip = sessionStorage.getItem("skipReloadRedirect") === "true";

    if (shouldRedirect && !shouldSkip) {
      sessionStorage.removeItem("shouldRedirectHome");
      sessionStorage.removeItem("skipReloadRedirect");
      // Force hard redirect to home
      window.location.replace("/");
    }

    // Set reload flag if user reloads the page
    const handleBeforeUnload = (e) => {
      if (sessionStorage.getItem("skipReloadRedirect") === "true") return;
      sessionStorage.setItem("shouldRedirectHome", "true");
      e.preventDefault();
      e.returnValue = "";
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [navigate]);


  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleCheckboxChange = () => {
    setIsChecked(!isChecked);
    if (!isChecked) setShowCheckboxError(false); //Hide error when checkbox is selected
  };

  // Real-time email validation
  useEffect(() => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (formData.email && !emailRegex.test(formData.email)) {
      setEmailError("Invalid email format");
    } else {
      setEmailError("");
    }
  /*  if (formData.confirmEmail && formData.email !== formData.confirmEmail) {
      setConfirmEmailError("Email does not match. Please check again");
    } else {
      setConfirmEmailError("");
    }*/
  }, [formData.email, formData.confirmEmail]);


  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.fullName || !formData.email || !formData.city) {
      toast.error("Please fill all required fields.");
      return;
    }
   /* if (formData.email !== formData.confirmEmail) {
      toast.error("Email does not match.");
      return;
    } */
    if (!phone || phone.length < 10) {
      toast.error("Enter a valid contact number.");
      return;
    }
  
    const updatedBookingData = {
      ...bookingData,
      userInfo: { ...formData, contactNumber: phone },
    };
  
    updateBookingData(updatedBookingData);
    
    try {
      const response = await axios.post(`${backendUrl}/api/user/booking`, updatedBookingData);
      sessionStorage.setItem("bookingId", response.data.bookingId);
      setShowSaveButton(false);
      toast.success("Now make payment to confirm your booking.");
      setShowPaymentButton(true);
    } catch (error) {
      toast.error("Failed to submit booking data");
      console.error(error);
    }
  };
  
  const handleMobileSubmit = async (e) => {
    e.preventDefault();
    if (!formData.fullName || !formData.email  || !formData.city) {
      toast.error("Please fill all required fields.");
      return;
    }
   /*if (formData.email !== formData.confirmEmail) {
      toast.error("Email does not match.");
      return;
    } */
    if (!phone || phone.length < 10) {
      toast.error("Enter a valid contact number.");
      return;
    }

    const updatedBookingData = {
      ...bookingData,
      userInfo: { ...formData, contactNumber: phone },
    };
    updateBookingData(updatedBookingData);
     // Collapse the form on submit
    setIsCollapsed(true);
    try {
      const response = await axios.post(`${backendUrl}/api/user/booking`, updatedBookingData);
      sessionStorage.setItem("bookingId", response.data.bookingId);
      setShowSaveButton(false);
      toast.success("Now make payment to confirm your booking.");
      setShowPaymentButton(true);
    } catch (error) {
      toast.error("Failed to submit booking data");
      console.error(error);
    }
  };

  useEffect(() => {
    if (showPaymentButton) {
      setTimeout(() => setFadeIn(true), 200); // Delay fade-in effect slightly
    }
  }, [showPaymentButton]);

  useEffect(() => {
    // Fetch the active payment gateway from backend
    fetch(backendUrl+"/api/user/active-gateway")
      .then((res) => res.json())
      .then((data) => setGateway(data.gateway))
      .catch((error) => console.error("Error fetching gateway:", error));
  }, []);


  // Function to handle payment based on gateway
  const handlePayment = () => {
    //console.log("handlePayment clicked")
    //console.log("gatway",gateway)
    if (!gateway) return;
  
    if (gateway === "PayU") {
      handlePayuPayment();
    } else if (gateway === "PhonePe") {
      handlePhonepePayment();
    } else if (gateway === "Razorpay") {
      handleRazorpayPayment();
    } else if (gateway === "PayPal") {
      handlePaypalPayment();
    }
  };


  //payu payment gateway
  const handlePayuPayment = async () => {
    if (!isChecked) {
      setShowCheckboxError(true); // Show error message if checkbox is not checked
      return;
    }

     // Set skip flag BEFORE submitting the form for reload
    sessionStorage.setItem("skipReloadRedirect", "true");
   
    try {
        const response = await axios.post(backendUrl+'/api/user/pay', {
            amount: totalAmount,
            productInfo: bookingData.services.map(service => service.name).join(', '),
            firstName: formData.fullName,
            email: formData.email,
            phone: formData.contactNumber,
        });
  
        const { url, payUData } = response.data;
  
        const form = document.createElement('form');
        form.method = 'POST';
        form.action = url; // Use 'url' from response
  
        Object.keys(payUData).forEach(key => {
            const input = document.createElement('input');
            input.type = 'hidden';
            input.name = key;
            input.value = payUData[key];
            form.appendChild(input);
        });
  
        document.body.appendChild(form);
        form.submit();
  
    } catch (error) {
        console.error('Payment failed:', error.response?.data || error.message);
    }
  };
 

  //phonepe payment gateway 
  const handlePhonepePayment = async () => {
    if (!isChecked) {
      setShowCheckboxError(true); // Show error message if checkbox is not checked
      return;
    }
     //Set skip flag BEFORE submitting the form for reload
    sessionStorage.setItem("skipReloadRedirect", "true");

    try {
      const orderId = "ORDER_" + new Date().getTime(); // Generate a unique order ID
      const response = await axios.post(backendUrl+"/api/user/initiate-payment", { totalAmount, orderId });

      if (response.data.success) {
          window.location.href = response.data.data.instrumentResponse.redirectInfo.url; // Redirect to PhonePe
      } else {
          alert("Payment initiation failed");
      }
  } catch (error) {
      console.error(error);
      alert("Error processing payment");
   }
  }

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };
  
  //Razorpay payment
  const handleRazorpayPayment = async () => {
    if (!isChecked) {
      setShowCheckboxError(true); // Show error message if checkbox is not checked
      return;
    }
     // Set skip flag BEFORE submitting the form
    sessionStorage.setItem("skipReloadRedirect", "true");

    const scriptLoaded = await loadRazorpayScript();
    if (!scriptLoaded) {
      alert("Failed to load Razorpay. Please check your internet connection.");
      return;
    }
    try {
      // Create order on backend
      const { data } = await axios.post(backendUrl+"/api/user/create-order", {
        totalAmount,
        currency: "INR",
       // receipt: `order_rcpt_${Date.now()}`,//creating an unique orderId for transaction.
      });

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID, // Razorpay Key ID
        amount: data.amount,
        currency: data.currency,
        name: "Event Booking",
        description: "Book your event slot",
        order_id: data.id,
        //verify the status of payment, we coded handler
        handler: async (response) => {
        console.log("Razorpay Response:", response);
  
      // Extract required values
      const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = response;

          // Send for verification
      const verifyRes = await axios.post(backendUrl+"/api/user/verify-payment", {
            razorpay_order_id,
            razorpay_payment_id,
            razorpay_signature,
      });

      if (verifyRes.data.success) {
          // Redirect to verification URL
          window.location.href = verifyRes.data.redirectUrl;
      } else {
          // Redirect to verification URL
          window.location.href = verifyRes.data.redirectUrl;;
        }
      },
      theme: {
          color: "#3399cc",
        },
      };
      const razor = new window.Razorpay(options);
      razor.open();
    } catch (error) {
      console.error("Payment Error:", error);
      alert("Payment failed!");
    }
  }

  //paypal payment gateway
const handlePaypalPayment = async () => {
  if (!isChecked) {
      setShowCheckboxError(true); // Show error message if checkbox is not checked
      return;
    }

  // Set skip flag BEFORE submitting the form
  sessionStorage.setItem("skipReloadRedirect", "true");

  try {
    const { data } = await axios.post(backendUrl+"/api/user/create-payment", { totalAmount });
    //console.log("data.approvalUrl: ",data.approvalUrl);
    if (data?.approvalUrl) {
      window.location.href = data.approvalUrl; // Redirect to PayPal
    } else {
      console.error("Approval URL missing in response");
    }
  } catch (error) {
    console.error("Payment Error:", error);
  }
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
        <motion.div
         className='space-y-10 sm:space-y-3'
         initial={{ opacity: 0, y: 30 }}
         animate={{ opacity: 1, y: 0 }}
         transition={{ duration: 0.6 }}
       >
      <div>
      <h1 className='text-3xl text-transparent bg-clip-text bg-gradient-to-r from-purple-600 via-pink-500 to-red-500 font-bold mx-4 lg:mx-20 mt-4'>Elements Photo Shoots</h1>
      <h4 className='text-xl md:text-lg mx-4 lg:mx-20 mt-1'>Elements Bangalore</h4>
      <hr className="border-t-4 border-gray-300 mx-4 lg:mx-20 m-3 w-[90%]" />
      </div>
  <div className="flex flex-col md:flex-row gap-6 max-w-6xl mx-2 sm:mx-15 md:mx-20 lg:mx-25 xl:mx-auto bg-white rounded-lg border border-gray-100 justify-between">

      {/* Left: Form */}
      {!isCollapsed && (
        <div className="w-full xl:w-[50%] pb-2">
          <h2 className="text-xl font-bold bg-gray-200 p-4">
            📝 Attendee Details :
          </h2>
          <form onSubmit={handleSubmit} className="space-y-5 pl-4 pr-2 xl:pr-0 py-4">
            {/* Full Name */}
            <div>
              <label className="font-medium">Full Name <span className="text-red-500">*</span></label>
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                required
                className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-purple-400 outline-none"
              />
            </div>

            {/* Email */}
            <div>
              <label className="font-medium">Email <span className="text-red-500">*</span></label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-purple-400 outline-none"
              />
              {emailError && <p className="text-red-400 text-[10px] font-semibold mt-1">{emailError}</p>}
            </div>

            {/* Confirm Email 
            <div>
              <label className="font-medium">Confirm Email <span className="text-red-500">*</span></label>
              <input
                type="email"
                name="confirmEmail"
                value={formData.confirmEmail}
                onChange={handleChange}
                required
                className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-purple-400 outline-none"
              />
              {confirmEmailError && <p className="text-red-500 text-sm mt-1">{confirmEmailError}</p>}
            </div>*/}

            {/* Phone Input */}
            <div>
              <label className="font-medium">Contact Number <span className="text-red-500">*</span></label>
              <PhoneInput
                country={"in"}
                value={phone}
                onChange={(phone) => setPhone(phone)}
                inputStyle={{
                  width: "100%",
                  height: "45px",
                  border: "1px solid #d1d5db",
                  borderRadius: "8px",
                }}
                buttonStyle={{ border: "none", background: "transparent" }}
              />
            </div>

            {/* City */}
            <div>
              <label className="font-medium">City <span className="text-red-500">*</span></label>
              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleChange}
                required
                className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-purple-400 outline-none"
              />
            </div>

            {/* Referral */}
            <div>
              <label className="font-medium">How did you hear about us? <span className="text-red-500">*</span></label>
              <select
                name="referralSource"
                value={formData.referralSource}
                onChange={handleChange}
                required
                className="w-full p-2 border border-gray-300 rounded bg-white"
              >
                <option value="">Select an option</option>
                <option value="socialMedia">Social Media</option>
                <option value="friend">Friend/Family</option>
                <option value="searchEngine">Search Engine</option>
                <option value="other">Other</option>
              </select>
            </div>

            {/* Save button */}
            {showSaveButton && (
              <button
                type="submit"
                className="hidden xl:block bg-indigo-600 hover:bg-indigo-700 text-white py-3 px-6 rounded-lg w-full"
              >
                Save Information
              </button>
            )}
          </form>

          {/* Mobile Add-on Section */}
          <div className="xl:hidden ">
            <h4 className="text-xl font-bold py-3 px-5 mx-2 bg-blue-500 text-white">ADD-ONS:</h4>
            <AddOn/>
          </div>

          {showSaveButton && (
             <button  onClick={handleMobileSubmit} className="xl:hidden bg-blue-500 text-white text-xl mx-auto py-3 mt-4 w-full">
                Save Information
            </button>
          )}
        </div>
      )}

      {/* Right: Summary */}
      <div className={`${!isCollapsed ? "hidden" : "block"} xl:block w-full xl:w-[40%] bg-gradient-to-r from-gray-100 to-gray-200 border border-gray-200`}>
        <div className="p-6 rounded-lg space-y-6">
          <h2 className="text-xl font-bold text-gray-800">SUMMARY: </h2>
        {/*  {bookingData?.services?.map((service, index) => (
            <p key={index} className="text-lg font-semibold pl-3 text-gray-800">
            {service.name}
           </p>
          ))}
          <hr /> */}
         
          <div className="space-y-3">
            <div className="flex justify-between">
              <p className="text-lg text-gray-700 font-semibold">🏷️ Item Price (<span className="text-sm">x</span>{bookingData.services.length}):</p>
              <p className="text-lg font-semibold text-gray-800">₹{ItemPrice}</p>
            </div>
           
              <div className="flex justify-between">
                <p className="text-lg font-semibold text-gray-700">
                ⚡ Add-Ons {bookingData.addOns.length > 0 && (
                <span className="text-lg text-gray-700">(<span className="text-sm">x</span>{bookingData.addOns.length})</span>
                )}:</p>
                <p className="text-lg font-semibold text-gray-800">{addOnTotal ? `₹${addOnTotal}` : '--'}</p>
              </div>
           
              <div className="flex justify-between">
                <p className="text-lg font-semibold text-green-600">💸 Discount:</p>
                <p className="text-md font-semibold text-green-600">{totalDiscount ? `-₹${totalDiscount}` : '--'}</p>
              </div>
            
          </div>

          <div className="border-t pt-3">
            <div className="flex justify-between">
              <p className="text-indigo-900 text-xl font-bold">💰 Total Amount:</p>
              <p className="text-indigo-900 text-xl font-bold">₹{totalAmount}</p>
            </div>
            <p className="text-xs text-gray-600 mt-1">*Inclusive of GST. Booking fees extra.</p>
          </div>

          {/* Terms Checkbox */}
          <div className="flex items-start gap-2">
            <input
              type="checkbox"
              id="terms"
              checked={isChecked}
              onChange={handleCheckboxChange}
              className="h-5 w-5 text-indigo-600 border-gray-300 rounded"
            />
            <label htmlFor="terms" className="text-sm font-semibold text-gray-800">
              I have read and agree to the <span className="underline text-blue-800">terms</span> and <span className="underline text-blue-800">privacy policy</span>.
            </label>
          </div>

          {/* Payment Button */}
          {showPaymentButton && (
            <div className="pt-4">
              <button
                onClick={handlePayment}
                className={`w-full py-4 bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-semibold text-lg rounded-lg shadow hover:shadow-xl transition-transform duration-300 transform hover:scale-105 ${fadeIn ? 'opacity-100' : 'opacity-0'}`}
              >
                Proceed to Pay
              </button>
              {showCheckboxError && (
                <p className="text-red-400 text-sm font-bold mt-3 gap-1">
                  * You must agree to the terms before proceeding.
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
    </motion.div>
   </div>
  );
};

export default testUserDetails;
