import React, { useState } from "react";
import brandImage from "../../assets/images/brand-banner.webp";
import bgImage from "../../assets/images/cta-image.webp";

// brand logo images
import chanel from "../../assets/images/chanel.webp";
import louisVuitton from "../../assets/images/lv.webp";
import coach from "../../assets/images/coach.webp";
import gucci from "../../assets/images/gucci.webp";
import michaelKors from "../../assets/images/mk.webp";
import toryBurch from "../../assets/images/tory.webp";
import { useNavigate } from 'react-router-dom';

const tabs = [
    { id: "value", label: "VALUE" },
    { id: "mission", label: "OUR MISSION" },
    { id: "vision", label: "VISION" },
];

const TabContent = {
    value: (
        <div className="mt-6 text-gray-800 text-[15px] space-y-4 leading-relaxed">
            <p>
                <strong>Sustainability:</strong> At Sellaids, we understand that every
                purchase has an impact. By choosing preloved items, you’re not just
                acquiring unique, high-quality products; you’re actively participating
                in a movement towards a more sustainable future. Our curated collection
                of designer bags, accessories, and fashion reflects our commitment to
                reducing waste, minimizing the carbon footprint and promoting
                eco-friendly practices.
            </p>
            <p>
                <strong>Fashion with a Purpose:</strong> We believe that luxury should
                not come at the expense of our planet. By shopping with us, you are
                contributing to a greener world. Each item sold on Sellaids helps extend
                the lifecycle of luxury goods, reducing the demand for new production
                and decreasing waste. Together, we can combat global warming and its
                effects on climate change, making a positive difference one purchase at
                a time.
            </p>
            <p>
                <strong>Community and Connection:</strong> Sellaids is more than just a
                marketplace; it’s a community of like-minded individuals who share a
                passion for fashion and sustainability. We provide a platform where
                sellers can connect with buyers who appreciate the value of quality over
                quantity. Our commitment to authenticity and transparency ensures that
                every product you purchase has a story and a purpose.
            </p>
        </div>
    ),
    mission: (
        <div className="mt-6 text-gray-800 text-[15px] leading-relaxed">
            <p>
                Our mission is to revolutionize the way luxury fashion is consumed by
                encouraging the resale and purchase of high-quality, preloved designer
                pieces. We aim to create a positive impact on the environment by
                promoting the circular economy and reducing textile waste.
            </p>
        </div>
    ),
    vision: (
        <div className="mt-6 text-gray-800 text-[15px] leading-relaxed">
            <p>
                Our vision is to redefine luxury shopping by creating an accessible and
                responsible marketplace for preloved items. We aim to inspire a new
                generation of conscious consumers who understand the importance of
                making thoughtful purchasing decisions. By choosing Sellaids, you are
                not only elevating your style but also supporting a sustainable
                lifestyle.
            </p>
        </div>
    ),
};

export default function AboutTabs() {
    const [activeTab, setActiveTab] = useState("value");
    const navigate = useNavigate();

    const handleSellClick = () => {
        navigate("/vendor/login");
    };

    return (
        <>
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                {/* Tab Buttons */}
                <div className="flex flex-wrap justify-center gap-4 border-b border-gray-200 pb-4">
                    {tabs.map(({ id, label }) => (
                        <button
                            key={id}
                            onClick={() => setActiveTab(id)}
                            className={`px-6 py-2 font-semibold text-sm border rounded-sm transition-colors duration-200
              ${activeTab === id
                                    ? "bg-orange-500 text-white border-orange-500"
                                    : "text-black border-gray-300 hover:bg-orange-500 hover:text-white hover:border-orange-500"
                                }`}
                        >
                            {label}
                        </button>
                    ))}
                </div>

                {/* Tab Content */}
                <div className="mt-8">{TabContent[activeTab]}</div>

                {/* Brand Banner Image */}
                <div className="mt-10 px-4 sm:px-0">
                    <img
                        src={brandImage}
                        alt="Brand Banner"
                        className="w-full max-w-full h-auto object-cover"
                    />
                </div>

                {/* Join Us Section */}
                <div className="text-center py-16">
                    <h2 className="text-4xl font-normal text-gray-900">
                        JOIN US IN MAKING A DIFFERENCE
                    </h2>
                    <p className="max-w-3xl mx-auto mt-4 text-gray-700 leading-relaxed">
                        We invite you to explore our collection and join the movement towards
                        sustainable fashion. Together, we can change the way we shop and
                        contribute to a healthier planet. Let’s celebrate the beauty of
                        preloved fashion and make a positive impact on the world—one elegant
                        piece at a time.
                    </p>

                    {/* Brand Logos */}
                    <div className="flex flex-wrap justify-center items-center gap-10 mt-12">
                        <img src={chanel} alt="Chanel" className="h-28 object-contain" />
                        <img src={louisVuitton} alt="Louis Vuitton" className="h-28 object-contain" />
                        <img src={coach} alt="Coach" className="h-28 object-contain" />
                        <img src={gucci} alt="Gucci" className="h-28 object-contain" />
                        <img src={michaelKors} alt="Michael Kors" className="h-28 object-contain" />
                        <img src={toryBurch} alt="Tory Burch" className="h-28 object-contain" />
                    </div>
                </div>
            </section>
            <section
                className="relative h-[300px] sm:h-[400px] md:h-[500px] flex items-center justify-center md:justify-start bg-cover bg-center"
                style={{ backgroundImage: `url(${bgImage})` }}
            >
                {/* Overlay */}
                <div className="absolute inset-0 bg-black bg-opacity-30"></div>

                {/* Content */}
                <div className="relative z-10 px-6 md:pl-12 max-w-3xl text-center md:text-left">
                    <h2 className="text-white text-2xl sm:text-3xl md:text-4xl font-heading leading-snug">
                        Resell Your Luxury Bags, Designer Outfits, Menswear, Kidswear And
                        More—Because Fashion Deserves A Second Life.
                    </h2>

                    <button onClick={handleSellClick} className="mt-6 px-6 py-3 bg-orange-500 text-white font-semibold hover:bg-orange-600 transition">
                        SELL NOW
                    </button>
                </div>
            </section>
        </>
    );
}
