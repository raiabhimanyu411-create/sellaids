import React from "react";
import bgImage from "../../assets/images/cta-image.webp";
import { useNavigate } from 'react-router-dom';

export default function RefundReturnPolicySection() {
    const navigate = useNavigate();

    const handleSellClick = () => {
        navigate("/vendor/login");
    };
    return (
        <div>
            {/* Refund & Return Policy Content */}
            <section className="max-w-5xl mx-auto px-4 py-12 text-gray-800 text-[15px] leading-relaxed">
                <h1 className="text-3xl font-heading text-black leading-tight mt-2 ">
                    REFUND & RETURN POLICY
                </h1>

                {/* Eligibility for Returns */}
                <h2 className="text-2xl font-heading text-black mt-8 mb-4">Eligibility for Returns</h2>
                <p>
                    To be eligible for a return, we must receive notification within 24 hours of receiving the order. The following conditions apply:
                    <strong> Returns are accepted only if the product:</strong>
                </p>
                <ul className="list-disc ml-6 space-y-2 mt-2">
                    <li>Arrives in a damaged condition.</li>
                    <li>Is found to be counterfeit.</li>
                    <li>Is not delivered to the buyer.</li>
                    <li>Is not the same product as ordered.</li>
                    <li>Items purchased during sales or discounts are non-refundable.</li>
                    <li>
                        Products must be returned in the same condition as when received. This includes:
                        <ul className="list-disc ml-6 space-y-2 mt-2">
                            <li>Original tags are attached.</li>
                            <li>Notification within 24 hours of receiving the order.</li>
                        </ul>
                    </li>
                    <li>Any damage to the return tag will render the product non-returnable.</li>
                </ul>

                {/* Return Process */}
                <h2 className="text-2xl font-heading text-black mt-8 mb-4">Return Process</h2>
                <ul className="list-disc ml-6 space-y-2">
                    <li><strong>Initiating a Return:</strong> Contact Sellaids Support to initiate the return process.</li>
                    <li> You must share a video recording of the unboxing process, clearly showing the condition of the product upon receipt.</li>

                    <li><strong>Shipping Costs for Returns:</strong> Buyers are responsible for covering the return shipping costs unless the item is returned due to damage, counterfeit, or non-delivery.</li>
                    <li> Original shipping fees are non-refundable.</li>

                    <li><strong>Inspection Process:</strong> Once the product is returned, it will undergo a thorough inspection to confirm the validity of your claim.</li>
                    <li> If the issue (damaged, counterfeit or non-delivery) is confirmed, a refund will be processed.</li>
                </ul>

                {/* Refunds */}
                <h2 className="text-2xl font-heading text-black mt-8 mb-4">Refunds</h2>
                <ul className="list-disc ml-6 space-y-2">
                    <li>If the product is found to be counterfeit, we will process a full refund. You will need to provide official confirmation from the brand within 15 days (either via letterhead or email) that the item is not genuine.</li>
                    <li>For returns that pass our inspection, refunds will be processed within 7 business days.</li>
                    <li>In cases where the claim is not validated after inspection, no refund will be provided and the purchased product will be returned back to you at additional shipping cost.</li>
                </ul>

                {/* Non-returnable items */}
                <h2 className="text-2xl font-heading text-black mt-8 mb-4">Non-returnable Items</h2>
                <ul className="list-disc ml-6 space-y-2">
                    <li>Sale items or products purchased under a promotion are non-refundable.</li>
                    <li>Products showing colour discrepancies caused by digital photography are not eligible for returns.</li>
                    <li>Sellaids is not responsible for any product warranties, colour fading or change after the sale is completed.</li>
                </ul>

                {/* Disputes & Arbitration */}
                <h2 className="text-2xl font-heading text-black mt-8 mb-4">Disputes & Arbitration</h2>
                <p>In case of disputes, Sellaids will act as a mediator to resolve issues amicably between the buyer and seller. If an agreement cannot be reached, the matter will be escalated to arbitration and Sellaids’ decision will be final and binding.</p>

                {/* Special Cases */}
                <h2 className="text-2xl font-heading text-black mt-8 mb-4">Special Cases</h2>
                <ul className="list-disc ml-6 space-y-2">
                    <li>During pandemics or other extraordinary circumstances, we may temporarily suspend returns for specific product categories, such as apparel.</li>
                    <li>If an item fails our physical verification process after purchase, the buyer is entitled to a full refund minus any shipping fees.</li>
                </ul>

                {/* Condition of Returned Items */}
                <h2 className="text-2xl font-heading text-black mt-8 mb-4">Condition of Returned Items</h2>
                <ul className="list-disc ml-6 space-y-2">
                    <li>All returned items must be in the <strong>same condition as when received</strong>, without signs of use, wear or damage (including<strong> no alterations, modifications or repairs</strong> done after receiving the item).</li>
                    <li>Any products returned with <strong>signs of wear, damage or without original tags</strong> may be refused and Sellaids reserves the right to deduct an amount from the refund to cover the damage.</li>
                </ul>

                {/* Processing Time */}
                <h2 className="text-2xl font-heading text-black mt-8 mb-4">Processing Time for Returns</h2>
                <p>After receiving the returned item, Sellaids will complete the<strong> inspection within 3-5 business days.</strong> You will be notified of the status of your return via email.</p>

                {/* Items Not Eligible */}
                <h2 className="text-2xl font-heading text-black mt-8 mb-4">Items Not Eligible for Return</h2>
                <ul className="list-disc ml-6 space-y-2">
                    <li><strong>Personalized items</strong> or items that have been custom-altered or engraved are not eligible for returns or refunds.</li>
                    <li>Items marked as <strong>“Final Sale”</strong>at the time of purchase cannot be returned or refunded.</li>
                </ul>

                {/* Lost or Damaged */}
                <h2 className="text-2xl font-heading text-black mt-8 mb-4">Lost or Damaged Returns in Transit</h2>
                <p>Sellaids is not responsible for any <strong>lost or damaged returns</strong> that occur during the return shipping process. We recommend using a <strong>trackable shipping service</strong> and purchasing shipping insurance.</p>

                {/* Restocking Fees */}
                <h2 className="text-2xl font-heading text-black mt-8 mb-4">Restocking Fees</h2>
                <p>For high-value luxury items (such as bags, watches or jewellery) a <strong>restocking fee</strong> of up to <strong>15% of the item’s value</strong> may apply in case of returns, depending on the condition of the item.</p>

                {/* International Returns */}
                <h2 className="text-2xl font-heading text-black mt-8 mb-4">International Returns</h2>
                <p>For international returns, customers are responsible for any <strong>duties, taxes, and fees </strong>associated with shipping the item back to Sellaids. Ensure all international returns are properly labeled to avoid delays.</p>

                {/* Packaging Requirements */}
                <h2 className="text-2xl font-heading text-black mt-8 mb-4">Packaging Requirements for Returns</h2>
                <p>Items must be returned in the<strong> original packaging</strong> (or comparable protective packaging) to ensure they arrive safely and undamaged. Missing packaging may result in a deduction from the refund.</p>

                {/* Refund Method */}
                <h2 className="text-2xl font-heading text-black mt-8 mb-4">Refund Method</h2>
                <p>Refunds will be issued using the <strong>original payment method</strong> unless store credit or an alternative is requested by the buyer. In case of card payments, please allow <strong>5-10 business days </strong>for the refund to reflect in your account.</p>

                {/* Return During Sale Periods */}
                <h2 className="text-2xl font-heading text-black mt-8 mb-4">Return During Sale Periods</h2>
                <p>During promotional or sale periods, processing times for returns and exchanges may take longer due to higher volumes of transactions. We appreciate your patience.

                    For any further questions or concerns about returns or refunds, please contact our support team at{" "}
                    <a href="mailto:contact@sellaids.com" className="text-orange-600">
                        contact@sellaids.com
                    </a>
                    &nbsp;We’re here to assist you!
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

