import React from 'react';

import img1 from '../assets/images/Gallery1.webp';
import img2 from '../assets/images/Gallery2.webp';
import img3 from '../assets/images/Gallery3.webp';
import img4 from '../assets/images/Gallery4.webp';
import img5 from '../assets/images/Gallery5.webp';

function ImageGallery() {
    const images = [img1, img2, img3, img4, img5];

    return (
        <section className="px-6 py-10 bg-white mb-10">
            <div className="flex flex-wrap justify-center gap-6">
                {images.map((img, index) => (
                    <div
                        key={index}
                        className="relative w-full sm:w-[250px] h-[250px] overflow-hidden group shadow-lg"
                    >
                        <img
                            src={img}
                            alt={`Image ${index + 1}`}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition duration-500"></div>
                    </div>
                ))}
            </div>
        </section>
    );
}

export default ImageGallery;
