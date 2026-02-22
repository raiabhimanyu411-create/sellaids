import React from "react";
import { Link } from "react-router-dom";

// Desktop ke liye (same rahega)
export const Divider1 = () => <div className="hidden lg:block w-px bg-gray-300 mx-8" />;

export const Section = ({ title, items, baseSlug }) => {
    const parts = baseSlug.split("/");
    const last = parts[parts.length - 1];
    const secondLast = parts[parts.length - 2];
    const viewAllSlug = last === secondLast ? parts.slice(0, -1).join("/") : baseSlug;

    return (
        <div>
            <h3 className="text-orange-500 font-semibold mb-3 text-sm uppercase tracking-wider">{title}</h3>
            <ul className="space-y-2 text-gray-700 text-sm">
                {items?.map((item) => (
                    <li key={item.id || item.slug}>
                        <Link to={`/product-category/${baseSlug}/${item.slug}`} className="block hover:text-orange-500">
                            {item.name}
                        </Link>
                    </li>
                ))}
                <li className="mt-2 text-orange-500 font-medium border-b-2 border-orange-500 w-fit cursor-pointer">
                    <Link to={`/product-category/${viewAllSlug}`} className="text-orange-500 font-medium text-sm">
                        View All
                    </Link>
                </li>
            </ul>
        </div>
    );
};

// Desktop Mega Menus - unchanged
export const MegaMenu = ({ womenCategories }) => {
    if (!womenCategories?.slug) return null;
    const baseSlug = womenCategories?.slug
    // console.log(womenCategories)

    return (
        <div className="absolute left-1/2 -translate-x-1/2 top-full mt-5 z-50 invisible opacity-0 group-hover:visible group-hover:opacity-100 transition-all duration-300">
            <div className="w-[1000px] bg-white shadow-lg py-6 px-4 border border-gray-200 ms-96">
                <div className="flex justify-center gap-1">
                    {womenCategories.subCategories.map((mainSection, index) => (
                        <React.Fragment key={mainSection.id}>
                            <div>
                                {/* Main Title: e.g. Designer Aid / Fashion Aid */}
                                <h2 className="text-center text-lg font-serif tracking-wide mb-4 uppercase">
                                    {mainSection.name}
                                </h2>

                                {/* Inner Sections: e.g. Indian Edit, Sarees, etc */}
                                <div className="flex gap-4">
                                    {mainSection.subCategories?.map((sub) => (
                                        <Section
                                            key={sub.slug}
                                            title={sub.name}
                                            items={sub.subCategories || []}
                                            baseSlug={`${baseSlug}/${mainSection.slug}/${sub.slug}`}
                                        />
                                    ))}
                                </div>
                            </div>

                            {index < womenCategories.subCategories.length - 1 && <Divider1 />}
                        </React.Fragment>
                    ))}
                </div>
            </div>
        </div>
    );
};

export const MensMegaMenu = ({ menCategories }) => {
    if (!menCategories?.slug) return null;
    const baseSlug = menCategories?.slug;
    // console.log(menCategories)

    return (
        <div className="absolute left-1/2 -translate-x-1/2 top-full mt-5 z-50 invisible opacity-0 group-hover:visible group-hover:opacity-100 transition-all duration-300">
            <div className="w-[900px] bg-white shadow-lg py-6 px-8 border border-gray-200 ms-40">
                <div className="flex justify-center gap-10">
                    {menCategories.subCategories.map((mainSection, index) => (
                        <React.Fragment key={mainSection.id}>
                            <div>
                                <h2 className="text-center text-lg font-serif tracking-wide mb-4 uppercase">
                                    {mainSection.name}
                                </h2>
                                <div className="flex gap-8">
                                    {mainSection.subCategories?.map((sub) => (
                                        <Section
                                            key={sub.slug}
                                            title={sub.name}
                                            items={sub.subCategories || []}
                                            baseSlug={`${baseSlug}/${mainSection.slug}/${sub.slug}`}
                                        />
                                    ))}
                                </div>
                            </div>
                            {index < menCategories.subCategories.length - 1 && <Divider1 />}
                        </React.Fragment>
                    ))}
                </div>
            </div>
        </div>
    );
};

export const KidsMegaMenu = ({ kidsCategories }) => {
    if (!kidsCategories?.slug) return null;
    const baseSlug = kidsCategories?.slug
    // console.log(kidsCategories)

    return (
        <div className="absolute left-1/2 -translate-x-1/2 top-full mt-5 z-50 invisible opacity-0 group-hover:visible group-hover:opacity-100 transition-all duration-300">
            <div className="w-[800px] bg-white shadow-lg py-6 px-8 border border-gray-200">
                <div className="flex justify-center gap-10">
                    {kidsCategories.subCategories.map((subCat, index) => (
                        <React.Fragment key={subCat.id}>
                            <Section
                                title={subCat.name}
                                items={subCat.subCategories || []}
                                baseSlug={`${baseSlug}/${subCat.slug}`}
                            />
                            {index < kidsCategories.subCategories.length - 1 && <Divider1 />}
                        </React.Fragment>
                    ))}
                </div>
            </div>
        </div>
    );
};

