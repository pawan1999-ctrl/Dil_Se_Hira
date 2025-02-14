import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import { Pagination, Autoplay } from "swiper/modules";


const Navbar = () => {
  return (
    <>
      {/* Navbar */}
      <nav className="w-full bg-gradient-to-br from-red-500 to-white backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto relative">
          <div className="flex justify-between items-center py-4 px-6 relative">
            
            {/* Logo Positioned to Extend Downward */}
            <div className="absolute top-1/2 -translate-y-1/4 left-0 right-0 mx-auto z-50 pointer-events-none">
              <img src="/nobg.png" alt="Logo" className="w-40 md:w-48 lg:w-56 h-auto" />
            </div>

            {/* Navigation Links */}
           
            {/* Icons Section */}

          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="relative ">
        <Swiper
          spaceBetween={30}
          centeredSlides={true}
          autoplay={{ delay: 3000, disableOnInteraction: false }}
          pagination={{ clickable: true }}
          modules={[Pagination, Autoplay]}
          className="max-w-6xl h-[300px]"
        >
          <SwiperSlide>
            <img src="/coverimage.png" alt="Slide 1" className="w-full h-full " />
          </SwiperSlide>
          <SwiperSlide>
            <img src="/coverimage.png" alt="Slide 2" className="w-full h-full " />
          </SwiperSlide>
          <SwiperSlide>
            <img src="/coverimage.png" alt="Slide 3" className="w-full h-full " />
          </SwiperSlide>
        </Swiper>
      </div>
    </>
  );
};

export default Navbar;
