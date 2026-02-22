import React from "react";
import bgImage from "../../assets/images/cta-image.webp";
import { useNavigate } from 'react-router-dom';

export default function TrustedPlatform() {
    const navigate = useNavigate();

    const handleSellClick = () => {
        navigate("/vendor/login");
    };

    return (
        <div>
            {/* Trusted Platform Content */}
            <section className="max-w-5xl mx-auto px-4 py-12 text-gray-800 text-[15px] leading-relaxed">
                <h1 className="text-3xl font-heading text-black leading-tight mt-2 pb-6">
                    TRUSTED PLATFORM
                </h1>

                <p className="mb-6">
                    At <strong>Sellaids</strong>, we know that the thrill of finding the perfect luxury item is often accompanied by
                    the concern of its authenticity. Our commitment to providing a secure shopping environment ensures that every
                    product listed on our platform has undergone rigorous checks for legitimacy.
                </p>

                <h2 className="text-2xl font-heading text-black leading-tight mt-2 pb-4">
                    OUR PROMISE OF AUTHENTICITY
                </h2>
                <p className="mb-6">
                    We understand the value of trust in the luxury market, especially when it comes to preloved goods. That’s why
                    we have established a thorough verification process that diligently scrutinizes each item before it is made
                    available for purchase. Our dedicated team works tirelessly to ensure that only genuine products are featured,
                    allowing you to shop with complete peace of mind.
                </p>

                <h2 className="text-2xl font-heading text-black leading-tight mt-2 pb-4">
                    KEY ASPECTS OF OUR AUTHENTICATION PROCESS
                </h2>

                <ul className="list-disc pl-6 space-y-4 mb-6">
                    <li>
                        <strong>Exceptional Craftsmanship:</strong><br />
                        Each luxury item is meticulously inspected for high-quality craftsmanship. Authentic brands take great pride
                        in the details, from flawless engravings to the sturdiness of hardware. We ensure that every component meets
                        the standards expected from premium products.
                    </li>
                    <li>
                        <strong>Unique Product Codes:</strong><br />
                        Authentic items are identified by specific product codes that verify their legitimacy. Our team cross-checks
                        these codes against trusted sources to ensure they correspond to genuine merchandise.
                    </li>
                    <li>
                        <strong>Zipper and Closure Analysis:</strong><br />
                        The quality of zippers is often a telltale sign of authenticity. Many luxury brands use custom zippers or
                        collaborate with renowned manufacturers. We examine each zipper for brand-specific characteristics to confirm
                        authenticity.
                    </li>
                    <li>
                        <strong>Precision Stitching:</strong><br />
                        Uniform stitching is essential in high-end fashion. Our experts are trained to detect any irregularities in
                        stitching that may indicate a counterfeit product, ensuring that every item meets luxury standards.
                    </li>
                    <li>
                        <strong>Logo Verification:</strong><br />
                        Every luxury brand has a signature logo, and we verify that each logo is correctly placed and executed. This
                        attention to detail helps affirm the authenticity of the item.
                    </li>
                </ul>

                <p className="mt-6">
                    At <strong>Sellaids</strong>, we are committed to being more than just a marketplace. We are your reliable
                    partner in the world of luxury, where authenticity meets sustainability. Enjoy the experience of discovering
                    exquisite preloved items, knowing that each one has been carefully vetted and verified for quality. Join us in
                    redefining luxury shopping for a better future.
                </p>
            </section>

            {/* ✅ Responsive CTA Section Bottom */}
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
        </div>
    );
}