// MOBILE DRAWER - FULL 3-LEVEL SUPPORT (Tera Perfect Wala)
export const MobileMenuDrawer = ({ isOpen, onClose }) => {
    const [openMain, setOpenMain] = React.useState(null);
    const [openLevel2, setOpenLevel2] = React.useState(null);

    const categories = [
        { name: "WOMEN", slug: "women", data: window.__CATEGORIES__?.women },
        { name: "MEN", slug: "men", data: window.__CATEGORIES__?.men },
        { name: "KIDS", slug: "kids", data: window.__CATEGORIES__?.kids },
    ].filter(c => c.data?.subCategories?.length > 0);

    const handleLinkClick = () => {
        onClose();
        setOpenMain(null);
        setOpenLevel2(null);
    };

    return (
        <>
            {isOpen && <div className="fixed inset-0 bg-black bg-opacity-60 z-40 lg:hidden" onClick={onClose} />}

            <div className={`fixed top-0 left-0 h-full w-full bg-white z-50 transform transition-transform duration-300 lg:hidden ${isOpen ? "translate-x-0" : "-translate-x-full"}`}>
                <div className="flex justify-between items-center p-5 border-b">
                    <img src="/logo.webp" alt="Logo" className="h-[80px] sm:h-[100px] w-auto" />
                    <button onClick={onClose} className="p-2">
                        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <div className="overflow-y-auto h-full">
                    {categories.map((cat) => (
                        <div key={cat.slug} className="border-b border-gray-200">

                            {/* Main Category - WOMEN / MEN / KIDS */}
                            <button
                                onClick={() => setOpenMain(openMain === cat.slug ? null : cat.slug)}
                                className="w-full px-6 py-5 flex justify-between items-center text-lg font-bold hover:bg-gray-50"
                            >
                                {cat.name}
                                <svg className={`w-5 h-5 transition-transform ${openMain === cat.slug ? "rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                </svg>
                            </button>

                            {/* Level 1: Designer Aid / Fashion Aid */}
                            {openMain === cat.slug && cat.data.subCategories.map((level1) => (
                                <div key={level1.id} className="bg-gray-50 border-t border-gray-200">
                                    <button
                                        onClick={() => setOpenLevel2(openLevel2 === level1.id ? null : level1.id)}
                                        className="w-full px-8 py-4 flex justify-between items-center font-semibold hover:bg-white"
                                    >
                                        {level1.name}
                                        <svg className={`w-5 h-5 transition-transform ${openLevel2 === level1.id ? "rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                        </svg>
                                    </button>

                                    {/* Level 2: Indian Edit, Sarees, etc. */}
                                    {openLevel2 === level1.id && level1.subCategories?.map((level2) => (
                                        <div key={level2.id} className="bg-white">
                                            {/* Level 2 Item */}
                                            <Link
                                                to={`/product-category/${cat.slug}/${level1.slug}/${level2.slug}`}
                                                onClick={handleLinkClick}
                                                className="block px-12 py-4 text-gray-700 hover:text-orange-500 hover:bg-orange-50 font-medium"
                                            >
                                                {level2.name}
                                            </Link>

                                            {/* Level 3: Lehenga, Gowns, etc. */}
                                            {level2.subCategories?.length > 0 && level2.subCategories.map((level3) => (
                                                <Link
                                                    key={level3.id}
                                                    to={`/product-category/${cat.slug}/${level1.slug}/${level2.slug}/${level3.slug}`}
                                                    onClick={handleLinkClick}
                                                    className="block px-16 py-3 text-gray-600 hover:text-orange-500 hover:bg-orange-50 pl-20"
                                                >
                                                    → {level3.name}
                                                </Link>
                                            ))}

                                            {/* View All for Level 2 */}
                                            <Link
                                                to={`/product-category/${cat.slug}/${level1.slug}/${level2.slug}`}
                                                onClick={handleLinkClick}
                                                className="block px-12 py-4 font-bold text-orange-500 border-t border-gray-200 bg-gray-50"
                                            >
                                                → View All {level2.name}
                                            </Link>
                                        </div>
                                    ))}

                                    {/* View All for Level 1 (Designer Aid / Fashion Aid) */}
                                    <Link
                                        to={`/product-category/${cat.slug}/${level1.slug}`}
                                        onClick={handleLinkClick}
                                        className="block px-8 py-4 font-bold text-orange-500 bg-gray-100 border-t border-gray-300"
                                    >
                                        → View All {level1.name}
                                    </Link>
                                </div>
                            ))}
                        </div>
                    ))}

                    <div className="p-6 mt-8">
                        <Link to="/sellwithus" onClick={onClose} className="block text-center py-4 bg-orange-500 text-white text-lg font-bold rounded-xl hover:bg-orange-600">
                            SELL WITH US
                        </Link>
                    </div>
                </div>
            </div>
        </>
    );
};