import React, { useState, useEffect, useContext } from 'react';
import dayjs from 'dayjs';
import { BookingContext } from '../context/BookingContext';
import { useNavigate } from 'react-router-dom';
import PhotoShoots_Bumper_Package from '../assets/PhotoShoots_Bumper_Package.webp'
import PhotoShoots_Super_Package from '../assets/PhotoShoots_Super_Package.webp'
import PhotoShoots_Popular_Package from '../assets/PhotoShoots_Popular_Package.webp'
import { Helmet } from 'react-helmet';
import { CalendarDays, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { FaLongArrowAltRight } from "react-icons/fa";
import { FaArrowRight } from "react-icons/fa6";
import { FaArrowRightLong } from "react-icons/fa6";
import { MdArrowRight } from "react-icons/md";
import { IoIosArrowDroprightCircle } from "react-icons/io";

const MonthlyCalendar = () => {

  const useBooking = () => useContext(BookingContext);
    
  const {bookingData, updateBookingData } = useBooking();
  const [currentDate, setCurrentDate] = useState(dayjs());
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const navigate = useNavigate();

  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  const images = [
    { src: PhotoShoots_Super_Package, alt: 'PhotoShoots_Super_Package Offer' },
    { src: PhotoShoots_Popular_Package, alt: 'PhotoShoots_Popular_Package Offer' },
    { src: PhotoShoots_Bumper_Package, alt: 'PhotoShoots_Bumper_Package Offer' }
  ];
  
  const startOfMonth = currentDate.startOf('month');
  const endOfMonth = currentDate.endOf('month');
  const startDay = startOfMonth.day();
  const daysInMonth = endOfMonth.date();

  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const emptyDays = Array.from({ length: startDay });

  const minMonth = dayjs();
  const maxMonth = minMonth.add(3, 'month');

  useEffect(() => {
    if (!sessionStorage.getItem('visit-tracked')) {
      fetch(backendUrl+'/api/user/visit', {
        method: 'POST',
      }).catch((err) => console.error('Visit tracking failed:', err));
      sessionStorage.setItem('visit-tracked', 'true');
    }
  }, []);


   const nextSlide = () => {
    const isLastSlide = currentIndex === images.length - 1;
    const newIndex = isLastSlide ? 0 : currentIndex + 1;
    setCurrentIndex(newIndex);
  };

  const goToSlide = (index) => {
    setCurrentIndex(index);
  };

  useEffect(() => {
    if (!isHovered) {
      const interval = setInterval(nextSlide, 10000);
      return () => clearInterval(interval);
    }
  }, [currentIndex, isHovered]);

  const prevMonth = () => {
    if (!currentDate.isSame(minMonth, 'month')) {
      setCurrentDate(currentDate.subtract(1, 'month'));
    }
  };

  const nextMonth = () => {
    if (!currentDate.isSame(maxMonth, 'month')) {
      setCurrentDate(currentDate.add(1, 'month'));
    }
  };

  const selectDate = (day) => {
    const date = currentDate.date(day).format('YYYY-MM-DD');
    updateBookingData({ selectedDate: date });
  };

  const handleProceed = () => {
    if (bookingData.selectedDate) {
      navigate('/test');
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
        <link rel="canonical" href="http://localhost:5173/" />

       <link rel="preload" as="image" href={images[0].src} fetchPriority="high"/>

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
      {/* header */}
      <div className="mx-4 lg:mx-20 mt-8">
        <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 via-pink-500 to-red-500">
          Elements Photo Shoots
        </h1>
        <h4 className="text-lg md:text-xl text-gray-700 mt-2">
          Elements Bangalore
        </h4>
        <hr className="border-t-4 border-gray-300 my-4 w-[90%] animate-grow" />
      </div>

      {/* includes both calendar and image */}
     <div className="xl:flex lg:space-x-18 gap-2" > 
      
        {/* calendar */}
      <div className='space-y-10 sm:space-y-3'>
        <h2 className="text-xl ml-4 lg:ml-20 mt-3 font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-violet-500 via-purple-500 to-pink-500">
          SELECT DATE FOR EVENT :
        </h2>
      {/* <h2 className="text-xl ml-4 lg:ml-20 text-violet-400 mt-3 font-bold">SELECT DATE FOR EVENT :</h2>
       <div className="w-full max-w-[98%] sm:max-w-[90%] md:max-w-[690px] xl:w-[600px] m-auto mt-6 py-3 sm:px-4 md:p-4 lg:ml-28 bg-white rounded-lg sm:rounded-2xl shadow-sm">
      <div className="flex justify-center gap-8 items-center mb-4">
        <button onClick={prevMonth} className={`p-2  rounded-xl ${currentDate.isSame(minMonth, 'month') ? 'opacity-50 cursor-not-allowed' : ''}`} disabled={currentDate.isSame(minMonth, 'month')}>❮</button>
        <h2 className="text-xl font-bold">{currentDate.format('MMMM YYYY')}</h2>
        <button onClick={nextMonth} className={`p-2  rounded-xl ${currentDate.isSame(maxMonth, 'month') ? 'opacity-50 cursor-not-allowed' : ''}`} disabled={currentDate.isSame(maxMonth, 'month')}>❯</button>
      </div>
      <div className="grid grid-cols-7 gap-3 space-y-1 lg:space-y-2">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
          <div key={day} className="text-center text-lg py-1 font-semibold">
            {day}
          </div>
        ))}
        {emptyDays.map((_, index) => (
          <div key={index}></div>
        ))}
        {days.map((day) => {
            const date = currentDate.date(day);
            const isPastDate = date.isBefore(dayjs(), 'day');
            const isSelected = bookingData.selectedDate === date.format('YYYY-MM-DD');
            return (
              <div
          key={day}
          onClick={() => !isPastDate && selectDate(day)}
          className={`text-center p-2 text-lg lg:text-base  rounded-xl cursor-pointer transition-all duration-200 ease-in-out
            ${isPastDate ? 'text-gray-400 cursor-not-allowed' : ''}
            ${isSelected ? 'bg-gradient-to-r from-blue-400 to-blue-600 text-white  font-semibold shadow-md' : 'hover:bg-blue-100'}
          `}
          
        >
                {day}
              </div>
            );
          })}
      </div>
    </div>*/}

   <div className="w-full max-w-[98%] sm:max-w-[90%] md:max-w-[690px] xl:w-[600px] m-auto mt-6 py-4 sm:px-5 md:p-6 lg:ml-30 bg-white rounded-2xl shadow-md transition-all duration-300 backdrop-blur-md border border-white/40  hover:shadow-blue-100">
  <div className="flex justify-center items-center gap-8 mb-6">
    <button
      aria-label="Go to previous month" role="button"
      onClick={prevMonth}
      className={`p-2 rounded-full text-lg transition ${
        currentDate.isSame(minMonth, 'month') ? 'opacity-50 cursor-not-allowed' : ''
      }`}
      disabled={currentDate.isSame(minMonth, 'month')}
    >
      ❮
    </button>
    <h2 className="text-2xl font-bold text-gray-800">
      {currentDate.format('MMMM YYYY')}
    </h2>
    <button
      aria-label="Go to next month" role="button"
      onClick={nextMonth}
      className={`p-2 rounded-full text-lg  transition ${
        currentDate.isSame(maxMonth, 'month') ? 'opacity-50 cursor-not-allowed' : ''
      }`}
      disabled={currentDate.isSame(maxMonth, 'month')}
    >
      ❯
    </button>
  </div>

  <div className="grid grid-cols-7 gap-y-3 space-y-0.5">
    {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
      <div key={day} className="text-center text-lg lg:text-base font-semibold text-gray-600">
        {day}
      </div>
    ))}

    {emptyDays.map((_, index) => (
      <div key={index}></div>
    ))}

    {days.map((day) => {
      const date = currentDate.date(day);
      const isPastDate = date.isBefore(dayjs(), 'day');
      const isSelected = bookingData.selectedDate === date.format('YYYY-MM-DD');

      return (
         <div
          key={day}
          onClick={() => !isPastDate && selectDate(day)}
          className={`text-center p-2 text-lg lg:text-base  rounded-xl cursor-pointer transition-all duration-200 ease-in-out
            ${isPastDate ? 'text-gray-400 cursor-not-allowed' : ''}
            ${isSelected ? 'bg-gradient-to-r from-blue-400 to-blue-600 text-white  font-semibold shadow-md' : 'hover:bg-blue-100'}`}>
            {day}
         </div>
      );
    })}
  </div>
</div>

    {/*button for selected date 
    <div className="hidden xl:flex justify-between mt-3 ml-28">
  {
    bookingData.selectedDate && (
      <button 
        onClick={handleProceed}
        className="w-full bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-indigo-600 hover:to-blue-500 text-white px-6 py-4 rounded-lg disabled:bg-gray-400 flex justify-between items-center shadow-sm transition-all duration-300" 
        disabled={!bookingData.selectedDate}
      >
        <span className='flex gap-1 font-semibold'><CalendarDays size={23} className='items-center gap-1' />{new Date(bookingData.selectedDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' }).replace(/(\d{2}) (\w{3})/, '$1 $2\'')}{new Date(bookingData.selectedDate).getFullYear().toString().slice(-2)}</span>
        <span className='flex gap-1 font-semibold'>Proceed<ChevronRight  size={25}/></span>
      </button>
    )
   }
   </div>*/}

  {
    bookingData.selectedDate && ( 
  <div className="hidden xl:flex fixed bottom-4 left-1/2 transform -translate-x-1/2 w-[95%] md:w-[400px] bg-white shadow-xl hover:shadow-blue-50 rounded-xl p-4  justify-between items-center border border-gray-200  z-50 beating">
  <div className="text-left">
    <p className="text-sm font-semibold text-gray-500">Selected Date</p>
    <p className="text-lg font-bold text-blue-600">
      {dayjs(bookingData.selectedDate).format('DD MMM \'YY')}
    </p>
  </div>
  <div
    onClick={handleProceed}
    className="flex cursor-pointer bg-blue-600 hover:bg-blue-700 text-white items-center text-center font-semibold px-4 py-2 rounded-lg shadow transition "
  >
    Proceed 
    <ChevronRight size={26}/>
  </div>
</div>
    )}
   </div>

   {/*images */}
 <div className="hidden lg:flex w-full max-w-[680px] xl:max-w-[590px] mx-auto ml-30 xl:ml-7 px-4 xl:px-0">
  <div
    className="relative w-full overflow-hidden shadow-lg transition-all duration-300 mt-10"
    onMouseEnter={() => setIsHovered(true)}
    onMouseLeave={() => setIsHovered(false)}
  >
    {/* Image */}
    <img
      className="w-full h-[480px] object-cover rounded-sm"
      src={images[currentIndex].src}
      alt={images[currentIndex].alt}
      loading="eager"
      fetchpriority="high"
    />

    {/* Dot Indicators */}
    <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
      {images.map((_, index) => (
        <span
          key={index}
          onClick={() => goToSlide(index)}
          className={`h-1.5 w-1.5 rounded-full transition duration-300 cursor-pointer ${
            index === currentIndex ? 'bg-blue-600 scale-110 shadow' : 'bg-white/70 hover:bg-blue-400'
          }`}
        />
      ))}
    </div>
  </div>
</div>

    
    {bookingData.selectedDate && (
  <div className="fixed bottom-0 left-0 w-full shadow-md z-50 xl:hidden">
    <button
      onClick={handleProceed}
      className="bg-blue-500 text-white text-xl lg:text-2xl p-4 lg:py-7 w-full flex justify-between items-center"
    >
      <span className="flex gap-2 font-semibold">
        <CalendarDays size={30} className='items-center text-center'/>
        {new Date(bookingData.selectedDate).toLocaleDateString('en-GB', {
          day: '2-digit',
          month: 'short'
        }).replace(/(\d{2}) (\w{3})/, '$1 $2\'')}
        {new Date(bookingData.selectedDate).getFullYear().toString().slice(-2)}
      </span>
      <span className="flex gap-1 font-semibold">Proceed <ChevronRight size={30} className='items-center text-center'/></span>
    </button>
  </div>
)}
 </div>
  </motion.div>
</div>
  );
};

export default MonthlyCalendar;
