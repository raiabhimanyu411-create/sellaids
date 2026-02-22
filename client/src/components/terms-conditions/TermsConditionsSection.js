// src/components/terms-conditions/TermsConditionsSection.js
import React from "react";
import bgImage from "../../assets/images/cta-image.webp";
import { useNavigate } from 'react-router-dom';

const TermsConditionsSection = () => {
    const navigate = useNavigate();

    const handleSellClick = () => {
        navigate("/vendor/login"); 
    };
    return (
        <div>
            <section className="max-w-5xl mx-auto px-4 py-12 text-gray-800 text-[15px] leading-relaxed">
                <h1 className="text-3xl font-heading text-black leading-tight mt-2 pb-6">
                    TERMS & CONDITIONS
                </h1>

                <p className="mb-4">
                    Welcome to Sellaids, your trusted platform for buying and selling new and preloved fashion products. We are committed to providing a seamless and transparent experience for sellers and buyers. To ensure the highest standards of service, we have established the following terms and conditions for sellers and buyers. By listing your items on Sellaids, you agree to adhere to these guidelines, ensuring a smooth, efficient and fair transaction process.

                </p>

                <p className="mb-4">
                    Please carefully review the terms outlined below, which detail our expectations, procedures and policies to safeguard your interests while maintaining the integrity of our marketplace.
                </p>

                <h2 className="text-2xl font-heading text-black mt-6 mb-2">1. Acceptance of Terms And Guidelines</h2>
                <p className="mb-4">
                    By accessing or using the website, you acknowledge that you have read, understood and agree to be bound by these Terms and Conditions & Guidelines. If you do not agree to any part of these terms, you must immediately discontinue the use of the website.
                </p>
                <p className="mb-4">
                    Sellaids reserves the right to modify these Terms and Conditions at any time. We will notify users of any significant changes by updating the Terms and Conditions on our website. Your continued use of the website following any changes constitutes your acceptance of the updated Terms and Conditions.
                </p>

                <h2 className="text-2xl font-heading text-black mt-6 mb-2">2. Independent Nature of Brands</h2>
                <p className="mb-4">
                    Sellaids operates independently and is not officially affiliated with any of the brands whose products are sold on the platform unless expressly stated otherwise. All brand names and trademarks are the property of their respective owners. Sellers on the platform are required to provide genuine products and Sellaids performs due diligence to verify authenticity but cannot guarantee brand involvement or warranties.
                </p>

                <h2 className="text-2xl font-heading text-black mt-6 mb-2">3. Seller's Responsibilities</h2>

                <h3 className="font-semibold mt-4">3.1 Ownership and Legality</h3>
                <p className="mb-4">
                    By listing an item for sale, the seller warrants that they have full legal rights to the item, that the item is genuine and that its sale does not infringe any intellectual property or violate any applicable laws. It is the seller’s responsibility to ensure that they possess a clear title to the goods and that the items conform to all descriptions provided.
                </p>

                <h3 className="font-semibold mt-4">3.2 Product Inspection</h3>
                <p className="mb-4">
                    All items listed for sale on Sellaids must undergo a mandatory physical verification process. This is to confirm that the product is authentic, in the condition described by the seller and suitable for sale on the platform. If any item fails the verification process, it will be returned to the seller and the seller will be responsible for all associated return shipping costs.
                </p>

                <h3 className="font-semibold mt-4">3.3 Claim Period for Returned Items</h3>
                <p className="mb-4">
                    If an item is returned or fails verification, the seller must claim the product within a 14 day window. Failure to claim the item within this period will result in Sellaids no longer being responsible for storing the item and Sellaids can use the product anywhere they want. The product may be discarded or otherwise disposed of and no compensation will be provided to the seller.
                </p>

                <h3 className="font-semibold mt-4">3.4 Documentation</h3>
                <p className="mb-4">
                    Sellers are required to provide any documentation related to the product, including original receipts, packaging, authenticity certificates or any other proof that can help verify the legitimacy and origin of the item. Providing proper documentation may increase the value and sale potential of the product.
                </p>

                <p className="mb-4">
                    Any product which is above the amount of 10000, consignment will be signed between the seller and the company for pick up and verification/authentication as soon as it comes for listing and if that product is authentic the product will be listed and either returned back on seller’s expense or will be under consignment with the company for a period of 3 months.
                </p>

                <p className="mb-4">
                    In case the seller wants to extend the consignment to further time they need to inform the company for extending the period. In case the product is not authentic it will be returned back to the seller on the seller’s expenses and Rs. 1000 will be charged as a handling fee.
                </p>

                <h2 className="text-2xl font-heading text-black mt-6 mb-2">4. Buyer’s Responsibility</h2>
                <ul className="list-disc pl-6 space-y-2">
                    <li>Document the Unboxing Process: To avoid disputes during returns or refunds, record a video while opening the product.</li>
                    <li>Inspect Your Purchase Promptly: Check the item’s condition and report any issue within 24 hours to <a href="mailto:contact@sellaids.com" className="text-orange-600">contact@sellaids.com</a> or our WhatsApp number.</li>
                    <li>Ask Questions: Contact our team for clarifications before purchase.</li>
                    <li>Read Product Descriptions Carefully.</li>
                    <li>Check Return Policies Before Purchase.</li>
                    <li>Keep All Packaging: Essential for returns.</li>
                    <li>Be Mindful of Shipping Costs.</li>
                    <li>Be Patient: Allow time for processing and shipping.</li>
                    <li>Use Secure Payment Methods.</li>
                </ul>

                <h2 className="text-2xl font-heading text-black mt-6 mb-2">5. Buyer’s Rights</h2>
                <h3 className="font-semibold mt-4">5.1 Product Authenticity</h3>
                <p className="mb-4">
                    Sellaids takes every precaution to verify the authenticity of items listed for sale. However, due to the nature of secondhand/preloved goods, buyers should exercise their own judgment when making a purchase. If a product fails our physical verification process after purchase, the buyer will be informed and will receive a full refund.
                </p>

                <h3 className="font-semibold mt-4">5.2 Condition of Products</h3>
                <p className="mb-2">We provide descriptions of preloved product conditions based on a standardized grading system. These categories include:</p>
                <ul className="list-disc pl-6 space-y-1 mb-4">
                    <li><strong>New:</strong> Brand new items, unused and in original packaging.</li>
                    <li><strong>Almost New:</strong> Items that show minimal signs of use and are in excellent condition.</li>
                    <li><strong>Hardly Ever Used:</strong> Products that have been used very sparingly with minimal wear and no tear.</li>
                    <li><strong>Good:</strong> Items that show normal signs of wear but are still functional and in good condition.</li>
                    <li><strong>Satisfactory:</strong> Products that have been used extensively and show significant signs of wear but remain functional.</li>
                </ul>

                <p className="mb-4">
                    By purchasing an item, buyers acknowledge that the product may have been used and understand the condition as described in the listing.
                </p>
                <h2 className="text-2xl font-heading text-black mt-6 mb-2">6. Commissions and Fees</h2>

                <h3 className="font-semibold mt-4">6.1 Commission Rates</h3>
                <p className="mb-4">
                    Sellaids charges a commission fee on every sale made through the platform. The commission rates are as follows:
                </p>
                <ul className="list-disc pl-6 mb-4">
                    <li>Individual Sellers: 30% of the final sale price.</li>
                    <li>Business Sellers: 20% of the final sale price.</li>
                </ul>
                <p className="mb-4">
                    The commission fee will be automatically deducted from the total sale amount before the seller is paid. These rates are fixed and non-negotiable.
                </p>

                <h3 className="font-semibold mt-4">6.2 Payment Terms for Sellers</h3>
                <p className="mb-4">
                    Sellers will receive their payout within 7 business days of the buyer confirming receipt and satisfaction with the product. Payments will be processed via the method selected by the seller at the time of account registration.
                </p>

                <h3 className="font-semibold mt-4">6.3 Shipping Costs</h3>
                <p className="mb-4">
                    Sellers are responsible for covering shipping costs when returning items that have failed verification. The Sellaids team will assist in coordinating the return, but any costs incurred will be charged to the seller’s account. In the case of a product sale, shipping costs are typically included in the buyer’s checkout process unless otherwise agreed.
                </p>

                <h2 className="text-2xl font-heading text-black mt-6 mb-2">7. Listing and Sale Process</h2>

                <h3 className="font-semibold mt-4">7.1 Listing Your Products</h3>
                <p className="mb-4">
                    Once an item passes verification, it will be listed for sale on the Sellaids platform. There is no set time limit for how long a seller can keep their product listed. After a few months, sellers can consult with the Sellaids team to adjust the selling price to enhance the chances of a sale. Items may be featured in various product categories based on their condition and value.
                </p>

                <h3 className="font-semibold mt-4">7.2 Item Repairs</h3>
                <p className="mb-4">
                    If an item listed for sale requires repairs to improve its marketability or functionality, Sellaids will coordinate the repair process on behalf of the seller. The seller will be notified of the required repairs and associated costs before proceeding. Upon the seller’s approval, the repair will be carried out by professionals and the cost will be added to the seller’s account. The seller must cover the repair expenses in full before receiving their payout from the sale of the item.
                </p>

                <h2 className="text-2xl font-heading text-black mt-6 mb-2">8. Indemnification</h2>
                <p className="mb-4">
                    Sellers agree to indemnify and hold Sellaids harmless from any claims, damages or losses resulting from the sale of counterfeit or misrepresented products. By listing an item on Sellaids, sellers assume full responsibility for the authenticity and legality of the product.
                </p>

                <h2 className="text-2xl font-heading text-black mt-6 mb-2">9. Governing Law</h2>
                <p className="mb-4">
                    These Terms and Conditions are governed by and construed in accordance with the laws of India. Any legal disputes arising from the use of Sellaids shall be subject to the exclusive jurisdiction of the courts in Gurgaon, Haryana.
                </p>

                <h2 className="text-2xl font-heading text-black mt-6 mb-2">10. Fixed Fees</h2>
                <p className="mb-4">
                    In this section, the fixed fees applicable to the listing and sale of items on the Sellaids platform are clearly outlined. These fees depend on the sale price of the item and are essential to understand before listing your products.
                </p>
                <ul className="list-disc pl-6 mb-4 space-y-2">
                    <li>For items below ₹10,000, the seller and buyer will be charged a fixed fee of ₹50 on each product.</li>
                    <li>For items priced between ₹51,000 and ₹2,00,000, the seller will be charged a fixed fee of ₹250 and the buyer ₹150.</li>
                    <li>For items priced above ₹2,00,000, the seller will be charged ₹350 and the buyer ₹250.</li>
                </ul>
                <p className="mb-4">
                    The shipping cost will be calculated based on the delivery area. This is not a fixed amount and will depend on the location of the buyer and seller.
                </p>

                <h2 className="text-2xl font-heading text-black mt-6 mb-2">11. Seller's Responsibility</h2>
                <p className="mb-4">
                    If an item you’ve listed for sale becomes damaged or if you decide not to sell it anymore, it is your responsibility to notify Sellaids immediately.
                </p>
                <p className="mb-4">
                    Once notified, Sellaids will remove the listing from the website, ensuring that buyers do not accidentally purchase a damaged or unavailable product.
                </p>

                <h2 className="text-2xl font-heading text-black mt-6 mb-2">12. Miscellaneous</h2>
                <p className="mb-2">
                    <strong>Intellectual Property:</strong> All content on the Sellaids website, including text, graphics, logos and images, is the property of Sellaids and is protected by copyright laws. Users may not reproduce or distribute any part of the website without prior written consent.
                </p>
                <p className="mb-2">
                    <strong>Termination of Use:</strong> Sellaids reserves the right to terminate any user’s access to the platform without prior notice if they are found to violate any of these terms.
                </p>
                <p className="mb-4">
                    <strong>Cancellation:</strong> Once order is placed cancellation cannot be done.
                </p>


                <p className="mb-4">
                    Sellaids is just a platform connecting buyer and seller and has no role to play with brands. Sellaids take all possible precautions to verify the product but buyer should exercise their own judgment when making any purchase.
                </p>

                <p className="mb-4">
                    Welcome to Sellaids. Your use of the Sellaids and services and tools are governed by the following terms and conditions (“Terms of Use”) as applicable to the Sellaids including the applicable policies which are incorporated herein by way of reference. By mere use of the Sellaids, You shall be contracting with Stylekins  Private Limited, the owner of the Platform. These terms and conditions including the policies constitute Your binding obligations, with Sellaids.

                    For the purpose of these Terms of Use, wherever the context so requires “You” or “User” shall mean any natural or legal person who has agreed to become a buyer on Platform by providing data while registering on the Platform as Registered User. The term “Sellaids”,”We”,”Us”,”Our” shall mean Stylekins Private Limited and its affiliates.

                    When You use any of the services provided by Us through the Platform, You will be subject to the rules, guidelines, policies, terms, and conditions applicable to such service, and they shall be deemed to be incorporated into this Terms of Use and shall be considered as part and parcel of this Terms of Use. We reserve the right, at Our sole discretion, to change, modify, add or remove portions of these Terms of Use, at any time without any prior written notice to You. You shall ensure to review these Terms of Use periodically for updates/changes. Your continued use of the Platform following the posting of changes will mean that You accept and agree to the revisions. As long as You comply with these Terms of Use, We grant You a personal, non-exclusive, non-transferable, limited privilege to enter and use the Platform. By impliedly or expressly accepting these Terms of Use, You also accept and agree to be bound by Sellaids Policies including but not limited to Privacy Policy as amended from time to time.
                </p>
                <h2 className="text-2xl font-heading text-black mt-6 mb-2">1. User Account, Password, and Security</h2>
                <p className="mb-4">
                    If you use the Platform, you shall be responsible for maintaining the confidentiality of your Display Name and Password and you shall be responsible for all activities that occur under your Display Name and Password.
                    You agree that if you provide any information that is untrue, inaccurate, not current or incomplete or not in accordance with this Terms of Use, We shall have the right to indefinitely suspend or terminate or block Your access on the Platform.
                </p>
                <p className="mb-4">
                    If there is reason to believe that there is likely to be a breach of security or misuse of Your account, We may request You to change the password or we may suspend Your account without any liability to Sellaids, for such period of time as we deem appropriate in the circumstances.
                </p>

                <h2 className="text-2xl font-heading text-black mt-6 mb-2">2. Services Offered</h2>
                <p className="mb-4">
                    Sellaids provides a number of internet-based services through the Platform. One such Service enables Users to purchase new and used merchandise such as clothing, footwear and accessories from various fashion and lifestyle brands (collectively, “Products”).
                    The Products can be purchased through the Platform through various methods of payments offered. It is clarified that cancellation and return (only allowed in specific conditions specified) requests cannot be entertained as the User understands that it is a Used Product.
                </p>
                <h2 className="text-2xl font-heading text-black mt-6 mb-2">3. Platform for Transaction and Communication</h2>
                <p className="mb-4">
                    The Users utilize to meet and interact with one another for their transactions on the Platform. Sellaids is not and cannot be a party to or control in any manner any transaction between the Sellaids’s Users. Henceforward:
                </p>
                <ul className="list-disc pl-6 space-y-2 mb-4">
                    <li>
                        At no time shall Sellaids hold any right, title or interest over the products nor shall Sellaids have any obligations or liabilities in respect of such contract entered into between Buyers and Sellers.
                    </li>
                    <li>
                        The Sellaids is only a platform that can be utilized by Users to reach a larger base to buy and sell products or services.
                        Sellaids is only providing a platform for communication and it is agreed that the contract for sale of any of the products or services shall be a strictly bipartite contract between the Seller and the Buyer.
                        At no time shall Sellaids hold any right, title or interest over the products nor shall Sellaids have any obligations or liabilities in respect of such contract.
                    </li>
                    <li>
                        You release and indemnify Sellaids and/or any of its officers and representatives from any cost, damage, liability or other consequence of any of the actions of the Users of the Sellaids and specifically waive any claims that you may have in this behalf under any applicable law.
                        Notwithstanding its reasonable efforts in that behalf, Sellaids cannot take responsibility or control the information provided by other Users which is made available on the Platform.
                    </li>
                </ul>

                <h2 className="text-2xl font-heading text-black mt-6 mb-2">
                    4. User Conduct and Rules on the Platform
                </h2>

                <p className="mb-4">
                    You agree, undertake and confirm that Your use of the Platform shall be strictly governed by the following binding principles:
                </p>
                <ul className="list-disc pl-6 space-y-2 mb-4">
                    <li>You shall not host, display, upload, modify, publish, transmit, update or share any information which:</li>
                    <ul className="list-disc pl-8 space-y-1 mb-4">
                        <li>belongs to another person and to which You do not have any right</li>
                        <li>is grossly harmful, harassing, blasphemous, defamatory, obscene, pornographic, paedophilic, libellous, invasive of another’s privacy, hateful, or racially, ethnically objectionable, disparaging, relating or encouraging money laundering or gambling, or otherwise unlawful in any manner whatever</li>
                        <li>is misleading in any way</li>
                        <li>involves the transmission of "junk mail", "chain letters", or unsolicited mass mailing or "spamming"</li>
                        <li>promotes illegal activities or conduct that is abusive, threatening, obscene, defamatory or libellous</li>
                        <li>infringes upon or violates any third party’s rights including, but not limited to, intellectual property rights, rights of privacy (including without limitation unauthorized disclosure of a person’s name, email address, physical address or phone number) or rights of publicity</li>
                        <li>contains restricted or password-only access pages, or hidden pages or images (those not linked to or from another accessible page)</li>
                        <li>provides instructional information about illegal activities such as making or buying illegal weapons, violating someone’s privacy, or providing or creating computer viruses</li>
                        <li>contains video, photographs, or images of another person (with a minor or an adult)</li>
                        <li>tries to gain unauthorized access or exceeds the scope of authorized access to the Platform or to profiles, blogs, communities, account information, bulletins, friend request, or other areas of the Platform or solicits passwords or personal identifying information for commercial or unlawful purposes from other users</li>
                        <li>interferes with another USER’s use and enjoyment of the Platform or any other individual’s User and enjoyment of similar services</li>
                        <li>infringes any patent, trademark, copyright or other proprietary rights or third party’s trade secrets or rights of publicity or privacy or shall not be fraudulent or involve the sale of counterfeit or stolen products</li>
                        <li>violates any law for the time being in force</li>
                        <li>threatens the unity, integrity, defence, security or sovereignty of India, friendly relations with foreign states, or public order or causes incitement to the commission of any cognizable offence or prevents investigation of any offence or is insulting any other nation</li>
                        <li>shall not be false, inaccurate or misleading</li>
                        <li>shall not create liability for Us or cause Us to lose (in whole or in part) the services of Our internet service provider (“ISPs”) or other suppliers</li>
                    </ul>
                </ul>

                <p className="mb-4">
                    A User may be considered fraudulent or loss to business due to fraudulent activity if any of the following scenarios are met:
                </p>
                <ul className="list-disc pl-6 space-y-1 mb-4">
                    <li>Users don’t reply to the payment verification mail sent by Sellaids</li>
                    <li>Users fail to produce adequate documents during the payment details verification</li>
                    <li>Misuse of another User’s phone/email</li>
                    <li>Users use invalid address, email and phone no.</li>
                    <li>Users return the wrong product</li>
                    <li>Users involved in the snatch and run of any order</li>
                    <li>Miscellaneous activities conducted with the sole intention to cause loss to business/revenue to Sellaids</li>
                    <li>Repeated request for monetary compensation for fake/used order</li>
                </ul>

                <p className="mb-4">
                    Sellaids may cancel any order that classify as ‘Bulk Orders’/’Fraud orders’ under certain criteria at any stage of the product delivery. An order can be classified as ‘Bulk Order’/’Fraud Order’ if it meets with the below mentioned criteria, and any additional criteria as defined by Sellaids:
                </p>
                <ul className="list-disc pl-6 space-y-1 mb-4">
                    <li>Products ordered are not for self-consumption but for commercial resale</li>
                    <li>Multiple orders placed for same product at the same address, depending on the product category.</li>
                    <li>Invalid address given in order details</li>
                    <li>Any malpractice used to place the order</li>
                    <li>Any order placed using a technological glitch/loophole</li>
                </ul>
                <p className="mb-4">
                    Sellaids does not facilitate business to business transaction between Sellers and business customers. You are advised to refrain from transacting on the Platform if You intend to avail the benefits of input tax credit.
                </p>
                <p className="mb-4">
                    You shall not use the Platform for any unlawful and fraudulent purposes, which may cause annoyance and inconvenience and abuses any policy and rules of the company and interrupt or causes to interrupt, damages the use by other Users of Sellaids.
                </p>

                <p className="mb-4">
                    You shall not use any false e-mail address, impersonates any person or entity, or otherwise misleads Sellaids by sharing multiple address and phone numbers or transacting with malafide intentions.
                </p>

                <p className="mb-4">
                    We on certain landing page even allow our Users to experience free exchange of ideas and observations regarding interest in the field of fashion, including ‘viewing user generated content’ and/or ‘videos’ and ‘posting comments’. By accessing, viewing and/or posting any user generated content to any specific dedicated page on the Platform, you accept and consent to the practices described in these ‘Terms of Service’ and ‘Privacy Policies’, as well as any other terms of prescribed by the Sellaids on the Platform. You agree and undertake that when accessing, viewing and/or posting any user generated content on these pages You will not imitate, abuse, harass, any Customer/User or violate and exploit, any of these ‘Terms of Service’ of the Platform.
                </p>

                <p className="mb-4">
                    You shall not use any “deep-link”, “page-scrape”, “robot”, “spider” or other automatic device, program, algorithm or methodology, or any similar or equivalent manual process, to access, acquire, copy or monitor any portion of the Platform or any Content, or in any way reproduce or circumvent the navigational structure or presentation of the Platform or any Content, to obtain or attempt to obtain any materials, documents or information through any means not purposely made available through the Platform. We reserve Our right to bar any such activity.
                </p>
                <p className="mb-4">
                    ou shall not attempt to gain unauthorized access to any portion or feature of the Platform, or any other systems or networks connected to the Platform or to any server, computer, network, or to any of the services offered on or through the Platform, by hacking, password “mining” or any other illegitimate means.
                </p>
                <p className="mb-4">
                    You may not pretend that You are, or that You represent, someone else, or impersonate any other individual or entity
                </p>
                <p className="mb-4">
                    You shall at all times ensure full compliance with the applicable provisions of the Information Technology Act, 2000 and rules thereunder as applicable and as amended from time to time and also all applicable Domestic laws, rules and regulations (including the provisions of any applicable Exchange Control Laws or Regulations in Force) and International Laws, Foreign Exchange Laws, Statutes, Ordinances and Regulations (including, but not limited to Sales Tax/VAT, Income Tax, Octroi, Service Tax, Central Excise, Custom Duty, Local Levies) regarding Your use of Our service and Your listing, purchase, solicitation of offers to purchase, and sale of products or services. You shall not engage in any transaction in an item or service, which is prohibited by the provisions of any applicable law including exchange control laws or regulations for the time being in force.
                </p>
                <p className="mb-4">
                    From time to time, You shall be responsible for providing information relating to the products or services proposed to be sold by You. In this connection, You undertake that all such information shall be accurate in all respects. You shall not exaggerate or over emphasize the attributes of such products or services so as to mislead other Users in any manner.
                </p>

                <h2 className="text-2xl font-heading text-black mt-6 mb-2">
                    5. Contents Posted on Platform
                </h2>
                <p className="mb-4">
                    All text, graphics, user interfaces, visual interfaces, photographs, trademarks, logos, sounds, music and artwork (collectively, “Content”), is a
                    third party user generated content and Sellaids has no control over such third party user generated content as Sellaids is merely an intermediary
                    for the purposes of this Terms of Use. Such Content will become Our property and You grant Us the worldwide, perpetual and transferable rights
                    in such Content. We shall be entitled to, consistent with Our Privacy Policy as adopted in accordance with applicable law, use the Content or any
                    of its elements for any type of use forever, including but not limited to promotional and advertising purposes and in any media whether now known
                    or hereafter devised, including the creation of derivative works that may include the Content You provide.
                </p>

                <h2 className="text-2xl font-heading text-black mt-6 mb-2">
                    6. Selling
                </h2>
                <p className="mb-4">
                    As a registered seller, you are allowed to list item(s) for sale on the Platform in accordance with the Policies which are incorporated by way of
                    reference in this Terms of Use. You must be legally able to sell the item(s) you list for sale on the Platform. You must ensure that the listed
                    items do not infringe upon the intellectual property, trade secret or other proprietary rights or rights of publicity or privacy rights of third
                    parties. Listings may only include text descriptions, graphics and pictures that describe your item for sale. All listed items must be listed in
                    an appropriate category on the Platform. All listed items must be kept in stock for successful fulfilment of sales. The listings description of
                    the item must not be misleading and must describe actual condition of the product. If the item description does not match the actual condition of
                    the item, you agree to refund any amounts that you may have received from the Buyer/Sellaids.
                </p>

                <h2 className="text-2xl font-heading text-black mt-6 mb-2">
                    7. Payment
                </h2>
                <p className="mb-4">
                    While availing of any of the payment method/s available on the Platform, we will not be responsible or assume any liability, whatsoever in respect
                    of any loss or damage arising directly or indirectly to You due to:
                </p>
                <ul className="list-disc pl-6 space-y-1 mb-4">
                    <li>Lack of authorization for any transaction/s, or</li>
                    <li>Exceeding the preset limit mutually agreed by You and between ‘Bank/s’, or</li>
                    <li>Any payment issues arising out of the transaction, or</li>
                    <li>Decline of transaction for any other reason/s</li>
                </ul>

                <p className="mb-4">
                    All payments made against the purchases/services on Platform by you shall be compulsorily in Indian Rupees acceptable in the Republic of India.
                    Platform will not facilitate transaction with respect to any other form of currency with respect to the purchases made on Platform.
                </p>

                <h3 className="font-semibold mt-4">Further:</h3>
                <ul className="list-disc pl-6 space-y-1 mb-4">
                    <li>Your relationship with Sellaids is on a principal to principal basis...</li>
                    <li>You understand, accept and agree that the payment facility provided by Sellaids is neither a banking nor financial service but is merely a facilitator providing an electronic facility for the Transactions using the existing authorized banking infrastructure and Credit Card payment gateway networks. Further, by providing Payment Facility, Sellaids is neither acting as trustees nor acting in a fiduciary capacity with respect to the Transaction.</li>
                </ul>

                <h3 className="font-semibold mt-4">Payment Facility for Buyers:</h3>
                <ul className="list-disc pl-6 space-y-1 mb-4">
                    <li>You, as a Buyer, understand that upon initiating a Transaction You are entering into a legally binding and enforceable contract with the Seller to purchase the products and /or services from the Seller using the Payment Facility</li>
                    <li>You, as a Buyer, shall electronically notify Payment Facility using the appropriate Sellaids Platform features immediately upon Delivery or non Delivery within the time period as provided in Policies. Non notification by You of Delivery or non Delivery within the time period specified in the Policies shall be construed as a deemed Delivery in respect of that Transaction.</li>
                    <li>Refund shall be made in Indian Rupees only and shall be equivalent to the Transaction Price received in Indian Rupees.</li>
                    <li>For electronics payments, refund shall be made through payment facility using NEFT / RTGS or any other online banking / electronic funds transfer system approved by Reserve Bank India (RBI).</li>
                    <li>Refunds may be supported for select banks. Where a bank is not supported for processing refunds, You will be required to share alternate bank account details with us for processing the refund.</li>
                </ul>
                {/* ---------------- Section: Compliance with Laws ---------------- */}
                <h2 className="text-2xl font-heading text-black mt-6 mb-2">
                    Compliance with Laws
                </h2>
                <ul className="list-disc pl-6 mb-4">
                    <li>
                        As required by applicable law, if the Customer makes a purchase of an
                        amount equal to or above INR 2,00,000.00, the Customer will be required
                        to upload a scanned copy of his/her PAN card on the Platform within 4
                        days of making the purchase, failing which, the purchase made by the
                        Customer will be cancelled.
                    </li>
                    <li>
                        The requirement to submit the PAN card arises only once and if it has
                        been submitted once by the Customer, it need not be submitted again.
                    </li>
                    <li>
                        The order of the Customer shall stand cancelled if there is a
                        discrepancy between the name of the Customer and the name on the PAN
                        Card.
                    </li>
                </ul>
                <p className="mb-4">
                    Buyer and Seller shall comply with all the applicable laws (including
                    without limitation Foreign Exchange Management Act, 1999 and the rules
                    made and notifications issued thereunder and the Exchange Control Manual
                    as may be issued by Reserve Bank of India from time to time, Customs Act,
                    Information and Technology Act, 2000 as amended by the Information
                    Technology (Amendment) Act 2008, Prevention of Money Laundering Act, 2002
                    and the rules made thereunder, Foreign Contribution Regulation Act, 1976
                    and the rules made thereunder, Income Tax Act, 1961 and the rules made
                    thereunder, Export Import Policy of Government of India) applicable to
                    them respectively for using Payment Facility and Sellaids Platform.
                </p>

                {/* ---------------- Section: E-Platform ---------------- */}
                <h2 className="text-2xl font-heading text-black mt-6 mb-2">
                    E-Platform for Communication
                </h2>
                <p className="mb-4">
                    You agree, understand and acknowledge that Sellaids is an online platform
                    that enables you to purchase products listed on the Platform at the price
                    indicated therein at any time. You further agree and acknowledge that
                    Sellaids is only a facilitator and is not and cannot be a party to or
                    control in any manner any transactions on Sellaids.
                </p>

                {/* ---------------- Section: Indemnity ---------------- */}
                <h2 className="text-2xl font-heading text-black mt-6 mb-2">
                    Indemnity
                </h2>
                <p className="mb-4">
                    You shall indemnify and hold harmless Sellaids, its owner, licensee,
                    affiliates, subsidiaries, group companies (as applicable) and their
                    respective officers, directors, agents, and employees, from any claim or
                    demand, or actions including reasonable attorneys’ fees, made by any third
                    party or penalty imposed due to or arising out of Your breach of this
                    Terms of Use, Privacy Policy and other Policies, or Your violation of any
                    law, rules or regulations or the rights (including infringement of
                    intellectual property rights) of a third party.
                </p>

                {/* ---------------- Section: Trademark, Copyright ---------------- */}
                <h2 className="text-2xl font-heading text-black mt-6 mb-2">
                    Trademark, Copyright and Restriction
                </h2>
                <p className="mb-4">
                    Platform is controlled and operated by Sellaids and products are sold by
                    respective Sellers. All material on Platform, including images,
                    illustrations, audio clips, and video clips, are protected by copyrights,
                    trademarks, and other intellectual property rights. Material on Sellaids
                    is solely for Your personal, non-commercial use. You must not copy,
                    reproduce, republish, upload, post, transmit or distribute such material
                    in any way, including by email or other electronic means and whether
                    directly or indirectly and You must not assist any other person to do so.
                </p>
                <p className="mb-4">
                    Without the prior written consent of the owner, modification of the
                    materials, use of the materials on any other Sellaids or networked
                    computer environment or use of the materials for any purpose other than
                    personal, non-commercial use is a violation of the copyrights, trademarks
                    and other proprietary rights, and is prohibited.
                </p>
                <p className="mb-4">
                    Any use for which You receive any remuneration, whether in money or
                    otherwise, is a commercial use for the purposes of this clause. It is
                    expressly clarified that You will retain ownership and shall solely be
                    responsible for any content that You provide or upload when using any
                    Service, including any text, data, information, images, photographs, music,
                    sound, video or any other material which you may upload, transmit or store
                    when making use of Our various Services. However, We reserve the right to
                    use/reproduce any content uploaded by You and You agree to grant royalty
                    free, irrevocable, unconditionally, perpetually and worldwide right to Us
                    to use the content for reasonable business purpose.
                </p>

                {/* ---------------- Section: Limitation of Liability ---------------- */}
                <h2 className="text-2xl font-heading text-black mt-6 mb-2">
                    Limitation of Liability
                </h2>
                <p className="mb-4">
                    In no event shall Sellaids be liable for any indirect, punitive, incidental,
                    special, consequential damages or any other damages resulting from:
                </p>
                <ul className="list-disc pl-6 mb-4">
                    <li>The use or the inability to use the Services or Products</li>
                    <li>Unauthorized access to or alteration of the user’s transmissions or data</li>
                    <li>Breach of condition, representations or warranties by the manufacturer</li>
                    <li>
                        Any other matter relating to the services including, without limitation,
                        damages for loss of use, data or profits, arising out of or in any way
                        connected with the use or performance of the Platform or Service.
                    </li>
                </ul>
                <p className="mb-4">
                    Sellaids shall not be responsible for non-availability of the Platform
                    during periodic maintenance operations or any unplanned suspension of
                    access. The User understands and agrees that all downloads at Sellaids is
                    done entirely at User’s own discretion and risk and they will be solely
                    responsible for any damage to their mobile or loss of data that results
                    from the download of such material and/or data.
                </p>
                <p className="mb-4">
                    To the maximum extent permitted under law, Sellaids’ liability shall be
                    limited to an amount equal to the Products purchased value bought by You.
                    Sellaids shall not be liable for any dispute or disagreement between Users.
                </p>
                <section className="max-w-[900px] mx-auto my-10 font-sans leading-relaxed text-gray-800">
                    <h2 className="text-[#222] mt-5 font-semibold text-lg">12. Termination</h2>
                    <p>
                        We may suspend or terminate your access to the Platform at any time if we
                        believe you have violated these Terms, misused the services, or engaged in
                        activities that are harmful to us, other users, or third parties. Upon
                        termination, your right to use the services will immediately cease.
                    </p>

                    <h2 className="text-[#222] mt-5 font-semibold text-lg">13. Disclaimer</h2>
                    <p>
                        The Platform and services are provided on an “as is” and “as available”
                        basis. We make no warranties, express or implied, regarding the operation of
                        the Platform or the information, content, or materials included therein. To
                        the fullest extent permissible by law, we disclaim all warranties, express
                        or implied, including but not limited to, implied warranties of
                        merchantability and fitness for a particular purpose.
                    </p>

                    <h2 className="text-[#222] mt-5 font-semibold text-lg">Delivery Related</h2>
                    <p>
                        Delivery timelines are estimates and subject to change due to unforeseen
                        circumstances. We will make reasonable efforts to inform you of any delays.
                        We are not responsible for delays caused by third-party logistics providers
                        or other factors beyond our control.
                    </p>

                    <h2 className="text-[#222] mt-5 font-semibold text-lg">
                        Seller Guidelines – Please Review Before Pickup
                    </h2>
                    <ul className="ml-5 list-disc space-y-1">
                        <li>Ensure all items are packed securely to prevent damage during transit.</li>
                        <li>Label all packages clearly with the order details.</li>
                        <li>Have items ready for pickup at the scheduled time to avoid delays.</li>
                        <li>Comply with all packaging and shipping requirements shared by the logistics partner.</li>
                        <li>Keep proof of pickup and tracking details for future reference.</li>
                    </ul>
                </section>

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
        </div >
    );
};

export default TermsConditionsSection;
