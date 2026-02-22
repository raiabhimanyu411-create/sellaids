import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

import fashionAidImg from '../assets/images/fashion-aid.webp';
import designerAidImg from '../assets/images/designer-aid.webp';
import kidsAidImg from '../assets/images/kids-aid.webp';

const overlaySections = [
    {
        title: 'FASHION AID',
        img: fashionAidImg,
        buttonText: 'SHOP NOW',
        buttonLink: '/Fashionaids',
    },
    {
        title: 'DESIGNER AID',
        img: designerAidImg,
        buttonText: 'SHOP NOW',
        buttonLink: '/Designeraids',
    },
    {
        title: 'KIDS AID',
        img: kidsAidImg,
        buttonText: 'SHOP NOW',
        buttonLink: '/Kidsaids',
    },
];
function OverlaySection() {
    const navigate = useNavigate();

    const handleNavigate = (link) => {
        navigate(link);
    };
    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 px-4 md:px-20 my-8 md:my-12 py-6">
            {overlaySections.map(({ title, img, buttonText, buttonLink }, idx) => (
                <div
                    key={idx}
                    className="relative group h-[350px] md:h-[500px] overflow-hidden cursor-pointer"
                >
                    <img
                        src={img}
                        alt={title}
                        className="w-full h-full object-cover transition-transform duration-700 ease-in-out group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-50 group-hover:bg-opacity-60 transition-opacity duration-500"></div>
                    <div className="absolute inset-0 flex flex-col justify-center items-center text-white px-4">
                        <h2 className="text-2xl md:text-4xl font-heading tracking-wide mb-6 uppercase text-center">
                            {title}
                        </h2>
                        <button
                            onClick={() => handleNavigate(buttonLink)}
                            className="bg-orange-500 hover:bg-orange-600 transition-colors duration-300 px-6 py-3 text-sm font-semibold shadow"
                        >
                            {buttonText}
                        </button>
                    </div>
                </div>
            ))}
        </div>
    );
}

export default OverlaySection;