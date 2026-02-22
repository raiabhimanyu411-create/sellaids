import React from 'react';

// Import images
import registerImg from '../../assets/images/register.webp';
import pricingImg from '../../assets/images/pricing.webp';
import listingImg from '../../assets/images/listing.webp';
import collectionImg from '../../assets/images/collection.webp';
import authenticationImg from '../../assets/images/authentication.webp';
import paymentImg from '../../assets/images/payment.webp';

const SellStepsSection = () => {
    const steps = [
        { image: registerImg, link: '#', alt: 'Register and Start Selling' },
        { image: pricingImg, link: '#', alt: 'Pricing and Evaluation' },
        { image: listingImg, link: '#', alt: 'Listing and Live' },
        { image: collectionImg, link: '#', alt: 'Collection of Products' },
        { image: authenticationImg, link: '#', alt: 'Authentication and Verification' },
        { image: paymentImg, link: '#', alt: 'Receive Payment' },
    ];

    return (
        <section className="py-16 px-4 bg-white text-center">
            <h2 className="text-2xl md:text-3xl font-heading uppercase mb-10">
                HOW TO SELL WITH US?
            </h2>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-6 gap-4 max-w-7xl mx-auto">
                {steps.map((step, index) => (
                    <a
                        href={step.link}
                        key={index}
                        className="transition-transform hover:scale-105 block"
                    >
                        {/* Different aspect ratios for devices */}
                        <div className="w-full aspect-square sm:aspect-[4/5] md:aspect-[3/4] overflow-hidden rounded-lg">
                            <img
                                src={step.image}
                                alt={step.alt}
                                className="w-full h-full object-cover object-center"
                            />
                        </div>
                    </a>
                ))}
            </div>
        </section>
    );
};

export default SellStepsSection;
