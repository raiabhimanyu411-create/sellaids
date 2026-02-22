import React, { useState } from 'react';
import faqImage from '../../assets/images/faq-image.webp';

const faqData = [
    {
        question: 'What types of products can I sell?',
        answer: 'We welcome all significant Luxury and Designer Brands. We accept all upscale clothing and accessories for adults, teenagers, and children. For more details, please contact our team on +918800425855',
    },
    {
        question: 'What is the procedure for your authentication?',
        answer: 'Our team verifies the authenticity of each product to ensure it meets our high standards for quality and luxury',
    },
    {
        question: "How do you ensure safety of Seller's contact information?",
        answer: 'We respect your privacy. Our Sellers’ and Buyers’ identities are kept private and secure.',
    },
    {
        question: 'Are there any setup fees?',
        answer: 'No! There are no setup fees. You only pay a small commission on each sale.',
    },
    {
        question: 'How do I get paid?',
        answer: 'Once your product is delivered you will receive payment through online payment mode in 7 working days.',
    },
];

const FAQSection = () => {
    const [activeIndex, setActiveIndex] = useState(0);

    const toggleFAQ = (index) => {
        setActiveIndex(activeIndex === index ? null : index);
    };

    return (
        <section className="max-w-6xl mx-auto px-6 py-12">
            {/* Centered heading */}
            <div className="text-center mb-10">
                <h2 className="text-3xl md:text-4xl font-serif font-semi">FAQ</h2>
                <div className="flex justify-center items-center space-x-1 mt-2">
                    <span className="w-1 h-1 bg-orange-500 rounded-full"></span>
                    <span className="w-1 h-1 bg-orange-500 rounded-full"></span>
                    <span className="w-6 h-1 bg-orange-500 rounded"></span>
                </div>
            </div>

            {/* FAQ content and image */}
            <div className="md:flex md:gap-12 items-stretch">
                {/* Left: FAQ list */}
                <div className="md:w-1/2 flex flex-col justify-between">
                    {faqData.map((item, index) => (
                        <div key={index} className="mb-4 border flex-grow">
                            <button
                                onClick={() => toggleFAQ(index)}
                                className={`
                                    flex justify-between items-center w-full p-4 font-medium transition-colors duration-300
                                    ${activeIndex === index
                                        ? 'bg-[rgba(254,111,39,0.98)] text-white'
                                        : 'bg-[#f1f1f1] text-[#4a4a4a] hover:bg-[rgba(254,111,39,0.98)] hover:text-white'
                                    }
                                `}
                            >
                                <span className="text-sm md:text-base text-left">
                                    {item.question}
                                </span>
                                <span className="text-xl font-bold select-none">
                                    {activeIndex === index ? '−' : '+'}
                                </span>
                            </button>
                            {activeIndex === index && (
                                <div className="bg-gray-100 text-black p-4 text-sm leading-relaxed">
                                    {item.answer}
                                </div>
                            )}
                        </div>
                    ))}
                </div>

                {/* Right: Image */}
                <div className="md:w-1/2 mt-8 md:mt-0">
                    <img
                        src={faqImage}
                        alt="FAQ Help"
                        className="w-full h-48 sm:h-64 md:h-[450px] object-cover shadow-lg"
                    />
                </div>
            </div>
        </section>
    );
};

export default FAQSection;
