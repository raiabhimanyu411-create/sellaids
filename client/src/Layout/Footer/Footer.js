import React from 'react';
import { Link } from 'react-router-dom';
import {
    Phone,
    Mail,
    Facebook,
    Instagram,
    Truck,
    RefreshCcw,
    Headphones,
    ClipboardList
} from 'lucide-react';

const Footer = () => {
    return (
        <footer className="bg-black text-white relative">
            {/* Top Orange Bar */}
            <div className="bg-orange-500 py-6 flex flex-wrap justify-center gap-6 md:gap-10 text-white text-base md:text-lg font-medium px-4 text-center md:text-left">
                <div className="flex items-center gap-2">
                    <ClipboardList size={24} />
                    Free Listing
                </div>
                <div className="flex items-center gap-2">
                    <Truck size={24} />
                    Pan India Shipping
                </div>
                <div className="flex items-center gap-2">
                    <RefreshCcw size={24} />
                    Easy Returns
                </div>
                <div className="flex items-center gap-2">
                    <Headphones size={24} />
                    Easy Online Support
                </div>
            </div>

            {/* Main Footer Content */}
            <div className="max-w-7xl mx-auto px-4 py-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-8 text-sm text-center md:text-left">
                <div>
                    <h4 className="font-semibold mb-4 text-lg">INFORMATION</h4>
                    <ul className="space-y-2">
                        <li><Link to="/about" className="hover:text-orange-500">About Us</Link></li>
                        <li><Link to="/trusted-platform" className="hover:text-orange-500">Trusted Platform</Link></li>
                        <li><Link to="/affordable-luxury" className="hover:text-orange-500">Affordable Luxury</Link></li>
                    </ul>
                </div>

                <div>
                    <h4 className="font-semibold mb-4 text-lg">POLICIES</h4>
                    <ul className="space-y-2">
                        <li><Link to="/privacy-policy" className="hover:text-orange-500">Privacy Policy</Link></li>
                        <li><Link to="/shipping-policy" className="hover:text-orange-500">Shipping Policy</Link></li>
                        <li><Link to="/terms-conditions" className="hover:text-orange-500">Terms & Conditions</Link></li>
                        <li><Link to="/refund-return-policy" className="hover:text-orange-500">Refund & Return Policy</Link></li>
                    </ul>
                </div>

                <div>
                    <h4 className="font-semibold mb-4 text-lg">GUIDELINES</h4>
                    <ul className="space-y-2">
                        <li><Link to="/we-dont-sell" className="hover:text-orange-500">We Don’t Sell</Link></li>
                        <li><Link to="/who-can-sell" className="hover:text-orange-500">Who Can Sell?</Link></li>
                        <li><Link to="/advice-sellers" className="hover:text-orange-500">Advice for Sellers</Link></li>
                    </ul>
                </div>

                <div>
                    <h4 className="font-semibold mb-4 text-lg">QUICK LINKS</h4>
                    <ul className="space-y-2">
                        <li><Link to="/contact" className="hover:text-orange-500">Contact Us</Link></li>
                        <li><Link to="/blogs" className="hover:text-orange-500">Blogs</Link></li>
                    </ul>
                </div>

                <div>
                    <h4 className="font-semibold mb-4 text-lg">LET’S GET IN TOUCH</h4>
                    <div className="flex items-center justify-center md:justify-start gap-2 mb-3">
                        <Phone size={16} />
                        <span>+91 8800425855</span>
                    </div>
                    <div className="flex items-center justify-center md:justify-start gap-2 mb-4">
                        <Mail size={16} />
                        <span>contact@sellaids.com</span>
                    </div>
                    <div className="flex justify-center md:justify-start gap-4">
                        <a href="https://facebook.com/sellaidsofficial/?rdid=a4y0ZYIZDXzfaVoT" target="_blank" rel="noreferrer" className="bg-gray-800 p-2 rounded-full hover:bg-orange-500">
                            <Facebook size={16} />
                        </a>
                        <a href="https://instagram.com/sellaidsluxe/?igsh=MWxqcWxjM2hxdm9tMA%3D%3D&utm_source=qr" target="_blank" rel="noreferrer" className="bg-gray-800 p-2 rounded-full hover:bg-orange-500">
                            <Instagram size={16} />
                        </a>
                    </div>
                </div>
            </div>

            {/* Bottom Copyright */}
            <div className="border-t border-gray-700 text-center text-xs py-4">
                © 2024 Sellaids. All Rights Reserved. Designed by Hashtag Media and Entertainment India.
            </div>

            {/* WhatsApp Floating Icon */}
            <div className="fixed bottom-20 right-5 z-50">
                <a
                    href="https://wa.me/918800425855"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    <img
                        src="/icons/whatsapp.png"
                        alt="WhatsApp"
                        className="w-14 h-14 object-contain drop-shadow-lg hover:scale-105 transition-transform duration-300"
                    />
                </a>
            </div>
        </footer>
    );
};

export default Footer;
