import React,{useEffect} from 'react'
//import { RiErrorWarningLine } from "react-icons/ri";
import { PiWarningCircle } from "react-icons/pi";
//import { IoWarningOutline } from "react-icons/io5";
import { Helmet } from 'react-helmet';
//import { HiXCircle } from "react-icons/hi";
import { useSearchParams } from 'react-router-dom';

const PaymentFailure = () => {
  const [searchParams] = useSearchParams();
  const message = searchParams.get('message') || 'Payment Failed'

  useEffect(() => {
  sessionStorage.removeItem("skipReloadRedirect");
}, []);

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
    <div className="bg-red-100 shadow-lg rounded-2xl m-1 p-6 md:p-28 flex flex-col items-center">
      <PiWarningCircle className="text-red-500 w-30 h-30 mb-2" />
      <p className="text-2xl font-bold text-red-500">{message}</p>
      <p className="text-base font-semibold  mt-3">Sorry your transaction could not be processed,</p>
      <p className="text-base font-semibold">Please try again in a few moments.</p>
      <a
        href="/"
        className="mt-5 px-6 py-2 bg-green-500 text-white rounded-full text-lg font-medium hover:bg-green-600 transition"
      >
        Go to Homepage
      </a>
      <p className='mt-3 text-md font-semibold'><span className='text-red-500 text-xl mt-1'>*</span> We'll reach out to you as soon as possible.</p>
    </div>
  </div>
  </div>
  )
}

export default PaymentFailure