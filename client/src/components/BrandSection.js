import React, { useState, useEffect } from 'react';
import chanel from '../assets/images/chanel.webp';
import lv from '../assets/images/lv.webp';
import coach from '../assets/images/coach.webp';
import gucci from '../assets/images/gucci.webp';
import mk from '../assets/images/mk.webp';
import tory from '../assets/images/tory.webp';

const brands = [
    { img: chanel, alt: "Chanel" },
    { img: lv, alt: "Louis Vuitton" },
    { img: coach, alt: "Coach" },
    { img: gucci, alt: "Gucci" },
    { img: mk, alt: "Michael Kors" },
    { img: tory, alt: "Tory Burch" },
];

function BrandSection() {
    const [currentIndex, setCurrentIndex] = useState(0);

    const goPrev = () => {
        setCurrentIndex((prev) => (prev === 0 ? brands.length - 1 : prev - 1));
    };

    const goNext = () => {
        setCurrentIndex((prev) => (prev === brands.length - 1 ? 0 : prev + 1));
    };

    // 🔹 Autoplay effect (only for mobile)
    useEffect(() => {
        const interval = setInterval(() => {
            goNext();
        }, 3000); // 3 seconds delay

        return () => clearInterval(interval);
    }, [currentIndex]);

    return (
        <section className="bg-white py-10 px-4 sm:px-8 lg:px-20">
            <h2 className="text-4xl sm:text-5xl font-heading text-black leading-tight text-center mb-10">
                Our Top Brands
            </h2>

            {/* Desktop grid */}
            <div className="hidden sm:flex flex-wrap justify-center items-center gap-x-14 gap-y-12">
                {brands.map((brand, index) => (
                    <img
                        key={index}
                        src={brand.img}
                        alt={brand.alt}
                        className="h-20 sm:h-24 object-contain"
                    />
                ))}
            </div>

            {/* Mobile single-logo carousel */}
            <div className="relative sm:hidden flex justify-center items-center">
                {/* Left Arrow */}
                <button
                    onClick={goPrev}
                    className="absolute left-4 top-1/2 -translate-y-1/2 bg-orange-500 text-white rounded-full w-10 h-10 flex items-center justify-center shadow"
                >
                    ‹
                </button>

                {/* Current Brand */}
                <img
                    src={brands[currentIndex].img}
                    alt={brands[currentIndex].alt}
                    className="h-24 object-contain transition-all duration-500"
                />

                {/* Right Arrow */}
                <button
                    onClick={goNext}
                    className="absolute right-4 top-1/2 -translate-y-1/2 bg-orange-500 text-white rounded-full w-10 h-10 flex items-center justify-center shadow"
                >
                    ›
                </button>
            </div>
        </section>
    );
}

export default BrandSection;
