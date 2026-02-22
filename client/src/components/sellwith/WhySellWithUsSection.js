import React from 'react';
import {
    Globe,
    BookOpen,
    BadgeCheck,
    Truck,
} from 'lucide-react';

const features = [
    {
        icon: <Globe className="text-orange-500 w-10 h-10" />,
        title: 'Reach a Global Audience',
        description: 'With millions of active shoppers, our platform gives you access to customers worldwide.',
    },
    {
        icon: <BookOpen className="text-orange-500 w-10 h-10" />,
        title: 'Simple & Secure',
        description: 'Easy payments and secure transactions so you shop confidently with trusted methods.',
    },
    {
        icon: <BadgeCheck className="text-orange-500 w-10 h-10" />,
        title: 'Flexible Payment Options',
        description: 'Flexible payment options to suit every budget.',
    },
    {
        icon: <Truck className="text-orange-500 w-10 h-10" />,
        title: 'No Hidden Charges',
        description: 'We believe in transparent pricing. You only pay a small commission and fixed fees on your sales.',
    },
];

const WhySellWithUsSection = () => {
    return (
        <section className="py-8 md:py-12 lg:py-16 px-4 bg-white">
            <h2 className="text-2xl md:text-3xl font-heading text-center uppercase mb-10 md:mb-14">
                WHY SELL WITH US?
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-10 max-w-7xl mx-auto">
                {features.map((feature, index) => (
                    <div key={index} className="flex items-start space-x-4">
                        <div className="flex-shrink-0">
                            {feature.icon}
                        </div>
                        <div>
                            <h3 className="text-base font-semibold mb-1">{feature.title}</h3>
                            <p className="text-sm text-gray-600">{feature.description}</p>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default WhySellWithUsSection;
