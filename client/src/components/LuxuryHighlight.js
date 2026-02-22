import React from 'react';
import { useNavigate } from 'react-router-dom';

import luxury1 from '../assets/images/luxury1.webp';
import luxury2 from '../assets/images/luxury2.webp';
import luxury3 from '../assets/images/luxury3.webp';

const categories = [
  {
    title: 'Unveiling the Allure of Luxury',
    image: luxury1,
    buttonText: 'Shop Now',
    link: '/product-category/women/fashion-aid/bags', 
  },
  {
    title: 'Classic & Flamboyant',
    image: luxury2,
    buttonText: 'Shop Now',
    link: '/product-category/women/designer-aid',
  },
  {
    title: 'Embrace the Tailored Divinity',
    image: luxury3,
    buttonText: 'Shop Now',
    link: '/product-category/men/fashion-aid',
  },
];

function LuxuryHighlight() {
  const navigate = useNavigate();

  // 🔹 Navigate function
  const handleNavigate = (link) => {
    navigate(link);
  };

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 py-10 sm:py-16 grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Left big image */}
      <div
        className="relative group h-[300px] md:h-[624px] overflow-hidden cursor-pointer"
        onClick={() => handleNavigate(categories[0].link)} // ✅ Click whole block
      >
        <img
          src={categories[0].image}
          alt={categories[0].title}
          className="w-full h-full object-cover transform transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-black/40 flex flex-col justify-center p-6 sm:p-8">
          <h3 className="text-white text-2xl sm:text-3xl md:text-5xl font-heading leading-snug max-w-sm">
            {categories[0].title}
          </h3>
          <button
            onClick={(e) => {
              e.stopPropagation(); 
              handleNavigate(categories[0].link);
            }}
            className="mt-6 bg-orange-500 hover:bg-orange-600 text-white px-6 sm:px-8 py-3 rounded-full text-base sm:text-lg font-semibold tracking-wide w-fit flex items-center gap-2"
          >
            <span className="text-xl">→</span> {categories[0].buttonText}
          </button>
        </div>
      </div>

      {/* Right - two stacked images */}
      <div className="flex flex-col gap-6">
        {[1, 2].map((index) => (
          <div
            key={index}
            className="relative group h-[300px] md:h-[300px] overflow-hidden cursor-pointer"
            onClick={() => handleNavigate(categories[index].link)} // ✅ whole block clickable
          >
            <img
              src={categories[index].image}
              alt={categories[index].title}
              className="w-full h-full object-cover transform transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-black/40 flex flex-col justify-center p-6 sm:p-8">
              <h3 className="text-white text-xl sm:text-2xl md:text-4xl font-heading leading-snug max-w-xs">
                {categories[index].title}
              </h3>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleNavigate(categories[index].link);
                }}
                className="mt-4 bg-orange-500 hover:bg-orange-600 text-white px-6 sm:px-8 py-3 rounded-full text-base sm:text-lg font-semibold tracking-wide w-fit flex items-center gap-2"
              >
                <span className="text-xl">→</span> {categories[index].buttonText}
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default LuxuryHighlight;