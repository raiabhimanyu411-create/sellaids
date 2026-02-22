// src/components/aids/Kidsaids.js
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
import Boys from '../../assets/images/boys.webp';
import Girls from '../../assets/images/girls.webp';
import BabyGear from '../../assets/images/Baby-Gear.webp';
import sellBanner2 from '../../assets/images/sellBanner2.webp';

const categories = [
  {
    title: 'BOYS',
    image: Boys,
    link: 'http://localhost:5000product-category/kids/boys',
  },
  {
    title: 'GIRLS',
    image: Girls,
    link: 'http://localhost:5000product-category/kids/girls',
  },
  {
    title: 'BABY GEAR',
    image: BabyGear,
    link: 'http://localhost:5000product-category/kids/baby-gear',
  },
];

const whyChoose = [
  {
    icon: <FaClock className="text-4xl text-orange-500 mb-4 mx-auto" />,
    title: 'Budget-Friendly',
    description:
      'Invest in high-quality products at a fraction of the price without sacrificing on quality.',
  },
  {
    icon: <FaMoneyBillWave className="text-4xl text-orange-500 mb-4 mx-auto" />,
    title: 'Quality',
    description:
      'Ensuring high standards of safety, durability, and cleanliness with each product.',
  },
  {
    icon: <FaLeaf className="text-4xl text-orange-500 mb-4 mx-auto" />,
    title: 'Sustainable',
    description:
      'Support a sustainable future for the kids—just a simple way to teach value of reuse and responsibility.',
  },
];

const howItWorks = [
  {
    icon: <MdOutlineExplore className="text-orange-500 w-12 h-12 mx-auto mb-4" />,
    title: 'BROWSE & SELECT',
    description:
      'Explore our exclusive collection of preloved fashion items with high-res images.',
  },
  {
    icon: <MdOutlineMap className="text-orange-500 w-12 h-12 mx-auto mb-4" />,
    title: 'SUSTAINABILITY FIRST',
    description:
      'Each purchase helps extend product life and supports responsible consumption.',
  },
  {
    icon: <MdOutlineVerifiedUser className="text-orange-500 w-12 h-12 mx-auto mb-4" />,
    title: 'EXPERT AUTHENTICATION',
    description:
      'Our team verifies each item to ensure quality and authenticity.',
  },
  {
    icon: <MdOutlineLocalShipping className="text-orange-500 w-12 h-12 mx-auto mb-4" />,
    title: 'FAST & SECURE SHIPPING',
    description:
      'Your order is packed and shipped securely to reach you in pristine condition.',
  },
];

const Kidsaids = () => {

  // ⭐⭐⭐ Scroll to top added
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      {/* Heading */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-12 mt-10 sm:mt-20">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-heading text-orange-600 leading-tight mb-6 md:mb-4">
            Kids Aid Collection
          </h1>
          <p className="text-xl text-gray-800 font-serif">
            Where Parenting Meets Sustainability!
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

      {/* Why Choose */}
      <section
        className=" py-16 px-4 sm:px-6 lg:px-8"
        style={{ backgroundColor: '#E9E9E966' }}
      >
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-heading text-orange-500 mb-2">
            Why Choose Sellaids?
          </h2>
          <p className="text-base sm:text-sm text-gray-700 mb-12 max-w-3xl mx-auto">
            Encourage smart parenting—save money, embrace sustainability, and provide the best with our pre-loved collection.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12">
            {whyChoose.map((item, index) => (
              <div key={index} className="text-center">
                {item.icon}
                <h3 className="text-orange-500 font-semibold mb-2">
                  {item.title}
                </h3>
                <p className="text-gray-700 ">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Banner */}
      <section
        className="relative bg-cover bg-center bg-no-repeat h-[550px] flex items-center"
        style={{
          backgroundImage: `url(${sellBanner2})`,
        }}
      >
        <div className="absolute inset-0 bg-black opacity-40"></div>

        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 text-left text-white">
          <h4 className="uppercase text-orange-400 tracking-widest mb-2 font-semibold text-sm sm:text-base">
            Selling Your most loved Kids items
          </h4>
          <h2 className="text-3xl sm:text-5xl font-heading mb-6 leading-tight">
            Your most loved items could be just what another family needs — and it’s great for the planet!
          </h2>
          <p className="max-w-2xl text-sm sm:text-base mb-8">
            We’ll assess your items and offer the best value so you can refresh or earn from pieces you no longer need.
          </p>
          <Link
            to="/vendor/login"
            className="inline-block bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 font-semibold text-sm shadow transition"
          >
            Sell Now
          </Link>
        </div>
      </section>

      {/* How it works */}
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

export default Kidsaids;