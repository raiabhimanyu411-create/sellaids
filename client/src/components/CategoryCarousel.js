import React, { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

import cat1 from "../assets/images/cat1.webp";
import cat2 from "../assets/images/cat2.webp";
import cat3 from "../assets/images/cat3.webp";
import cat4 from "../assets/images/cat4.webp";
import cat5 from "../assets/images/cat5.webp";
import cat6 from "../assets/images/cat6.webp";
import cat7 from "../assets/images/cat7.webp";
import cat8 from "../assets/images/cat8.webp";
import cat9 from "../assets/images/cat9.webp";
import cat10 from "../assets/images/cat10.webp";
import cat11 from "../assets/images/cat11.webp";
import cat12 from "../assets/images/cat12.webp";
import cat13 from "../assets/images/cat13.webp";

const categories = [
    { name: "Saree", img: cat1, link: "/product-category/women/designer-aid/sarees" },
    { name: "Indian Edit", img: cat2, link: "/product-category/women/designer-aid/indian-edit" },
    { name: "Men Apparel", img: cat3, link: "/product-category/men/fashion-aid-men/apparel-men" },
    { name: "Men Shoes", img: cat4, link: "/product-category/men/fashion-aid-men/shoes-men" },
    { name: "Bespoke Studio", img: cat5, link: "/product-category/men/designer-aid-men/bespoke-studio" },
    { name: "Ethnic Accessories", img: cat6, link: "/product-category/women/designer-aid/ethnic-accessories" },
    { name: "Baby Gear", img: cat7, link: "/product-category/kids/baby-gear" },
    { name: "Kids Boys", img: cat8, link: "/product-category/kids/boys" },
    { name: "Kids Girls", img: cat9, link: "/product-category/kids/girls" },
    { name: "Men Watches", img: cat10, link: "/product-category/men/fashion-aid/accessories/watches" },
    { name: "Women Apparel", img: cat11, link: "/product-category/women/fashion-aid/apparel" },
    { name: "Boutique Fit", img: cat12, link: "/product-category/women/designer-aid/boutique-fit" },
    { name: "Women Bags", img: cat13, link: "/product-category/women/fashion-aid/bags" },
];

function CategoryCarousel() {
    const scrollRef = useRef(null);
    const [currentIndex, setCurrentIndex] = useState(0);
    const navigate = useNavigate();

    const scroll = (direction) => {
        const container = scrollRef.current;
        if (!container) return;
        const itemWidth = container.offsetWidth / 6;
        const scrollAmount = itemWidth * 6;

        container.scrollBy({
            left: direction === "left" ? -scrollAmount : scrollAmount,
            behavior: "smooth",
        });
    };

    const prevSlide = () => {
        setCurrentIndex((prev) =>
            prev === 0 ? categories.length - 1 : prev - 1
        );
    };

    const nextSlide = () => {
        setCurrentIndex((prev) =>
            prev === categories.length - 1 ? 0 : prev + 1
        );
    };

    const handleNavigate = (path) => {
        navigate(path);
    };

    return (
        <div className="relative w-full bg-white py-6 mt-10">
            {/* Desktop View */}
            <div className="hidden md:block relative">
                <button
                    className="absolute left-2 top-1/2 -translate-y-1/2 z-10 bg-orange-500 text-white rounded-full w-10 h-10 flex items-center justify-center"
                    onClick={() => scroll("left")}
                >
                    &#8592;
                </button>

                <div className="overflow-hidden px-16">
                    <div
                        ref={scrollRef}
                        className="flex gap-6 scroll-smooth no-scrollbar"
                        style={{
                            overflowX: "auto",
                            scrollBehavior: "smooth",
                        }}
                    >
                        {categories.map((cat, index) => (
                            <div
                                key={index}
                                className="flex flex-col items-center flex-shrink-0 w-1/6 max-w-[240px] cursor-pointer"
                                onClick={() => handleNavigate(cat.link)} 
                            >
                                <div className="w-48 h-48 rounded-full overflow-hidden border-2 border-gray-200 shadow-lg">
                                    <img
                                        src={cat.img}
                                        alt={cat.name}
                                        className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
                                    />
                                </div>
                                <p className="mt-2 text-sm font-semibold text-center text-black">
                                    {cat.name}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>

                <button
                    className="absolute right-2 top-1/2 -translate-y-1/2 z-10 bg-orange-500 text-white rounded-full w-10 h-10 flex items-center justify-center"
                    onClick={() => scroll("right")}
                >
                    &#8594;
                </button>
            </div>

            {/* Mobile View */}
            <div className="md:hidden relative w-full flex flex-col items-center">
                <div
                    className="w-60 h-60 rounded-full overflow-hidden border-2 border-gray-200 shadow-lg cursor-pointer"
                    onClick={() => handleNavigate(categories[currentIndex].link)}  // FIXED
                >
                    <img
                        src={categories[currentIndex].img}
                        alt={categories[currentIndex].name}
                        className="w-full h-full object-cover"
                    />
                </div>
                <p
                    className="mt-2 text-base font-semibold text-center text-black cursor-pointer"
                    onClick={() => handleNavigate(categories[currentIndex].link)} // FIXED
                >
                    {categories[currentIndex].name}
                </p>

                <button
                    onClick={prevSlide}
                    className="absolute top-1/2 left-4 -translate-y-1/2 bg-orange-500 text-white rounded-full w-10 h-10 flex items-center justify-center"
                >
                    ❮
                </button>

                <button
                    onClick={nextSlide}
                    className="absolute top-1/2 right-4 -translate-y-1/2 bg-orange-500 text-white rounded-full w-10 h-10 flex items-center justify-center"
                >
                    ❯
                </button>
            </div>
        </div>
    );
}

export default CategoryCarousel;