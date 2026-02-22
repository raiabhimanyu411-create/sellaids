import React from 'react';
import heroImg from '../../assets/images/about-hero.webp';

const AboutHero = () => {
    return (
        <section className="py-16 bg-white">
            <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-10 px-6 md:px-10">

                {/* Image */}
                <div className="w-full md:w-1/2">
                    <div className="overflow-hidden rounded-t-full">
                        <img
                            src={heroImg}
                            alt="Fashion Hero"
                            className="w-full h-auto object-cover"
                            loading="lazy" // for performance
                        />
                    </div>
                </div>

                {/* Text */}
                <div className="w-full md:w-1/2 text-gray-800">
                    <h2 className="text-3xl md:text-5xl font-heading text-black leading-tight mt-2 pb-7 text-center md:text-left">
                        Journey Into Glamour,<br />Discover Your Signature Style.
                    </h2>

                    <p className="text-[17px] leading-7 mb-6 font-sans text-center md:text-left max-w-lg mx-auto md:mx-0">
                        Welcome to <strong>Sellaids</strong>, where we believe in transforming the way we shop by embracing the
                        beauty of new and value of preloved fashion products. In a world increasingly defined by fast fashion and
                        disposable goods, we are dedicated to changing the narrative around consumption.
                    </p>

                    <p className="text-[17px] leading-7 mb-8 font-sans text-center md:text-left max-w-lg mx-auto md:mx-0">
                        Our mission is to inspire a shift in mindset—one that recognizes the elegance and sustainability of buying preloved.
                    </p>

                    {/* <div className="flex justify-center md:justify-start">
                        <button className="bg-orange-500 hover:bg-orange-600 text-white font-semibold px-6 py-3 rounded">
                            DISCOVER NOW
                        </button>
                    </div> */}
                </div>
            </div>
        </section>
    );
};

export default AboutHero;
