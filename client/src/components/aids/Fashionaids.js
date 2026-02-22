// components/Fashionaids.js

import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaClock, FaMoneyBillWave, FaLeaf } from 'react-icons/fa';
import {
  MdOutlineExplore,
  MdOutlineMap,
  MdOutlineVerifiedUser,
  MdOutlineLocalShipping,
} from 'react-icons/md';

// Import images
import womenApparel from '../../assets/images/women-apparel.webp';
import womenBags from '../../assets/images/women-bags.webp';
import menApparel from '../../assets/images/men-apparel.webp';
import menShoes from '../../assets/images/men-shoes.webp';
import womenAccessories from '../../assets/images/women-accessories.webp';
import menAccessories from '../../assets/images/men-accessories.webp';
import womenShoes from '../../assets/images/women-shoes.webp';
import menBags from '../../assets/images/men-bags.webp';

import sellBanner from '../../assets/images/sell-banner1.webp';

const categories = [
  {
    title: 'WOMEN APPAREL',
    image: womenApparel,
    link: 'http://localhost:5000product-category/women/fashion-aid/apparel',
  },
  {
    title: 'WOMEN BAGS',
    image: womenBags,
    link: 'http://localhost:5000product-category/women/fashion-aid/bags',
  },
  {
    title: 'MEN APPAREL',
    image: menApparel,
    link: 'http://localhost:5000product-category/men/fashion-aid-men/apparel-men',
  },
  {
    title: 'MEN SHOES',
    image: menShoes,
    link: 'http://localhost:5000product-category/men/fashion-aid-men/shoes-men',
  },
  {
    title: 'WOMEN SHOES',
    image: womenShoes,
    link: 'http://localhost:5000product-category/women/fashion-aid/shoes',
  },
  {
    title: 'WOMEN ACCESSORIES',
    image: womenAccessories,
    link: 'http://localhost:5000product-category/women/fashion-aid/accessories',
  },
  {
    title: 'MEN ACCESSORIES',
    image: menAccessories,
    link: 'http://localhost:5000product-category/men/fashion-aid-men/accessories-men',
  },
  {
    title: 'MEN BAGS',
    image: menBags,
    link: 'http://localhost:5000product-category/men/fashion-aid-men/bags-men',
  },
];

const whyChoose = [
  {
    icon: <FaClock className="text-4xl text-orange-500 mb-4 mx-auto" />,
    title: 'TIMELESS',
    description: 'Crafted to last, both in quality and design.',
  },
  {
    icon: <FaMoneyBillWave className="text-4xl text-orange-500 mb-4 mx-auto" />,
    title: 'AFFORDABILITY',
    description: 'Own iconic designer products without the high price tag.',
  },
  {
    icon: <FaLeaf className="text-4xl text-orange-500 mb-4 mx-auto" />,
    title: 'ECO-CONSCIOUS',
    description: 'Reduce waste and prolong the life of your products.',
  },
];

const howItWorks = [
  {
    icon: <MdOutlineExplore className="text-orange-500 w-12 h-12 mx-auto mb-4" />,
    title: 'BROWSE & SELECT',
    description:
      'Explore our exclusive collection of preloved fashion items, each listed with detailed descriptions and high-resolution images.',
  },
  {
    icon: <MdOutlineMap className="text-orange-500 w-12 h-12 mx-auto mb-4" />,
    title: 'SUSTAINABILITY FIRST',
    description:
      'Every purchase you make helps contribute to a more sustainable future by extending the life of your products and supporting responsible consumption.',
  },
  {
    icon: <MdOutlineVerifiedUser className="text-orange-500 w-12 h-12 mx-auto mb-4" />,
    title: 'EXPERT AUTHENTICATION',
    description:
      'All items go through a rigorous authentication process by our specialists, ensuring that they meet the highest standards of authenticity and quality.',
  },
  {
    icon: <MdOutlineLocalShipping className="text-orange-500 w-12 h-12 mx-auto mb-4" />,
    title: 'FAST & SECURE SHIPPING',
    description:
      "Once you've selected your perfect piece, our team will carefully package and ship it to you, ensuring it arrives in pristine condition.",
  },
];

const Fashionaids = () => {


  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      {/* FASHION AID COLLECTION SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-12 mt-10 sm:mt-4">
        {/* Heading */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-heading text-orange-600 leading-tight mb-6 md:mb-4">
            Fashion Aid Collection
          </h1>
          <p className="text-xl text-gray-800 font-serif">
            Where Elegance Meets Sustainability!
          </p>
        </div>

        {/* Category Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((category, index) => (
            <div
              key={index}
              className="relative group overflow-hidden shadow hover:shadow-lg transition-shadow duration-300"
            >
              <img
                src={category.image}
                alt={category.title}
                className="w-full h-80 object-cover transform group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
                <Link
                  to={category.link}
                  className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 text-xs sm:text-sm font-semibold shadow whitespace-nowrap"
                >
                  {category.title}
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* WHY CHOOSE SELLAIDS SECTION */}
      <section
        className="py-16 px-4 sm:px-6 lg:px-8"
        style={{ backgroundColor: '#E9E9E966' }}
      >
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-heading text-orange-500 mb-2">
            WHY CHOOSE SELLAIDS?
          </h2>
          <p className="text-base sm:text-sm text-gray-700 mb-12 max-w-3xl mx-auto">
            Our carefully curated collection of preloved fashion products offers
            you the chance to own iconic designer pieces at a fraction of the
            price, without compromising on quality or style.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12">
            {whyChoose.map((item, index) => (
              <div key={index} className="text-center">
                {item.icon}
                <h3 className="text-orange-500 font-semibold mb-2">
                  {item.title}
                </h3>
                <p className="text-gray-700">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SELL BANNER SECTION */}
      <section
        className="relative bg-cover bg-center bg-no-repeat h-[550px] flex items-center"
        style={{
          backgroundImage: `url(${sellBanner})`,
        }}
      >
        <div className="absolute inset-0 bg-black opacity-40"></div>

        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 text-left text-white">
          <h4 className="uppercase text-orange-400 tracking-widest mb-2 font-semibold text-sm sm:text-base">
            Selling your highly loved fashion items
          </h4>
          <h2 className="text-3xl sm:text-5xl font-heading mb-6 leading-tight">
            A Seamless Process for Selling Authentic Fashion Items
          </h2>
          <p className="max-w-2xl text-sm sm:text-base mb-8">
            Our team will assess your items and offer you the best market value,
            giving you the chance to refresh your collection or earn from pieces
            you no longer wear.
          </p>
          <Link
            to="/vendor/login"
            className="inline-block bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 font-semibold text-sm shadow transition"
          >
            Sell Now
          </Link>
        </div>
      </section>

      {/* HOW IT WORKS SECTION */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
        <h2 className="text-4xl font-heading text-orange-500 text-center mb-10">
          HOW IT WORKS?
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 text-center max-w-7xl mx-auto">
          {howItWorks.map((step, index) => (
            <div key={index}>
              {step.icon}
              <h3 className="font-semibold text-gray-900 mb-2">
                {step.title}
              </h3>
              <p className="text-gray-700 text-sm font-body">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </section>
    </>
  );
};

export default Fashionaids;