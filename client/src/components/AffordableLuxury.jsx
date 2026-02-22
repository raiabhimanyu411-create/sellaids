import React from "react";
import bgImage from "../assets/images/cta-image.webp";
import { useNavigate } from 'react-router-dom';

const AffordableLuxury = () => {
  const navigate = useNavigate();

  const handleSellClick = () => {
    navigate("/vendor/login");
  };
  return (
    <>
      <section className="px-6 md:px-16 py-12 text-gray-800 leading-relaxed">
        {/* Title */}
        <h2 className="text-3xl md:text-5xl font-light tracking-wide mb-8">
          AFFORDABLE LUXURY
        </h2>

        {/* Description */}
        <p className="text-base md:text-lg mb-4">
          At Sellaids, luxury is no longer reserved for the elite. Our concept
          of Affordable Luxury redefines the shopping experience, making
          high-end fashion accessible to all. Discover a curated selection of
          preloved designer items that allow you to indulge in the finer things
          in life without straining your wallet and redefining Luxury Shopping.
        </p>
        <p className="text-base md:text-lg mb-4">
          Sellaids opens the door to a world where premium designer items are
          available at a fraction of their original cost. Each exquisite piece
          in our collection has been meticulously vetted for quality and
          authenticity, ensuring that every purchase is a testament to
          craftsmanship and style.
        </p>

        {/* Essence Section */}
        <h3 className="text-2xl md:text-3xl font-light mt-10 mb-6">
          THE ESSENCE OF AFFORDABLE LUXURY
        </h3>

        <ul className="list-disc list-inside space-y-6 text-base md:text-lg">
          <li>
            <strong>Uncompromising Quality:</strong> Every item in our
            collection meets the highest standards of quality. Experience the
            allure and sophistication of luxury brands, knowing that your
            investment is sound and worthwhile.
          </li>
          <li>
            <strong>Sustainable Fashion Choices:</strong> Make a positive impact
            on the environment by choosing preloved luxury. Every purchase
            supports a more sustainable fashion industry, reducing waste and
            promoting the reuse of high-quality goods.
          </li>
          <li>
            <strong>Unique Treasures:</strong> Our carefully curated selection
            features rare and distinctive pieces that add a unique flair to your
            wardrobe. Each item carries its own story, allowing you to express
            your individuality and stand out in style.
          </li>
          <li>
            <strong>Smart Investments:</strong> Luxury items often retain their
            value, making them wise investments. Owning preloved pieces means
            enjoying the benefits of high-end fashion while contributing to a
            sustainable future. Many timeless classics in our collection are
            appreciated over time.
          </li>
          <li>
            <strong>Exceptional Savings:</strong> Experience the thrill of
            acquiring luxury items without the associated price tag. Our pricing
            reflects the true value of each item, offering significant savings
            compared to purchasing new.
          </li>
        </ul>

        {/* Join Section */}
        <div className="mt-12">
          <h3 className="text-2xl md:text-3xl font-light mb-4">
            Join the Affordable Luxury Movement
          </h3>
          <p className="text-base md:text-lg mb-3">
            At Sellaids, we are passionate about making luxury accessible to
            everyone. Our commitment to providing a diverse range of affordable
            luxury items empowers you to enjoy the elegance and sophistication
            of high-end fashion without compromise.
          </p>
          <p className="text-base md:text-lg mb-3">
            Explore our exquisite collection today and embrace the
            transformative power of Affordable Luxury. Elevate your fashion game
            while making choices that are both stylish and sustainable.
          </p>
          <p className="text-base md:text-lg font-medium">
            Experience the joy of luxury shopping reimagined—because everyone
            deserves a touch of elegance in their life.
          </p>
        </div>
      </section>
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

          <button
            onClick={handleSellClick}
            className="mt-6 px-6 py-3 bg-orange-500 text-white font-semibold hover:bg-orange-600 transition"
          >
            SELL NOW
          </button>
        </div>
      </section>
    </>
  );
};

export default AffordableLuxury;