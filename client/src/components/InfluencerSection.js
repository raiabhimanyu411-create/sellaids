import React from 'react';
import mainInfluencerImage from '../assets/images/Influencer.png';      
import facebookIcon from '../assets/images/icons8-facebook-100.png';
import instagramIcon from '../assets/images/icons8-instagram-100.png';

const InfluencerSection = () => {
  return (
    <section className="relative min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-yellow-50 overflow-hidden">
      
      <div className="relative z-10 max-w-7xl mx-auto px-6 py-16 lg:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          
          {/* Left Side - Text Content */}
          <div className="space-y-8 flex flex-col justify-center h-full">
            <h1 className="text-3xl sm:text-4xl md:text-6xl font-heading text-black leading-snug sm:leading-tight mt-3">
              Influencers Build a <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-pink-600">
                Big Vision
              </span>{' '}
              Over Time
            </h1>

            <p className="text-[15px] text-gray-700 max-w-lg">
              Become a vendor on our platform and turn your influence into sales by showcasing and selling your products.
            </p>

            <div className="flex flex-wrap gap-4">
              <a
                href="/vendor/login"
                className="group inline-flex items-center gap-3 bg-gradient-to-r from-orange-500 to-pink-600 text-white font-bold px-8 py-4 rounded-full text-lg shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300"
              >
               Start Selling Now
              </a>
            </div>

            <div className="grid grid-cols-3 gap-4 pt-4">
              <div>
                <h3 className="text-3xl sm:text-4xl md:text-4xl font-heading text-black leading-snug sm:leading-tight">79k+</h3>
                <p className="text-gray-600">Video Views</p>
              </div>
              <div>
                <h3 className="text-3xl sm:text-4xl md:text-4xl font-heading text-black leading-snug sm:leading-tight">12k+</h3>
                <p className="text-gray-600">Followers</p>
              </div>
              <div>
                <h3 className="text-3xl sm:text-4xl md:text-4xl font-heading text-black leading-snug sm:leading-tight">34k+</h3>
                <p className="text-gray-600">Likes</p>
              </div>
            </div>
          </div>

          {/* Right Side - Image + Icons (Perfectly Aligned & Equal Space) */}
          <div className="relative flex justify-center lg:justify-center h-full items-center">
            <div className="relative">
              
              <img 
                src={mainInfluencerImage}
                alt="Influencer"
                className="w-full max-w-lg object-cover"
              />

              {/* Floating Social Icons */}
              <div className="absolute -right-4 lg:-right-8 top-1/2 -translate-y-1/2 flex flex-col gap-4">
                
                <a 
                  href="https://www.facebook.com/sellaidsofficial/?rdid=a4y0ZYIZDXzfaVoT" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-14 h-14 bg-blue-600 rounded-2xl flex items-center justify-center shadow-2xl hover:scale-110 transition-all duration-300"
                >
                  <img src={facebookIcon} alt="Facebook" className="w-8 h-8" />
                </a>

                <a 
                  href="https://www.instagram.com/sellaidsluxe/?igsh=MWxqcWxjM2hxdm9tMA%3D%3D&utm_source=qr" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-14 h-14 bg-gradient-to-br from-pink-500 to-orange-500 rounded-2xl flex items-center justify-center shadow-2xl hover:scale-110 transition-all duration-300"
                >
                  <img src={instagramIcon} alt="Instagram" className="w-8 h-8" />
                </a>

              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default InfluencerSection;