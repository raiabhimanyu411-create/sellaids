import React from 'react';
import { Trash2, Leaf, Shirt } from 'lucide-react';

function Feature() {
    return (
        <section className="bg-orange-500 text-white py-12 md:py-16 mb-8 md:mb-16 px-6 md:px-20 text-center">
            {/* Heading */}
            <h2 className="text-2xl md:text-4xl font-heading text-white max-w-5xl mx-auto mb-8 md:mb-12 leading-snug">
                We all can make a difference by choosing sustainable fashion which is not a trend but a responsibility towards our planet
            </h2>

            {/* Icons and Text */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-10 max-w-6xl mx-auto">
                {/* Reduce Waste */}
                <div>
                    <Trash2 size={48} className="mx-auto mb-4" />
                    <h3 className="text-lg font-semibold uppercase">Reduce Waste</h3>
                    <p className="mt-2 text-sm">
                        Give luxury items a second life and keep them out of landfills.
                    </p>
                </div>

                {/* Eco-Friendly Fashion */}
                <div>
                    <Leaf size={48} className="mx-auto mb-4" />
                    <h3 className="text-lg font-semibold uppercase">Eco-Friendly Fashion</h3>
                    <p className="mt-2 text-sm">
                        Every purchase contributes to a healthier planet by reusing valuable resources.
                    </p>
                </div>

                {/* Sustainable Style */}
                <div>
                    <Shirt size={48} className="mx-auto mb-4" />
                    <h3 className="text-lg font-semibold uppercase">Sustainable Style</h3>
                    <p className="mt-2 text-sm">
                        Choose high-end fashion with a lower environmental impact.
                    </p>
                </div>
            </div>
        </section>
    );
}

export default Feature;
