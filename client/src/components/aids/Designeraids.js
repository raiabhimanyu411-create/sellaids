// components/Designeraids.js

import React, { useEffect } from 'react';   // <-- useEffect added
import { Link } from 'react-router-dom';
import { FaClock, FaMoneyBillWave, FaLeaf } from 'react-icons/fa';
import {
  MdOutlineExplore,
  MdOutlineMap,
  MdOutlineVerifiedUser,
  MdOutlineLocalShipping,
} from 'react-icons/md';

// Import images
import IndianEdit from '../../assets/images/indianedit.webp';
import BoutiqueFit from '../../assets/images/Boutique-Fit.webp';
import Saree from '../../assets/images/Saree.webp';
import BespokeStudio from '../../assets/images/Bespoke-Studio.webp';
import EthnicAccessories from '../../assets/images/Ethnic-Accessories.webp';

import sellBanner1 from '../../assets/images/sellBanner1.webp';

const categories = [
  {
    title: 'INDIAN-EDIT',
    image: IndianEdit,
    link: 'http://localhost:5000product-category/women/designer-aid/indian-edit',
  },
  {
    title: 'BOUTIQUE FIT',
    image: BoutiqueFit,
    link: 'http://localhost:5000product-category/women/designer-aid/boutique-fit',
  },
  {
    title: 'SAREE',
    image: Saree,
    link: 'http://localhost:5000product-category/women/designer-aid/sarees',
  },
  {
    title: 'BESPOKE STUDIO',
    image: BespokeStudio,
    link: 'http://localhost:5000product-category/men/designer-aid-men/bespoke-studio',
  },
  {
    title: 'ETHNIC-ACCESSORIES',
    image: EthnicAccessories,
    link: 'http://localhost:5000product-category/women/designer-aid/ethnic-accessories',
  },
];

const whyChoose = [
  {
    icon: <FaClock className="text-4xl text-orange-500 mb-4 mx-auto" />,
    title: 'TIMELESS',
    description: 'Get the Designer pieces - crafted to last, both in quality and design.',
  },
  {
    icon: <FaMoneyBillWave className="text-4xl text-orange-500 mb-4 mx-auto" />,
    title: 'Affordable',
    description: 'Embrace designer products without compromising on style or authenticity.',
  },
  {
    icon: <FaLeaf className="text-4xl text-orange-500 mb-4 mx-auto" />,
    title: 'Sustainable',
    description: 'Reduce fashion waste, giving the premium items a new lease on life',
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

const Designeraids = () => {
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
            Designer Aid Collection
          </h1>
          <p className="text-xl text-gray-800 font-serif">
            Where Affordability Meets Elegance!
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
            Why Choose Sellaids?
          </h2>
          <p className="text-base sm:text-sm text-gray-700 mb-12 max-w-3xl mx-auto">
            Celebrate the art of sustainable style by connecting to authentic, high-quality designer pieces at a fraction of their original cost.
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
          backgroundImage: `url(${sellBanner1})`,
        }}
      >
        <div className="absolute inset-0 bg-black opacity-40"></div>

        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 text-left text-white">
          <h4 className="uppercase text-orange-400 tracking-widest mb-2 font-semibold text-sm sm:text-base">
            Selling Your most loved Designer items
          </h4>
          <h2 className="text-3xl sm:text-5xl font-heading mb-6 leading-tight">
            A hassle -free process to maintain the charm and value of designer items.
          </h2>
          <p className="max-w-2xl text-sm sm:text-base mb-8">
            Our team will assess your items and offer you the best market value,
            giving you the chance to refresh your collection or earn from pieces you no longer wear.
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
              <h3 className="font-semibold text-gray-900 mb-2">{step.title}</h3>
              <p className="text-gray-700 text-sm font-body">{step.description}</p>
            </div>
          ))}
        </div>
      </section>
    </>
  );
};

export default Designeraids;