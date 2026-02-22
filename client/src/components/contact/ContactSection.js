import React from "react";
import { Link } from "react-router-dom";
import { FaEnvelope, FaPhoneAlt, FaFacebookF, FaInstagram } from "react-icons/fa";
import bannerImg from "../../assets/images/contact-banner.webp";

const ContactSection = () => {
    return (
        <section className="font-['Bellefair']">
            <div className="container mx-auto px-4 py-12">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                    {/* Left Image */}
                    <div>
                        <img
                            src={bannerImg}
                            alt="Luxury bag"
                            className="w-full h-auto rounded-md shadow-md"
                        />
                    </div>

                    {/* Right Content */}
                    <div>

                        {/* Title */}
                        <h1 className="text-5xl md:text-6xl mb-8 tracking-wide">
                            CONTACT US
                        </h1>

                        {/* Email */}
                        <div className="flex items-center mb-4 text-xl text-gray-800">
                            <FaEnvelope className="mr-3 text-gray-900 text-2xl" />
                            <a
                                href="mailto:contact@sellaids.com"
                                className="hover:underline"
                            >
                                contact@sellaids.com
                            </a>
                        </div>

                        {/* Phone */}
                        <div className="flex items-center mb-8 text-xl text-gray-800">
                            <FaPhoneAlt className="mr-3 text-gray-900 text-2xl" />
                            <a href="tel:+918800425855" className="hover:underline">
                                +91 8800425855
                            </a>
                        </div>

                        {/* Social Links */}
                        <h2 className="text-2xl mb-4">SOCIAL LINKS</h2>
                        <div className="flex space-x-4">
                            <a
                                href="https://www.facebook.com/people/Sellaidsluxe/61565059872971/?mibextid=LQQJ4d&rdid=cfpw8fQ75WfL41Lf&share_url=https%3A%2F%2Fwww.facebook.com%2Fshare%2FYrq9uGzrhWHr84Jr%2F%3Fmibextid%3DLQQJ4d"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="bg-[#3b5998] text-white w-12 h-12 flex items-center justify-center rounded-md hover:opacity-80 text-xl"
                            >
                                <FaFacebookF />
                            </a>
                            <a
                                href="https://www.instagram.com/sellaidsluxe/?igsh=MWxqcWxjM2hxdm9tMA%3D%3D&utm_source=qr"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="bg-[#E1306C] text-white w-12 h-12 flex items-center justify-center rounded-md hover:opacity-80 text-xl"
                            >
                                <FaInstagram />
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default ContactSection;
