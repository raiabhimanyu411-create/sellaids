import React, { useState } from 'react';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import '../App.css'; 
import vogueImage1 from '../assets/images/image1.webp';
import vogueImage2 from '../assets/images/image2.webp';
import vogueImage3 from '../assets/images/image3.webp';
import vogueImage4 from '../assets/images/image4.webp';
import { useNavigate } from 'react-router-dom';

function VogueSection() {
    const images = [vogueImage1, vogueImage2, vogueImage3, vogueImage4];
    const [currentIndex, setCurrentIndex] = useState(0);
    const [prevIndex, setPrevIndex] = useState(0);
    const [direction, setDirection] = useState('right');

    const navigate = useNavigate();

    const handleNavigate = () => {
        navigate("/shop"); 
    };

    const goPrev = () => {
        setDirection('left');
        setPrevIndex(currentIndex);
        setCurrentIndex(currentIndex === 0 ? images.length - 1 : currentIndex - 1);
    };

    const goNext = () => {
        setDirection('right');
        setPrevIndex(currentIndex);
        setCurrentIndex(currentIndex === images.length - 1 ? 0 : currentIndex + 1);
    };

    const getTransform = (index) => {
        if (index === currentIndex) return 'translateX(0%)';
        if (index === prevIndex) return direction === 'right' ? 'translateX(-100%)' : 'translateX(100%)';
        return direction === 'right' ? 'translateX(100%)' : 'translateX(-100%)';
    };

    return (
        <section className="flex flex-col md:flex-row items-center justify-between px-4 sm:px-8 md:px-20 py-8 md:py-16 bg-white max-w-[1440px] mx-auto">
            {/* Left side image carousel */}
            <div className="relative w-full md:w-[55%] h-[280px] sm:h-[400px] md:h-[500px] overflow-hidden">
                <div className="slider-container h-full">
                    {images.map((img, index) => (
                        <img
                            key={index}
                            src={img}
                            alt={`Slide ${index}`}
                            className={`slide-image object-cover w-full h-full ${index === currentIndex ? 'slide-enter' : 'slide-exit'}`}
                            style={{ transform: getTransform(index) }}
                        />
                    ))}
                </div>

                {/* Left Arrow */}
                <button
                    onClick={goPrev}
                    className="absolute left-2 sm:left-4 top-1/2 transform -translate-y-1/2 bg-white hover:bg-orange-500 text-black hover:text-white transition-colors p-2 sm:p-3 shadow z-30 rounded-full"
                    aria-label="Previous image"
                >
                    <ArrowLeft size={18} className="sm:w-5 sm:h-5" />
                </button>

                {/* Right Arrow */}
                <button
                    onClick={goNext}
                    className="absolute right-2 sm:right-4 top-1/2 transform -translate-y-1/2 bg-white text-black hover:bg-orange-500 hover:text-white transition-colors p-2 sm:p-3 shadow z-30 rounded-full"
                    aria-label="Next image"
                >
                    <ArrowRight size={18} className="sm:w-5 sm:h-5" />
                </button>
            </div>

            {/* Right side text content */}
            <div className="w-full md:w-[45%] text-center md:text-left mt-8 md:mt-0 px-2 sm:px-4 md:px-8">
                <p className="text-sm sm:text-base tracking-widest uppercase text-gray-500">Royal Reverie</p>
                <h2 className="text-3xl sm:text-4xl md:text-6xl font-heading text-black leading-snug sm:leading-tight mt-3">
                    Vogue that Speak of Opulence
                </h2>
                <p className="text-gray-600 mt-4 text-base sm:text-lg">
                    Curating a better world of luxury and affordability
                </p>
                <button onClick={handleNavigate} className="mt-6 bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 uppercase text-sm sm:text-base font-semibold tracking-wide">
                    Discover Now
                </button>
            </div>
        </section>
    );
}

export default VogueSection;
