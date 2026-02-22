import React from "react";
import bgImage from "../../assets/images/cta-image.webp";
import { useNavigate } from 'react-router-dom';

export default function WeDontSellSection() {
    const navigate = useNavigate();

    const handleSellClick = () => {
        navigate("/vendor/login"); 
    };
    return (
        <div>
            {/* We Don’t Sell Section */}
            <section className="max-w-5xl mx-auto px-4 py-12 text-gray-800 text-[15px] leading-relaxed">
                <h1 className="text-3xl font-heading text-black leading-tight mt-2 pb-6">
                    WE DON’T SELL
                </h1>

                <p className="mb-6">
                    At Sellaids, we maintain a high standard for the quality of preloved
                    products sold on our platform. To ensure that our buyers have a
                    positive experience and receive items in excellent condition, we do
                    not allow the sale of the following types of items:
                </p>

                {/* Section 1 */}
                <h2 className="text-2xl font-heading text-black mt-8 mb-4">
                    1. Worn-out Clothing
                </h2>
                <p>
                    We do not accept any clothing that shows significant signs of wear and
                    tear. Specifically, we don’t sell clothes with the following defects:
                </p>
                <ul className="list-disc ml-6 space-y-2 mt-2">
                    <li>
                        <strong>Pilling:</strong> Fabrics with excessive fuzz or lint balls.
                    </li>
                    <li>
                        <strong>Fading:</strong> Cloths that have lost their original colour
                        vibrancy due to washing or sun exposure.
                    </li>
                    <li>
                        <strong>Shrunken Garments:</strong> Items that have been altered or
                        shrunk from their original size.
                    </li>
                    <li>
                        <strong>Stains or Odors:</strong> Items that have any visible stains,
                        discolouration or unpleasant odours.
                    </li>
                </ul>

                {/* Section 2 */}
                <h2 className="text-2xl font-heading text-black mt-8 mb-4">
                    2. Damaged Items
                </h2>
                <p>
                    We do not allow any products that are damaged or incomplete. This
                    includes items with:
                </p>
                <ul className="list-disc ml-6 space-y-2 mt-2">
                    <li>
                        <strong>Rips or Holes:</strong> Clothes or accessories with tears,
                        holes or worn-out seams.
                    </li>
                    <li>
                        <strong>Missing Parts:</strong> Products that are missing key
                        components, such as buttons, zippers, clasps, straps etc.
                    </li>
                    <li>
                        <strong>Broken or Defective:</strong>

                        Items that are non-functional,
                        broken or in need of repair.
                    </li>
                    <li>
                        <strong>Cuts and Scuffs:</strong> Any visible cuts, scratches or
                        scuffs that reduce the quality or value of the item.
                    </li>
                </ul>

                {/* Section 3 */}
                <h2 className="text-2xl font-heading text-black mt-8 mb-4">
                    3. Counterfeit Products
                </h2>
                <p>
                    We have a zero-tolerance policy against counterfeit goods. Sellaids is
                    committed to providing an authentic marketplace for luxury goods.
                </p>
                <ul className="list-disc ml-6 space-y-2 mt-2">
                    <li>
                        <strong>No Counterfeits:</strong> If you list a counterfeit or
                        knockoff product, your account will be permanently banned from
                        Sellaids.
                    </li>
                    <li>
                        <strong>Reporting:</strong> We take counterfeit sales seriously. Any
                        seller found listing counterfeit items will be reported to the
                        relevant authorities, a fine of Rs.3000 will be charged and
                        necessary actions will be taken.
                    </li>
                </ul>
                <p className="mt-2">
                    Please ensure that all items you list are 100% authentic and come with
                    any necessary proof of purchase, such as receipts or certificates of
                    authenticity, to avoid issues.
                </p>

                {/* Section 4 */}
                <h2 className="text-2xl font-heading text-black mt-8 mb-4">
                    4. Unsafe or Recalled Items
                </h2>
                <p>
                    We do not sell any items that have been recalled by manufacturers or
                    pose a safety hazard to consumers. If an item has been part of a
                    recall, it is strictly prohibited from being sold on our platform.
                </p>

                {/* Section 5 */}
                <h2 className="text-2xl font-heading text-black mt-8 mb-4">
                    5. Personalized or Altered Goods
                </h2>
                <p>
                    We do not accept items that have been heavily personalized or altered
                    beyond recognition. This includes:
                </p>
                <ul className="list-disc ml-6 space-y-2 mt-2">
                    <li>
                        <strong>Monogrammed Items:</strong> Items with personalized
                        engravings, initials or names.
                    </li>
                    <li>
                        <strong>Heavily Customized:</strong> Items that have undergone major
                        alterations from their original design or function.
                    </li>
                </ul>
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
