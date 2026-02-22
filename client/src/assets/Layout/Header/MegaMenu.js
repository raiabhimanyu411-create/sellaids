import React from "react";
import { Link } from "react-router-dom";

// Divider Component
export const Divider1 = () => <div className="hidden lg:block w-px bg-gray-300" />;

export const Section = ({ title, items, baseSlug }) => {
    // Example baseSlug: women/fashion-aid/bags/bags
    const parts = baseSlug.split("/");
    const last = parts[parts.length - 1];
    const secondLast = parts[parts.length - 2];

    // agar last == secondLast hai to ek hata do
    const viewAllSlug =
        last === secondLast
            ? parts.slice(0, -1).join("/")
            : baseSlug;

    return (
        <div>
            <h3 className="text-orange-500 font-semibold mb-2">{title}</h3>
            <ul className="space-y-1 text-gray-800 text-sm">
                {items?.map((item, index) => (
                    <li key={index}>
                        <Link
                            to={`/product-category/${baseSlug}/${item?.slug}`}
                            className="hover:text-orange-500 cursor-pointer transition"
                        >
                            {item.name}
                        </Link>
                    </li>
                ))}

                <li className="mt-2 text-orange-500 font-medium border-b-2 border-orange-500 w-fit cursor-pointer">
                    <Link to={`/product-category/${viewAllSlug}`}>
                        View All
                    </Link>
                </li>
            </ul>
        </div>
    );
};


//
// -----------------------------
// 🧒 KIDS MEGA MENU
// -----------------------------
export const KidsMegaMenu = ({ kidsCategories }) => {
    if (!kidsCategories?.slug) return null;
    const baseSlug = kidsCategories?.slug
    // console.log(kidsCategories)

    return (
        <div className="absolute left-1/2 -translate-x-1/2 top-full mt-0 z-50 invisible opacity-0 group-hover:visible group-hover:opacity-100 transition-all duration-300">
            <div className="w-[1000px] bg-white shadow-lg py-6 px-8 border border-gray-200">
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

//
// -----------------------------
// 👨 MEN MEGA MENU
// -----------------------------
export const MensMegaMenu = ({ menCategories }) => {
    if (!menCategories?.slug) return null;
    const baseSlug = menCategories?.slug;
    // console.log(menCategories)

    return (
        <div className="absolute left-1/2 -translate-x-1/2 top-full mt-0 z-50 invisible opacity-0 group-hover:visible group-hover:opacity-100 transition-all duration-300">
            <div className="w-[900px] bg-white shadow-lg py-6 px-8 border border-gray-200">
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


//
// -----------------------------
// 👩 WOMEN MEGA MENU
// -----------------------------
export const MegaMenu = ({ womenCategories }) => {
    if (!womenCategories?.slug) return null;
    const baseSlug = womenCategories?.slug
    // console.log(womenCategories)

    return (
        <div className="absolute left-1/2 -translate-x-1/2 top-full mt-0 z-50 invisible opacity-0 group-hover:visible group-hover:opacity-100 transition-all duration-300">
            <div className="w-[1100px] bg-white shadow-lg py-6 px-8 border border-gray-200">
                <div className="flex justify-center gap-10">
                    {womenCategories.subCategories.map((mainSection, index) => (
                        <React.Fragment key={mainSection.id}>
                            <div>
                                {/* Main Title: e.g. Designer Aid / Fashion Aid */}
                                <h2 className="text-center text-lg font-serif tracking-wide mb-4 uppercase">
                                    {mainSection.name}
                                </h2>

                                {/* Inner Sections: e.g. Indian Edit, Sarees, etc */}
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

                            {index < womenCategories.subCategories.length - 1 && <Divider1 />}
                        </React.Fragment>
                    ))}
                </div>
            </div>
        </div>
    );
};
