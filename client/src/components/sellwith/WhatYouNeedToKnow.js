import React from 'react';
import { DollarSign, Truck, Headphones } from 'lucide-react';
import sellFashionImage from '../../assets/images/sellfashion.webp'; // Adjust path if needed

const WhatYouNeedToKnow = () => {
    const items = [
        {
            icon: <DollarSign />,
            title: 'Fees',
            description:
                'Our commission and fixed Fees is transparent, with no hidden fees. You can review the details in our Pricing section.',
        },
        {
            icon: <Truck />,
            title: 'Shipping',
            description:
                'We will handle Shipping for individual sellers. Business sellers own shipping for their products to customers.',
        },
        {
            icon: <Headphones />,
            title: 'Support',
            description:
                'We provide dedicated support to help you succeed. Our team is available for any questions you may have.',
        },
    ];

    return (
        <section className="py-10 md:py-16 px-4 bg-white text-left">
            <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-12 items-center">
                {/* Left Image */}
                <div>
                    <img
                        src={sellFashionImage}
                        alt="Info Visual"
                        className="w-full aspect-[4/3] md:h-[400px] lg:h-[500px] object-cover rounded-lg"
                    />
                </div>

                {/* Right Content */}
                <div>
                    <h2 className="text-2xl md:text-3xl lg:text-4xl font-heading uppercase mb-8 md:mb-10 text-center md:text-left">
                        WHAT YOU NEED TO KNOW?
                    </h2>

                    <div className="space-y-8 md:space-y-10">
                        {items.map((item, idx) => (
                            <div key={idx} className="flex items-start space-x-4">
                                <div className="bg-orange-500 w-12 h-12 rounded-full flex items-center justify-center shrink-0">
                                    {React.cloneElement(item.icon, {
                                        className: 'w-6 h-6 text-white',
                                    })}
                                </div>
                                <div>
                                    <h3 className="text-lg md:text-xl font-medium font-heading text-gray-900 mb-1 tracking-wide">
                                        {item.title}
                                    </h3>
                                    <p className="text-gray-700 text-sm md:text-base leading-relaxed">
                                        {item.description}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default WhatYouNeedToKnow;
