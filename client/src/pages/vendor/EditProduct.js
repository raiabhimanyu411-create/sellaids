import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const EditProduct = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [errors, setErrors] = useState({});

    const [form, setForm] = useState({
        name: "", description: "", price: "", category: "", sub_category: "",
        brand: "", model_name: "", product_condition: "", material: "",
        purchase_year: "", selling_price: "", purchase_price: "",
        reason_to_sell: "", purchase_place: "",
        seller_name: "", seller_email: "", seller_phone: "",
        pickup_address: "", apartment: "", city: "", state: "", pin_code: "",
        seller_additional_info: "",
    });

    const [current, setCurrent] = useState({
        front_photo: "", back_photo: "", logo_photo: "", inside_photo: "",
        button_photo: "", wearing_image: "", more_images: "", wearing_proof: ""
    });

    const [files, setFiles] = useState({
        frontPhoto: null, backPhoto: null, labelPhoto: null, insidePhoto: null,
        buttonPhoto: null, wearingPhoto: null, moreImages: null, wearingProof: null
    });

    useEffect(() => {
        const load = async () => {
            try {
                const res = await axios.get(`http://localhost:5000api/products/${id}`);
                const p = res.data || {};

                setForm({
                    name: p.name || "",
                    description: p.description || "",
                    price: p.price || "",
                    category: p.category || "",
                    sub_category: p.sub_category || "",
                    brand: p.brand || "",
                    model_name: p.model_name || "",
                    product_condition: p.product_condition || "",
                    material: p.material || "",
                    purchase_year: p.purchase_year || "",
                    selling_price: p.selling_price || "",
                    purchase_price: p.purchase_price || "",
                    reason_to_sell: p.reason_to_sell || "",
                    purchase_place: p.purchase_place || "",
                    seller_name: p.seller_name || "",
                    seller_email: p.seller_email || "",
                    seller_phone: p.seller_phone || "",
                    pickup_address: p.pickup_address || "",
                    apartment: p.apartment || "",
                    city: p.city || "",
                    state: p.state || "",
                    pin_code: p.pin_code || "",
                    seller_additional_info: p.seller_additional_info || "",
                });

                setCurrent({
                    front_photo: p.front_photo || "",
                    back_photo: p.back_photo || "",
                    logo_photo: p.logo_photo || "",
                    inside_photo: p.inside_photo || "",
                    button_photo: p.button_photo || "",
                    wearing_image: p.wearing_image || "",
                    more_images: p.more_images || "",
                    wearing_proof: p.wearing_proof || "",
                });
            } catch (e) {
                console.error(e);
                alert("Failed to load product");
            } finally {
                setLoading(false);
            }
        };
        load();
    }, [id]);

    const onChange = (e) => {
        const { name, value } = e.target;
        setForm(s => ({ ...s, [name]: value }));
        if (errors[name]) setErrors(prev => ({ ...prev, [name]: undefined }));
    };

    const onFile = (e) => {
        const { name, files: fl } = e.target;
        setFiles(s => ({
            ...s,
            [name]: fl.length > 1 ? Array.from(fl) : fl[0]
        }));
    };

    const validateStep = () => {
        const newErrors = {};

        const required = {
            1: ["name", "description", "price"],
            2: ["brand", "model_name", "product_condition"],
            5: ["seller_name", "seller_email", "seller_phone", "pickup_address", "city", "state", "pin_code"],
        };

        (required[step] || []).forEach(field => {
            if (!form[field]?.trim()) {
                newErrors[field] = "This field is required";
            }
        });

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const nextStep = () => {
        if (validateStep()) {
            setStep(s => Math.min(s + 1, 5));
            setErrors({});
        }
    };

    const prevStep = () => {
        setStep(s => Math.max(s - 1, 1));
        setErrors({});
    };

    const onFinalSubmit = async (e) => {
        e.preventDefault();
        if (!validateStep()) return;

        setSaving(true);
        try {
            const data = new FormData();
            Object.entries(form).forEach(([k, v]) => data.append(k, v ?? ""));

            const singleFiles = ["frontPhoto", "backPhoto", "labelPhoto", "insidePhoto", "buttonPhoto", "wearingPhoto", "wearingProof"];
            singleFiles.forEach(k => {
                if (files[k] && files[k] instanceof File) data.append(k, files[k]);
            });

            if (files.moreImages && files.moreImages.length) {
                files.moreImages.forEach(f => data.append("moreImages", f));
            }

            await axios.put(`http://localhost:5000api/products/edit/${id}`, data, {
                headers: { "Content-Type": "multipart/form-data" }
            });

            alert("Product updated successfully!");
            navigate("/vendor/my-products");
        } catch (err) {
            console.error(err);
            alert("Update failed!");
        } finally {
            setSaving(false);
        }
    };

    const img = (path) => path ? `https://sellaids.com${path}` : "";

    if (loading) return <div className="text-center py-20 text-xl">Loading product...</div>;

    const steps = ["Basic Info", "Product Details", "Photos 1", "Photos 2", "Seller Info"];

    return (
        <div className="min-h-screen bg-gray-100 py-8 px-4">
            <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl p-6 md:p-10">

                <h2 className="text-2xl md:text-3xl font-bold text-center text-gray-800 mb-8">Edit Product</h2>

                {/* Progress Bar */}
                <div className="mb-10">
                    <div className="flex justify-between items-center relative">
                        {steps.map((label, i) => (
                            <div key={i} className="flex-1 text-center relative z-10">
                                <div className={`w-12 h-12 mx-auto rounded-full flex items-center justify-center text-lg font-bold transition-all
                                    ${step > i ? "bg-orange-600 text-white" : step === i ? "bg-orange-500 text-white" : "bg-gray-300 text-gray-600"}
                                `}>
                                    {i + 1}
                                </div>
                                <p className="text-xs md:text-sm mt-2 text-gray-600">{label}</p>
                            </div>
                        ))}
                        <div className="absolute top-6 left-0 w-full h-1 bg-gray-300 -z-10">
                            <div
                                className="h-full bg-orange-600 transition-all duration-500"
                                style={{ width: `${((step - 1) / (steps.length - 1)) * 100}%` }}
                            />
                        </div>
                    </div>
                </div>

                <form onSubmit={step === 5 ? onFinalSubmit : (e) => { e.preventDefault(); nextStep(); }}>

                    {/* STEP 1 */}
                    {step === 1 && (
                        <div className="space-y-5">
                            <h3 className="text-xl font-semibold text-gray-800">Basic Information</h3>
                            {["name", "description", "price", "category", "sub_category"].map(field => (
                                <div key={field}>
                                    <label className="block text-gray-700 font-medium capitalize">
                                        {field.replace(/_/g, " ")} {["name", "price"].includes(field) && "*"}
                                    </label>
                                    {field === "description" ? (
                                        <textarea name={field} value={form[field]} onChange={onChange} rows={4}
                                            className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-orange-500" />
                                    ) : (
                                        <input type={field === "price" ? "number" : "text"} name={field} value={form[field]} onChange={onChange}
                                            className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-orange-500" />
                                    )}
                                    {errors[field] && <p className="text-red-500 text-sm mt-1">{errors[field]}</p>}
                                </div>
                            ))}
                        </div>
                    )}

                    {/* STEP 2 */}
                    {step === 2 && (
                        <div className="space-y-5">
                            <h3 className="text-xl font-semibold text-gray-800">Product Details</h3>
                            {["brand", "model_name", "product_condition", "material", "purchase_year"].map(field => (
                                <div key={field}>
                                    <label className="block text-gray-700 font-medium capitalize">
                                        {field.replace(/_/g, " ")} {["brand", "model_name"].includes(field) && "*"}
                                    </label>
                                    <input type="text" name={field} value={form[field]} onChange={onChange}
                                        className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-orange-500" />
                                    {errors[field] && <p className="text-red-500 text-sm mt-1">{errors[field]}</p>}
                                </div>
                            ))}
                        </div>
                    )}

                    {/* STEP 3 & 4 - Photos */}
                    {(step === 3 || step === 4) && (
                        <div className="space-y-6">
                            <h3 className="text-xl font-semibold text-gray-800">Upload Photos - Part {step - 2}</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {(step === 3 ? ["frontPhoto", "backPhoto", "labelPhoto", "insidePhoto"] : ["buttonPhoto", "wearingPhoto", "wearingProof"]).map(key => (
                                    <div key={key}>
                                        <label className="block text-gray-700 font-medium">
                                            {key.replace(/Photo|photo/g, "").replace(/([A-Z])/g, ' $1').trim()} Photo
                                        </label>
                                        {current[key.replace("Photo", "_photo")] && (
                                            <img src={img(current[key.replace("Photo", "_photo")])} alt="" className="w-full h-48 object-cover rounded-lg mt-2 mb-3" />
                                        )}
                                        <input type="file" name={key} onChange={onFile}
                                            className="w-full border rounded-lg px-4 py-2" />
                                    </div>
                                ))}
                                {step === 4 && (
                                    <div className="md:col-span-2">
                                        <label className="block text-gray-700 font-medium">More Images</label>
                                        <div className="grid grid-cols-3 gap-3 my-3">
                                            {current.more_images?.split(",").filter(Boolean).map((u, i) => (
                                                <img key={i} src={img(u)} alt="" className="h-32 object-cover rounded-lg" />
                                            ))}
                                        </div>
                                        <input type="file" name="moreImages" multiple onChange={onFile}
                                            className="w-full border rounded-lg px-4 py-2" />
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* STEP 5 */}
                    {step === 5 && (
                        <div className="space-y-5">
                            <h3 className="text-xl font-semibold text-gray-800">Seller & Pickup Details</h3>
                            {["seller_name", "seller_email", "seller_phone", "pickup_address", "apartment", "city", "state", "pin_code"].map(field => (
                                <div key={field}>
                                    <label className="block text-gray-700 font-medium capitalize">
                                        {field.replace(/_/g, " ")} {["seller_name", "seller_email", "seller_phone", "pickup_address", "city", "state", "pin_code"].includes(field) && "*"}
                                    </label>
                                    <input type={field.includes("email") ? "email" : field.includes("phone") ? "tel" : "text"}
                                        name={field} value={form[field]} onChange={onChange}
                                        className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-orange-500" />
                                    {errors[field] && <p className="text-red-500 text-sm mt-1">{errors[field]}</p>}
                                </div>
                            ))}
                            <textarea name="seller_additional_info" value={form.seller_additional_info} onChange={onChange}
                                placeholder="Any additional info (optional)"
                                className="w-full border rounded-lg px-4 py-2" rows={3} />
                        </div>
                    )}

                    {/* Navigation Buttons */}
                    <div className="flex justify-between mt-10">
                        {step > 1 && (
                            <button type="button" onClick={prevStep}
                                className="px-6 py-3 bg-gray-400 text-white rounded-lg hover:bg-gray-500 transition">
                                ← Back
                            </button>
                        )}
                        {step < 5 ? (
                            <button type="submit"
                                className="px-8 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition ml-auto">
                                Next →
                            </button>
                        ) : (
                            <button type="submit" disabled={saving}
                                className="px-10 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-60 transition ml-auto">
                                {saving ? "Updating..." : "Update Product"}
                            </button>
                        )}
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditProduct;