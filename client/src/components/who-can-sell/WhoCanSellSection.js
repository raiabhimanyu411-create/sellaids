import React from "react";
import bgImage from "../../assets/images/cta-image.webp";
import { useNavigate } from 'react-router-dom';

export default function WhoCanSellSection() {
    const navigate = useNavigate();

    const handleSellClick = () => {
        navigate("/vendor/login"); 
    };
    return (
        <div>
            {/* Who Can Sell Section */}
            <section className="max-w-5xl mx-auto px-4 py-12 text-gray-800 text-[15px] leading-relaxed">
                <h1 className="text-3xl font-heading text-black leading-tight mt-2 pb-6">
                    WHO CAN SELL?
                </h1>

                <p className="mb-6">
                    At Sellaids, we offer the ideal platform for those who want to sell
                    new goods or declutter their luxury goods to earn money from items
                    they no longer use. Whether you’re looking to grow your business with
                    us or refresh your wardrobe or downsize, here’s how you can benefit
                    from selling with us:
                </p>

                {/* Business Owners */}
                <h2 className="text-2xl font-heading text-black mt-8 mb-4">
                    Business Owners
                </h2>
                <p>
                    If you’re a small business owner with a collection of luxury and high
                    quality items like luxury shoes, bags or jewellery to kidswear and
                    designer apparel—Sellaids offers a platform to reach a broader
                    audience. Showcase your high-quality creations to a community that
                    values craftsmanship and luxury.{" "}
                    <strong>(Note: Only authentic items are allowed. No counterfeits or copies.)</strong>
                </p>

                {/* Unused Luxury Items */}
                <h2 className="text-2xl font-heading text-black mt-8 mb-4">
                    Unused Luxury Items
                </h2>
                <p>
                    If you have luxury bags, watches, belts, sunglasses, apparel, wallets,
                    shoes and more sitting unused in your closet, it’s time to give them a
                    second life. Sellaids offers a seamless process to list and sell your
                    luxury goods, letting someone else enjoy them while you earn money.
                </p>
                {/* Kids' Luxury Items */}
                <h2 className="text-2xl font-heading text-black mt-8 mb-4">
                    Kids' Luxury Items
                </h2>
                <p>
                    Children grow up fast and their luxury clothing, shoes and baby gear
                    can be quickly outgrown. Instead of letting those high-quality items
                    go unused, you can easily sell them on Sellaids. Give another family
                    the chance to enjoy your expensive kids’ gear and get a return on your
                    investment.
                </p>

                {/* Wedding and Boutique Wear */}
                <h2 className="text-2xl font-heading text-black mt-8 mb-4">
                    Wedding and Boutique Wear
                </h2>
                <p>
                    Expensive wedding outfits like lehngas, sherwanis, gowns and
                    boutique-style pieces are often only worn once. If your high-end
                    occasion wear is just sitting in storage, list it with us and let
                    someone else shine in your beautiful garments.
                </p>

                {/* Relocating Abroad */}
                <h2 className="text-2xl font-heading text-black mt-8 mb-4">
                    Relocating Abroad?
                </h2>
                <p>
                    If you’re moving abroad and have luxury items like designer clothes,
                    watches, handbags or shoes that you can’t take with you, Sellaids is
                    the perfect place to sell them. Lighten your load and make extra cash
                    while finding a new home for your designer goods.
                </p>

                {/* Refresh Wardrobe */}
                <h2 className="text-2xl font-heading text-black mt-8 mb-4">
                    Time to Refresh Your Wardrobe
                </h2>
                <p>
                    Bored with your current collection? Selling your gently used luxury
                    items on Sellaids allows you to clear space for new pieces while
                    earning money to invest in your next fashion finds.
                </p>

                {/* Changed Sizes */}
                <h2 className="text-2xl font-heading text-black mt-8 mb-4">
                    Changed Sizes? No Problem!
                </h2>
                <p>
                    Have you lost or gained weight and your luxury clothes no longer fit?
                    Don’t let them go unused. Sellaids lets you sell your high-end
                    garments to someone who will love and wear them.
                </p>

                {/* Eco-Friendly */}
                <h2 className="text-2xl font-heading text-black mt-8 mb-4">
                    Eco-Friendly Fashion
                </h2>
                <p>
                    Sellaids promotes sustainable fashion by giving preloved luxury goods
                    a second life. Instead of contributing to the growing problem of
                    fashion waste, you can reduce your carbon footprint by reselling items
                    that still hold value and quality.
                </p>

                {/* Earn Money */}
                <h2 className="text-2xl font-heading text-black mt-8 mb-4">
                    Earn Money Effortlessly
                </h2>
                <p>
                    Whether you’re selling a few pieces or a full collection, Sellaids
                    simplifies the process. With our platform, you can turn your luxury
                    items into cash without the hassle of complicated selling processes.
                    It’s an easy way to earn while growing your business or decluttering
                    your space.
                </p>

                {/* Reach Audience */}
                <h2 className="text-2xl font-heading text-black mt-8 mb-4">
                    Reach an Audience That Values Luxury
                </h2>
                <p>
                    At Sellaids, we connect you with buyers specifically seeking high-end,
                    luxury products. Whether you’re selling designer apparel, accessories
                    or unique luxury items, your goods will reach a discerning audience
                    who values quality and authenticity.
                </p>

                {/* Hassle Free */}
                <h2 className="text-2xl font-heading text-black mt-8 mb-4">
                    Hassle-Free Selling Experience
                </h2>
                <p>
                    Our platform is designed to make selling easy. From listing your items
                    to shipping them once sold, Sellaids offers dedicated support
                    throughout the process. We handle the complexities so you can enjoy a
                    stress-free selling experience.
                </p>

                {/* Safe & Secure */}
                <h2 className="text-2xl font-heading text-black mt-8 mb-4">
                    Sell Safely and Securely
                </h2>
                <p>
                    With our strict guidelines on authenticity, sellers can be confident
                    that their items are showcased to genuine buyers, while buyers know
                    they are purchasing authentic, high-quality goods. At Sellaids, trust
                    and transparency are at the heart of every transaction.
                </p>

                <p className="mt-6">
                    Whether you’re growing your business or you’re downsizing, changing
                    your style or simply looking to declutter, Sellaids offers the ideal
                    platform to sell your luxury goods. Join our community of sellers
                    today and start making profits.
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
