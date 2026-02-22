import React from 'react';
import { Link } from 'react-router-dom';
import ctaImage from '../assets/images/cta-image.webp';

function CTASection() {
    return (
        <>
            {/* Desktop View - Jaise pehle tha (unchanged) */}
          <section className="hidden md:block relative h-[550px] w-full overflow-hidden bg-center bg-cover"
                style={{ backgroundImage: `url(${ctaImage})` }}>
                <div className="absolute inset-0 bg-black/30"></div>
                <div className="absolute inset-0 flex flex-col justify-center items-start px-6 md:px-20 text-white">
                    <p className="uppercase text-sm tracking-widest font-medium mb-4">
                        declutter, cash in and stay ahead !!!
                    </p>
                    <h2 className="text-4xl md:text-5xl font-heading max-w-2xl leading-tight mb-6">
                        Sell Your Preowned Collection With Us Today -<br />
                        Simple, Secure And Rewarding.
                    </h2>
                    <Link
                        to="/vendor/login"
                        className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-4 py-4 rounded-full font-semibold transition shadow-lg"
                    >
                        Sell Now
                    </Link>
                </div>
            </section>

            {/* Mobile View - Sirf mobile pe dikhega (image + overlay + text) */}
            <section className="md:hidden relative h-[500px] w-full bg-cover bg-center"
                style={{ backgroundImage: `url(${ctaImage})` }}>
                {/* Dark Overlay */}
                <div className="absolute inset-0 bg-black/50"></div>

                {/* Content */}
                <div className="relative z-10 flex flex-col justify-center items-start h-full px-6 py-10 text-white">
                    <p className="uppercase text-xs tracking-wider font-medium mb-3">
                        DECLUTTER, CASH IN AND STAY AHEAD !!!
                    </p>
                    <h2 className="text-3xl md:text-4xl font-heading leading-snug mb-6">
                        Sell Your Preowned Collection With Us Today - Simple, Secure And Rewarding.
                    </h2>
                    <Link
                        to="/vendor/login"
                        className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-4 rounded-full font-bold text-lg transition transform hover:scale-105 shadow-xl"
                    >
                        Sell Now
                    </Link>
                </div>
            </section>
        </>
    );
}

export default CTASection;