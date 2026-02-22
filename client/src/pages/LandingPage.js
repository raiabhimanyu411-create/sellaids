import React, { useState, useEffect } from 'react';
import '../App.css';

import img1 from '../assets/images/img1.webp';
import img2 from '../assets/images/img2.webp';
import img3 from '../assets/images/img3.webp';
import img4 from '../assets/images/img4.webp';
import img5 from '../assets/images/img5.webp';
import img6 from '../assets/images/img6.webp';

import Popup from '../components/Popup';
import CategoryCarousel from '../components/CategoryCarousel';
import OverlaySection from '../components/OverlaySection';
import Bestsellers from '../components/Bestsellers';
import VogueSection from '../components/VogueSection';
import Feature from '../components/Feature';
import LuxuryHighlight from '../components/LuxuryHighlight';
import CTASection from '../components/CTASection';
import BrandSection from '../components/BrandSection';
import ImageGallery from '../components/ImageGallery';
import InfluencerSection from '../components/InfluencerSection';
import Seo from '../components/Seo';

function LandingPage() {
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const [currentIndex, setCurrentIndex] = useState(0);

    const images = [img1, img2, img3, img4, img5, img6];

    useEffect(() => {
        const timer = setTimeout(() => setIsPopupOpen(true), 300);
        return () => clearTimeout(timer);
    }, []);

    useEffect(() => {
        const autoplayTimer = setInterval(() => {
            setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
        }, 3000);
        return () => clearInterval(autoplayTimer);
    }, [images.length]);

    const closePopup = () => setIsPopupOpen(false);

    const prevSlide = () => {
        setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
    };

    const nextSlide = () => {
        setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
    };

    return (
        <>
            <Seo
                title="Sellaids — Sell Your Preowned Collection"
                description="Sell Your Preowned Collection With Us Today - Simple, Secure And Rewarding."
                image={img4}
            />

            {/* Top Marquee */}
            <div className="bg-orange-500 text-white overflow-hidden whitespace-nowrap mt-[2px]">
                <div className="inline-flex animate-marquee py-3" style={{ animationDuration: '40s' }}>
                    <span className="mx-4">
                        Up to 70% off from original price on all items &nbsp; &nbsp; | &nbsp; &nbsp;
                        Up to 70% off from original price on all items &nbsp; &nbsp; | &nbsp; &nbsp;
                        Up to 70% off from original price on all items
                    </span>
                    <span className="mx-4">
                        Up to 70% off from original price on all items &nbsp; &nbsp; | &nbsp; &nbsp;
                        Up to 70% off from original price on all items &nbsp; &nbsp; | &nbsp; &nbsp;
                        Up to 70% off from original price on all items
                    </span>
                </div>
            </div>

            {/* Image Banner */}
            <div className="image-banner w-screen flex overflow-hidden m-0 p-0 relative">

                {/* Desktop View */}
                <div className="hidden md:flex w-full">
                    {images.map((img, i) => (
                        <div key={i} className="image-item">
                            <img src={img} alt={`Banner ${i + 1}`} className="w-full h-auto object-cover block" />
                        </div>
                    ))}
                </div>

                {/* Mobile/Tablet View */}
                <div className="relative w-full h-[400px] md:hidden overflow-hidden">
                    <img
                        src={images[currentIndex]}
                        alt={`Banner ${currentIndex + 1}`}
                        className="w-full h-full object-cover block"
                    />
                    {/* Left Arrow */}
                    <button
                        onClick={prevSlide}
                        className="absolute top-1/2 left-4 -translate-y-1/2 bg-black/50 text-white p-3 rounded-full"
                    >
                        ❮
                    </button>

                    {/* Right Arrow */}
                    <button
                        onClick={nextSlide}
                        className="absolute top-1/2 right-4 -translate-y-1/2 bg-black/50 text-white p-3 rounded-full"
                    >
                        ❯
                    </button>

                    {/* Marquee Overlap on Mobile */}
                    <div className="absolute bottom-0 left-0 w-full bg-orange-500 text-white overflow-hidden">
                        <div
                            className="flex animate-marquee whitespace-nowrap items-center text-[16px] font-normal font-poppins tracking-wide "
                            style={{ animationDuration: '40s' }}
                        >
                            {[...Array(4)].map((_, i) => (
                                <React.Fragment key={i}>
                                    <span className="mx-12">**FLAUNT IT**</span>
                                    <span className="mx-12">**USE IT**</span>
                                    <span className="mx-12">**SET IT FREE**</span>
                                    <span className="mx-12">**FIND IT**</span>
                                </React.Fragment>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Desktop Only: Same Marquee Below Banner */}
            <div className="hidden md:block w-full bg-orange-500 text-white overflow-hidden">
                <div
                    className="flex animate-marquee whitespace-nowrap items-center text-[16px] font-normal font-poppins tracking-wide"
                    style={{ animationDuration: '20s' }}
                >
                    {[...Array(2)].map((_, i) => (
                        <React.Fragment key={i}>
                            <span className="mx-12">**FLAUNT IT**</span>
                            <span className="mx-12">**USE IT**</span>
                            <span className="mx-12">**SET IT FREE**</span>
                            <span className="mx-12">**FIND IT**</span>
                        </React.Fragment>
                    ))}
                </div>
            </div>

            {/* Popup */}
            {isPopupOpen && <Popup onClose={closePopup} />}

            <div className="-mt-20 md:mt-0">

                {/* Other Sections */}
                <CategoryCarousel />
                <OverlaySection />
                <InfluencerSection />
                <Feature />
                <Bestsellers />
                <VogueSection />
                <CTASection />
                <LuxuryHighlight />
                <BrandSection />
                <ImageGallery />

            </div>
        </>
    );
}

export default LandingPage;