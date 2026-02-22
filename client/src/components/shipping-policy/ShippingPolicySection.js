import React from "react";
import bgImage from "../../assets/images/cta-image.webp";
import { useNavigate } from 'react-router-dom';

export default function ShippingPolicySection() {
    const navigate = useNavigate();

    const handleSellClick = () => {
        navigate("/vendor/login"); 
    };
    return (
        <div>
            {/* ShippingPolicySection Content */}
            <section className="max-w-5xl mx-auto px-4 py-12 text-gray-800 text-[15px] leading-relaxed">
                <h1 className="text-3xl font-heading text-black leading-tight mt-2 pb-6">
                    SHIPPING POLICY
                </h1>

                <p className="mb-6">
                    At <strong>Sellaids</strong>, we strive to ensure a smooth and transparent shopping experience. When purchasing pre-loved items from our platform, please keep in mind that many products may show signs of previous use. We encourage you to thoroughly review all images and product descriptions before making your purchase to avoid any misunderstandings. If you have any doubts, feel free to reach out to our team for clarification prior to purchase.
                </p>

                {/* Domestic Shipping */}
                <h2 className="text-2xl font-heading text-black mt-8 mb-4">Domestic Shipping</h2>

                <h3 className="font-semibold mt-4">Shipping Charges:</h3>
                <p>Shipping costs within India will vary based on the delivery location and will be calculated at checkout.</p>

                <h3 className="font-semibold mt-4">Delivery Timeframe:</h3>
                <p>We aim to dispatch all domestic orders within 7 to 10 working days of purchase. Delivery times may vary, but most orders within India will be completed within 15 working days. For the Delhi/NCR region, delivery typically takes 7 to 10 days from the purchase date.</p>

                <h3 className="font-semibold mt-4">Cash on Delivery (COD):</h3>
                <p>We offer Cash on Delivery services throughout India. For more assistance or inquiries about COD, please contact our Team at <a href="mailto:contact@sellaids.com" className="text-orange-600">contact@sellaids.com</a>.</p>

                {/* Shipping and Import Costs */}
                <h2 className="text-2xl font-heading text-black mt-8 mb-4">Shipping and Import Costs</h2>

                <h3 className="font-semibold mt-4">International Orders:</h3>
                <p>Import duties, taxes and customs fees are not included in the product price. These additional costs are the responsibility of the buyer and must be paid upon order placement. We recommend contacting your local customs office for information on potential fees before placing an order.</p>

                <h3 className="font-semibold mt-4">Delivery Timeframe:</h3>
                <p>International orders may take between 20 to 25 working days from the date of dispatch to arrive. We aim to dispatch orders within 7 to 10 working days of purchase, but delivery times can vary depending on customs and local postal services.</p>

                {/* Return Policy */}
                <h2 className="text-2xl font-heading text-black mt-8 mb-4">Return Policy</h2>
                <p>As we understand the nature of preloved products, no returns shall be accepted unless:</p>
                <ul className="list-disc ml-6 space-y-2 mt-2">
                    <li>The item received is not in the same condition mentioned.</li>
                    <li>The item received is incorrect.</li>
                    <li>The item is found to be counterfeit.</li>
                </ul>
                <p className="mt-2">
                    In these situations only, return requests must be made within 24 hours of delivery along with an unboxing video (mandatory). Without this, the sale will be considered final and no return request will be entertained.
                </p>
                <p className="mt-2">
                    Returned items must be in their original condition, including all packaging, bills, and tags. Otherwise, the return will not be accepted. Return shipping costs will be borne by the customer (both ways).
                </p>

                {/* Important Notes */}
                <h2 className="text-2xl font-heading text-black mt-8 mb-4">Important Notes</h2>
                <ul className="list-disc ml-6 space-y-2">
                    <li>Please check return eligibility before making a purchase.</li>
                    <li>Products are sold as-is, and no express or implied warranties are provided.</li>
                    <li>While we verify product authenticity, we do not guarantee performance, functionality, or durability.</li>
                    <li>An unboxing video is mandatory for requesting returns. Email <a href="mailto:contact@sellaids.com" className="text-orange-600">contact@sellaids.com</a> within 24 hours of delivery.</li>
                </ul>

                {/* Delays and Processing */}
                <h2 className="text-2xl font-heading text-black mt-8 mb-4">Departure Times and Potential Delays</h2>

                <h3 className="font-semibold mt-4">Order Processing:</h3>
                <p>We make every effort to dispatch orders within 7 to 10 working days of purchase. However, delays may occur due to logistical or customs issues. We’ll keep you updated if your order is affected.</p>

                <h3 className="font-semibold mt-4">Delays and Delivery Guarantees:</h3>
                <p>Domestic orders are typically delivered within 15 days, and international ones may take up to 25 days post-dispatch. While we aim to meet these timelines, Sellaids cannot be held liable for unexpected delays caused by shipping providers or customs clearance.</p>
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
