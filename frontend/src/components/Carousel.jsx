import React, { useRef } from "react";
import { Navigation, Pagination, Autoplay, Mousewheel } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/autoplay";

const Coursel = () => {
  const swiperRef = useRef(null);

  return (
    <div className="relative">
      <Swiper
        ref={swiperRef}
        modules={[Navigation, Pagination, Autoplay, Mousewheel]}
        autoplay={{ delay: 5000 }}
        pagination={{ clickable: true }}
        navigation
        mousewheel
        loop
        className="w-full h-[500px]"
      >
 <SwiperSlide>
  <div className="relative w-full h-full bg-hero-pattern flex items-center">
    <div className="absolute inset-0 bg-black opacity-40"></div>
    <div className="container mx-auto px-6 z-10 text-white">
      <div className="max-w-2xl space-y-4">
        <h3 className="text-xl font-semibold text-yellow-400">
          Explore the Future of Learning
        </h3>
        <h1 className="text-4xl md:text-5xl font-bold leading-tight">
          Learn with Expert Instructors, Anytime, Anywhere
        </h1>
        <p className="text-lg text-gray-200">
          We offer flexible learning options to help you reach your potential, all from the comfort of your home.
        </p>
        <div className="flex space-x-4 pt-4">
          <button className="px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-md font-medium transition-colors">
            Find Courses
          </button>
          <button className="px-6 py-3 bg-transparent border-2 border-white hover:bg-white hover:text-gray-900 rounded-md font-medium transition-colors">
            Explore more
          </button>
        </div>
      </div>
    </div>
  </div>
</SwiperSlide>
<SwiperSlide>
  <div className="relative w-full h-full bg-hero-pattern flex items-center">
    <div className="absolute inset-0 bg-black opacity-40"></div>
    <div className="container mx-auto px-6 z-10 text-white">
      <div className="max-w-2xl space-y-4">
        <h3 className="text-xl font-semibold text-yellow-400">
          Unlock New Skills Today
        </h3>
        <h1 className="text-4xl md:text-5xl font-bold leading-tight">
          Upgrade Your Knowledge with Industry Experts
        </h1>
        <p className="text-lg text-gray-200">
          Join our platform to gain in-demand skills and transform your career with expert-led courses.
        </p>
      </div>
    </div>
  </div>
</SwiperSlide>
<SwiperSlide>
  <div className="relative w-full h-full bg-hero-pattern flex items-center">
    <div className="absolute inset-0 bg-black opacity-40"></div>
    <div className="container mx-auto px-6 z-10 text-white">
      <div className="max-w-2xl space-y-4">
        <h3 className="text-xl font-semibold text-yellow-400">
          Learning at Your Own Pace
        </h3>
        <h1 className="text-4xl md:text-5xl font-bold leading-tight">
          Master New Skills Without Leaving Your Home
        </h1>
        <p className="text-lg text-gray-200">
          Access high-quality online courses that allow you to learn at your own pace, from anywhere.
        </p>
      </div>
    </div>
  </div>
</SwiperSlide>
      </Swiper>
      
    </div>
  );
};

export default Coursel;