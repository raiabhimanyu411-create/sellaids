import React from "react";
import bgImage from "../../assets/images/cta-image.webp";
import { useNavigate } from 'react-router-dom';

export default function AdviceSellersSection() {
    const navigate = useNavigate();

    const handleSellClick = () => {
        navigate("/vendor/login"); 
    };
    return (
        <div>
            {/* Advice for Sellers Section */}
            <section className="max-w-5xl mx-auto px-4 py-10 text-gray-800 text-[15px] leading-relaxed">
                <h1 className="text-3xl font-heading text-black leading-tight mt-2 pb-2 text-center md:text-left">
                    ADVICE FOR SELLERS
                </h1>

                {/* 1 */}
                <h2 className="text-2xl font-heading text-black mt-6 mb-4">
                    Research Current Market Prices
                </h2>
                <p className="mb-6">
                    Before listing your product, conduct online research to understand
                    current market prices. You can send us screenshots of comparable
                    listings to support your pricing decisions. This will help you set a
                    competitive price and attract potential buyers.
                </p>

                {/* 2 */}
                <h2 className="text-2xl font-heading text-black mt-8 mb-4">
                    Pricing Recommendations
                </h2>
                <p>
                    To increase the likelihood of a sale, consider pricing your items based on their condition and estimated retail price:
                </p>
                <ul className="list-disc list-inside space-y-2 mb-6">
                    <li>
                        <strong>New without Tag:</strong> Price at about{" "}
                        <span className="font-semibold">30% below</span> the retail value.
                    </li>
                    <li>
                        <strong>Like New (without Tag):</strong> Price between{" "}
                        <span className="font-semibold">30% to 50% below</span> the retail
                        value.
                    </li>
                    <li>
                        <strong>Hardly Ever Used:</strong> Price around{" "}
                        <span className="font-semibold">50% to 60%</span> of the retail
                        value.
                    </li>
                    <li>
                        <strong>In Satisfactory or Good Condition:</strong> Price at{" "}
                        <span className="font-semibold">70% or more</span> of the retail
                        value.
                    </li>
                </ul>
                <p className="text-sm text-gray-600">
                    ★ Note: Pricing can vary significantly by brand, so adjust accordingly.
                </p>

                {/* 3 - 13 */}
                <h2 className="text-2xl font-heading text-black mt-8 mb-4">
                    Provide Detailed Descriptions
                </h2>
                <p>
                    Ensure your product descriptions are thorough and accurate. Include
                    measurements, materials and any unique features. High-quality images
                    can also enhance your listing.
                </p>

                <h2 className="text-2xl font-heading text-black mt-8 mb-4">
                    Photographing Your Product
                </h2>
                <p>
                    For best results, take product pictures against a white background.
                    This helps showcase the item clearly, making it more appealing to
                    potential buyers.
                </p>

                <h2 className="text-2xl font-heading text-black mt-8 mb-4">
                    Measure Accurately
                </h2>
                <p>
                    When listing, provide the correct size of your items after measuring
                    them accurately according to your description.
                </p>

                <h2 className="text-2xl font-heading text-black mt-8 mb-4">
                    Engage with the Sellaids Team
                </h2>
                <p>
                    Don’t hesitate to reach out for advice on pricing and selling
                    strategies. Our team is here to help you succeed.
                </p>

                <h2 className="text-2xl font-heading text-black mt-8 mb-4">
                    Use Clear, High-Quality Images
                </h2>
                <p>
                    Take multiple photos from different angles, including close-ups of any
                    unique features, tags or flaws. Good visuals can significantly impact
                    buyer interest.
                </p>

                <h2 className="text-2xl font-heading text-black mt-8 mb-4">
                    Be Honest About Condition
                </h2>
                <p>
                    Accurately describe any wear and tear. Transparency builds trust and
                    reduces the likelihood of disputes later.
                </p>

                <h2 className="text-2xl font-heading text-black mt-8 mb-4">
                    Consider Seasonal Trends
                </h2>
                <p>
                    Timing can affect sales. For instance, selling summer items in spring
                    can help capture buyers’ attention.
                </p>

                <h2 className="text-2xl font-heading text-black mt-8 mb-4">
                    Promote Your Listing
                </h2>
                <p>
                    Share your product on social media or relevant platforms to reach a
                    wider audience (Tagging Sellaids). The more visibility, the better the
                    chances of selling.
                </p>

                <h2 className="text-2xl font-heading text-black mt-8 mb-4">
                    Be Prepared for Negotiations
                </h2>
                <p>
                    Buyers may want to negotiate the price. Decide in advance how flexible
                    you are willing to be on your pricing.
                </p>

                <h2 className="text-2xl font-heading text-black mt-8 mb-4">
                    Review Policies Regularly
                </h2>
                <p>
                    Stay updated on Sellaids policies regarding listings, fees and returns
                    to ensure compliance and avoid surprises.
                </p>

                <h2 className="text-2xl font-heading text-black mt-8 mb-4">
                    Keep Your Product
                </h2>
                <p>
                    in the same condition and before pick up make sure that your product is thoroughly dry cleaned and safely packed.
                </p>
            </section>

            {/* ✅ CTA Section Bottom */}
            <section
                className="relative h-[400px] flex items-center justify-center md:justify-start bg-cover bg-center"
                style={{ backgroundImage: `url(${bgImage})` }}
            >
                {/* Overlay */}
                <div className="absolute inset-0 bg-black bg-opacity-30"></div>

                {/* Content */}
                <div className="relative z-10 px-6 md:pl-12 max-w-3xl text-center md:text-left">
                    <h2 className="text-white text-2xl sm:text-3xl md:text-4xl font-heading leading-snug">
                        Resell your luxury bags, designer outfits, menswear, kidswear, and
                        more — because fashion deserves a second life.
                    </h2>

                    <button onClick={handleSellClick} className="mt-6 px-6 py-3 bg-orange-500 text-white font-semibold rounded-lg shadow-md hover:bg-orange-600 transition">
                        START SELLING
                    </button>
                </div>
            </section>
        </div>
    );
}
