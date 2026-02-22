import React from 'react';
import bannerImage from '../../assets/images/sell-banner.webp';
import { useNavigate } from 'react-router-dom';

const CallToActionSection = () => {
    const navigate = useNavigate();

    const handleSellClick = () => {
        navigate("/vendor/login"); 
    };
    return (
        <section
            className="relative bg-cover bg-center h-[60vh] md:h-[70vh] lg:h-[80vh] text-white"
            style={{ backgroundImage: `url(${bannerImage})` }}
        >
            {/* Overlay */}
            <div className="absolute inset-0 bg-black/50 z-0"></div>

            {/* Content */}
            <div className="relative z-10 flex items-center justify-center md:justify-start h-full px-4 sm:px-8 md:px-16">
                <div className="max-w-xl text-center md:text-left">
                    <p className="text-xs sm:text-sm tracking-widest uppercase mb-3 sm:mb-4 font-medium">
                        Start Selling Today!
                    </p>

                    <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-heading uppercase mb-6 sm:mb-8">
                        Your Loved Items Deserve <br className="hidden sm:block" /> A New Home
                    </h1>

                    <p className="text-sm sm:text-base md:text-lg font-light mb-5 sm:mb-6">
                        Sell your luxury items effortlessly and get the best value. Let your treasures shine.
                    </p>

                    <div>
                        <button onClick={handleSellClick} className="bg-orange-500 hover:bg-orange-600 text-white font-medium px-5 sm:px-6 py-2.5 sm:py-3 rounded-sm shadow-md transition">
                            SELL NOW
                        </button>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default CallToActionSection;
