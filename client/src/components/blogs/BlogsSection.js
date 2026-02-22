// src/components/blogs/BlogsSection.js
import React, { useState } from "react";
import heroBanner from "../../assets/images/blog-hero.jpg";
import blogImg1 from "../../assets/images/blog1.webp";
import featuredImg1 from "../../assets/images/featured1.jpeg";

const blogsData = [
    {
        id: 1,
        title: "The Rise of Indian Edits in Modern Luxury Fashion",
        excerpt:
            "Indian fashion has always been a celebration of colors, traditions, and intricate craftsmanship. Among the many luxury...",
        contentImage: blogImg1,
        content: `
      <p class="mt-0 mb-4">
        Indian fashion has always been a celebration of colors, traditions and intricate craftsmanship. Among the many luxury edits that define contemporary style, Indian Edits hold a special place for those who value culture with elegance. From regal bridal lehengas to statement sarees, these edits are more than just clothing – they are heirlooms that carry stories of artistry and heritage.
      </p>

      <img src="__CONTENT_IMAGE__" alt="Fashion Brands" class="rounded-2xl shadow-lg w-full mb-6" />

      <h2 class="text-xl font-semibold mb-2">Why Brands Matter?</h2>
      <p class="mt-0 mb-4">
        What makes Indian Edits truly luxurious is the attention to detail – hand embroidery, zardozi, sequins and the finest fabrics woven with precision. Each outfit is designed not only to make a statement but also to create timeless memories. For brides, these luxury edits are the perfect blend of tradition and modern glamour, offering a royal charm that never fades.
      </p>

      <h2 class="text-xl font-semibold mb-2">Emerging Fashion Trends</h2>
      <p class="mt-0 mb-4">
        As fashion evolves, Indian Edits continue to inspire the global luxury market. Whether it’s a grand wedding, festive celebration or high-end event, these designs remain a symbol of grace, sophistication and unmatched beauty.
      </p>
    `,
        image: featuredImg1,
        tags: ["Fashion", "Brands", "Lifestyle", "Trends", "Luxury", "Streetwear"],
    },
];

const BlogsSection = () => {
    const [selectedBlog, setSelectedBlog] = useState(null);

    return (
        <div className="w-full">
            {/* Hero Banner */}
            <div className="relative w-full h-72 md:h-96">
                <img
                    src={heroBanner}
                    alt="Blogs Hero"
                    className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                    <h1 className="text-white text-4xl md:text-5xl font-heading">Our Blogs</h1>
                </div>
            </div>

            {/* Blog Grid */}
            <section className="max-w-6xl mx-auto px-4 py-12">
                <div className="grid gap-8 md:grid-cols-3 sm:grid-cols-2 grid-cols-1">
                    {blogsData.map((blog) => (
                        <div
                            key={blog.id}
                            className="bg-white shadow-lg rounded-2xl overflow-hidden hover:shadow-2xl transition-shadow duration-300"
                        >
                            <img
                                src={blog.image}
                                alt={blog.title}
                                className="w-full h-48 object-cover"
                            />
                            <div className="p-5">
                                <h2 className="text-xl font-semibold mb-2">{blog.title}</h2>
                                <p className="text-gray-600 text-sm mb-4">{blog.excerpt}</p>
                                <button
                                    onClick={() => setSelectedBlog(blog)}
                                    className="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition"
                                >
                                    Read More
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Blog Modal */}
            {selectedBlog && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
                    <div className="bg-white w-11/12 md:w-3/4 lg:w-2/3 xl:w-1/2 rounded-2xl shadow-lg relative max-h-[90vh] overflow-y-auto p-6">
                        {/* Sticky Close Button */}
                        <button
                            className="sticky top-3 float-right text-gray-600 hover:text-red-500 text-xl z-50"
                            onClick={() => setSelectedBlog(null)}
                        >
                            ✕
                        </button>

                        {/* Featured Image */}
                        <img
                            src={selectedBlog.image}
                            alt={selectedBlog.title}
                            className="w-full h-64 object-cover rounded-xl mb-6"
                        />

                        <h2 className="text-2xl font-bold mb-3">{selectedBlog.title}</h2>

                        {/* Blog Content with contentImage injected */}
                        <div
                            className="text-gray-700 whitespace-pre-line leading-relaxed"
                            dangerouslySetInnerHTML={{
                                __html: selectedBlog.content.replace(
                                    "__CONTENT_IMAGE__",
                                    selectedBlog.contentImage
                                ),
                            }}
                        />
                    </div>
                </div>
            )}
        </div>
    );
};

export default BlogsSection;
