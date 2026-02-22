import React from 'react';
import HeroBanner from '../components/sellwith/HeroBanner';
import HowToSellSection from '../components/sellwith/HowToSellSection';
import WhySellWithUsSection from '../components/sellwith/WhySellWithUsSection';
import WhatYouNeedToKnow from '../components/sellwith/WhatYouNeedToKnow';
import CallToActionSection from '../components/sellwith/CallToActionSection';
import FAQSection from '../components/sellwith/FAQSection';

const SellWithUs = () => {
    return (
        <div>
            <HeroBanner />
            < HowToSellSection />
            < WhySellWithUsSection />
            < WhatYouNeedToKnow />
            < CallToActionSection />
            < FAQSection />
        </div>
    );
};

export default SellWithUs;

