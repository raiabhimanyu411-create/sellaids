// import React, { useState, useEffect, useRef } from "react";
// import axios from "axios";
// import { useVendorStore } from '../../stores/useVendorStore';

// // Reusable Form Field Component with Searchable Dropdown
// const FormField = ({ field, value, onChange, error, disabled }) => {
//   const [isOpen, setIsOpen] = useState(false);
//   const [searchValue, setSearchValue] = useState("");
//   const [filteredOptions, setFilteredOptions] = useState(field.options);
//   const wrapperRef = useRef(null);

//   useEffect(() => {
//     // Filter options based on search value
//     if (searchValue && Array.isArray(field.options)) {
//       const filtered = field.options.filter(opt =>
//         opt.name ? opt.name.toLowerCase().includes(searchValue.toLowerCase()) : opt.toLowerCase().includes(searchValue.toLowerCase())
//       );
//       setFilteredOptions(filtered);
//     } else {
//       setFilteredOptions(field.options);
//     }
//   }, [searchValue, field.options]);

//   useEffect(() => {
//     // Close dropdown when clicking outside
//     const handleClickOutside = (event) => {
//       if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
//         setIsOpen(false);
//       }
//     };
//     document.addEventListener("mousedown", handleClickOutside);
//     return () => {
//       document.removeEventListener("mousedown", handleClickOutside);
//     };
//   }, []);

//   const handleSelect = (selectedValue) => {
//     onChange({ target: { name: field.name, value: field.name === "productCategory" ? selectedValue.name : selectedValue } });
//     setSearchValue("");
//     setIsOpen(false);
//   };

//   const handleToggle = () => {
//     console.log("Toggling dropdown for", field.name, "isOpen:", !isOpen); // Debug toggle
//     setIsOpen(!isOpen);
//   };

//   if (field.type === "select" && (field.name === "group" || field.name === "fit" || field.name === "size" || field.name === "productCondition" || field.name === "productCategory" || field.name === "productType" || field.name === "invoice" || field.name === "needsRepair")) {
//     return (
//       <div className="flex flex-col" ref={wrapperRef}>
//         <label className="text-gray-700 font-medium mb-1">{field.label}</label>
//         <div className="relative">
//           <div
//             className="border rounded px-2 py-1 cursor-pointer focus:outline-none focus:ring-2 focus:ring-orange-400"
//             onClick={handleToggle} // Use separate function for debugging
//           >
//             {value || `Select ${field.label}`}
//           </div>
//           {isOpen && (
//             <div className="absolute z-10 w-full bg-white border rounded-b mt-1 max-h-40 overflow-y-auto" style={{ zIndex: 1000 }}>
//               <input
//                 type="text"
//                 value={searchValue}
//                 onChange={(e) => setSearchValue(e.target.value)}
//                 placeholder={`Search ${field.label}...`}
//                 className="border-b px-2 py-1 w-full focus:outline-none"
//               />
//               {filteredOptions.length > 0 ? (
//                 filteredOptions.map((opt, idx) => (
//                   <div
//                     key={idx}
//                     onClick={() => handleSelect(opt)}
//                     className="px-2 py-1 hover:bg-gray-100 cursor-pointer"
//                   >
//                     {field.name === "productCategory" ? opt.name : opt}
//                   </div>
//                 ))
//               ) : (
//                 <div className="px-2 py-1 text-gray-500">No options found</div>
//               )}
//             </div>
//           )}
//         </div>
//         {error && <span className="text-red-500 text-xs mt-1">{error}</span>}
//       </div>
//     );
//   } else if (field.type === "file") {
//     return (
//       <div className="flex flex-col">
//         <label className="text-gray-700 font-medium mb-1">{field.label}</label>
//         <input
//           type="file"
//           name={field.name}
//           onChange={onChange}
//           multiple={field.multiple}
//           className="border rounded px-2 py-1"
//         />
//         {error && <span className="text-red-500 text-xs mt-1">{error}</span>}
//       </div>
//     );
//   } else if (field.type === "checkbox") {
//     return (
//       <div className="flex items-center space-x-2">
//         <input type="checkbox" name={field.name} checked={value} onChange={onChange} />
//         <label className="text-gray-700 text-sm">{field.label}</label>
//         {error && <span className="text-red-500 text-xs mt-1">{error}</span>}
//       </div>
//     );
//   } else if (field.type === "textarea") {
//     return (
//       <div className="flex flex-col">
//         <label className="text-gray-700 font-medium mb-1">{field.label}</label>
//         <textarea
//           name={field.name}
//           value={value}
//           onChange={onChange}
//           className="border rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-orange-400"
//           rows="4"
//         />
//         {error && <span className="text-red-500 text-xs mt-1">{error}</span>}
//       </div>
//     );
//   } else {
//     return (
//       <div className="flex flex-col">
//         <label className="text-gray-700 font-medium mb-1">{field.label}</label>
//         <input
//           type={field.type || "text"}
//           name={field.name}
//           value={value}
//           onChange={onChange}
//           className="border rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-orange-400"
//         />
//         {error && <span className="text-red-500 text-xs mt-1">{error}</span>}
//       </div>
//     );
//   }
// };

// const AddProductForm = () => {
//   const [step, setStep] = useState(0); // Start at Step 0 for Guidelines
//   const vendorInfo = useVendorStore((state) => state.vendorInfo);

//   const initialFormData = {
//     group: "",
//     productCategory: "",
//     categoryId: "",
//     productType: "",
//     productCondition: "",
//     fit: "",
//     size: "",
//     otherSize: "",
//     productColor: "",
//     brand: "",
//     modelName: "",
//     invoice: "No",
//     invoicePhoto: null,
//     needsRepair: "No",
//     repairDetails: "",
//     repairPhoto: null,
//     originalBox: "No",
//     dustBag: "No",
//     additionalItems: "",
//     frontPhoto: null,
//     backPhoto: null,
//     labelPhoto: null,
//     insidePhoto: null,
//     buttonPhoto: null,
//     wearingPhoto: null,
//     moreImages: [],
//     purchasePrice: "",
//     sellingPrice: "",
//     reasonToSell: "",
//     purchaseYear: "",
//     purchasePlace: "",
//     productLink: "",
//     additionalInfo: "",
//     name: "",
//     email: "",
//     phone: "",
//     address: "",
//     apartment: "",
//     city: "",
//     state: "",
//     zip: "",
//     sellerInfo: "",
//     agree: false,
//   };

//   const [formData, setFormData] = useState(initialFormData);
//   const [errors, setErrors] = useState({});
//   const [categories, setCategories] = useState([]);
//   const [types, setTypes] = useState([]);
//   const [apiError, setApiError] = useState(null);
//   const [isLoadingCategories, setIsLoadingCategories] = useState(false);
//   const [isLoadingTypes, setIsLoadingTypes] = useState(false);

//   // Prefill vendor info (no longer needed since Step 5 is removed)
//   useEffect(() => {
//     // Removed vendor info prefill logic
//   }, [vendorInfo, step]);

//   // Fetch categories with search
//   useEffect(() => {
//     const fetchCategories = async () => {
//       setIsLoadingCategories(true);
//       try {
//         const url = `http://localhost:5000api/product/categories-list`;
//         const res = await axios.get(url, { withCredentials: true });
//         console.log("Categories API response:", res.data);
//         if (res.data.success) {
//           setCategories(res.data.data || []);
//         } else {
//           console.error("Categories API success false:", res.data);
//           setCategories([]);
//           setApiError("Failed to load categories: " + (res.data.message || "Unknown error"));
//         }
//       } catch (err) {
//         console.error("❌ Error fetching categories:", err.response?.data || err.message);
//         setApiError("Failed to load categories: " + (err.response?.data?.message || err.message));
//         setCategories([]);
//       } finally {
//         setIsLoadingCategories(false);
//       }
//     };
//     fetchCategories();
//   }, []);

//   // Fetch product types with search when category changes
//   useEffect(() => {
//     const fetchTypes = async () => {
//       if (!formData.categoryId) {
//         setTypes([]);
//         setIsLoadingTypes(false);
//         return;
//       }
//       setIsLoadingTypes(true);
//       try {
//         const url = `http://localhost:5000api/product?category_id=${formData.categoryId}`;
//         const res = await axios.get(url, { withCredentials: true });
//         console.log("Product Types API response:", res.data);
//         if (res.data.success) {
//           setTypes(res.data.data.map(type => type.name || type.type_name || "") || []);
//         } else {
//           console.error("Product Types API success false:", res.data);
//           setTypes([]);
//           setApiError("Failed to load product types: " + (res.data.message || "Unknown error"));
//         }
//       } catch (err) {
//         console.error("❌ Error fetching product types:", err.response?.data || err.message);
//         setApiError("Failed to load product types: " + (err.response?.data?.message || err.message));
//         setTypes([]);
//       } finally {
//         setIsLoadingTypes(false);
//       }
//     };
//     fetchTypes();
//   }, [formData.categoryId]);

//   // Handle form change
//   const handleChange = (e) => {
//     const { name, value, type, checked, files } = e.target || e; // Handle custom event object
//     if (type === "file") {
//       if (name === "moreImages") {
//         setFormData((prev) => ({ ...prev, [name]: Array.from(files) }));
//       } else {
//         setFormData((prev) => ({ ...prev, [name]: files[0] }));
//       }
//     } else if (type === "checkbox") {
//       setFormData((prev) => ({ ...prev, [name]: checked }));
//     } else if (name === "productCategory") {
//       const selectedCategory = categories.find(cat => cat.name === value);
//       setFormData((prev) => ({
//         ...prev,
//         productCategory: value,
//         categoryId: selectedCategory ? selectedCategory.id : "",
//         productType: "",
//       }));
//     } else {
//       setFormData((prev) => ({ ...prev, [name]: value }));
//     }
//   };

//   // Step validation
//   const validateStep = () => {
//     const newErrors = {};
//     const requiredFields = {
//       1: ["group", "productCategory", "productType", "brand"],
//       2: ["invoice", "needsRepair", "originalBox", "dustBag"],
//       3: ["frontPhoto", "backPhoto", "labelPhoto", "insidePhoto", "buttonPhoto", "wearingPhoto"],
//       4: ["purchasePrice", "sellingPrice", "purchaseYear", "agree"],
//     };

//     if (requiredFields[step]) {
//       requiredFields[step].forEach((field) => {
//         if (!formData[field] || (field === "agree" && !formData.agree)) {
//           newErrors[field] = "This field is required";
//         }
//       });
//     }

//     if (step === 2 && formData.invoice === "Yes" && !formData.invoicePhoto) {
//       newErrors.invoicePhoto = "Please upload the invoice photo";
//     }
//     if (step === 2 && formData.needsRepair === "Yes" && !formData.repairPhoto) {
//       newErrors.repairPhoto = "Please upload the repair photo";
//     }

//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   };

//   const nextStep = () => {
//     if (step === 0 || (step === 1 || validateStep())) {
//       setStep(step + 1);
//       setErrors({});
//     }
//   };

//   const prevStep = () => {
//     setStep(step - 1);
//     setErrors({});
//   };

//   // Submit
//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (!validateStep()) {
//       console.log("Validation failed:", errors);
//       return;
//     }
//     if (!vendorInfo?.id) {
//       alert("Vendor ID missing. Please login again.");
//       return;
//     }

//     try {
//       const data = new FormData();
//       Object.entries(formData).forEach(([key, value]) => {
//         if (Array.isArray(value) && key === "moreImages") {
//           value.forEach((file, index) => data.append(`moreImages[${index}]`, file)); // Append multiple files with index
//         } else if (value instanceof File) {
//           data.append(key, value);
//         } else {
//           if (key === "sellingPrice") data.append("price", value);
//           else if (key === "group") data.append("product_group", value);
//           else if (key === "categoryId") data.append("category_id", value);
//           else if (key === "modelName") data.append("model_name", value);
//           else if (key !== "productCategory") data.append(key, value);
//         }
//       });
//       data.append("vendorId", vendorInfo.id);

//       console.log("Submitting data:", Object.fromEntries(data)); // Log FormData for debugging
//       const response = await axios.post(`${import.meta.env.VITE_API_URL}api/product/add`, data, {
//         headers: { "Content-Type": "multipart/form-data" },
//         withCredentials: true,
//       });

//       if (response.data.success) {
//         alert("✅ Product added successfully!");
//         setFormData(initialFormData);
//         setStep(0); // Reset to Guidelines step after submission
//       } else {
//         throw new Error(response.data.message || "Failed to add product");
//       }
//     } catch (err) {
//       console.error("❌ Error submitting product:", err.response?.data || err.message);
//       alert(`❌ Failed to add product: ${err.response?.data?.message || err.message}`);
//     }
//   };

//   const steps = ["Guidelines", "Product", "Condition", "Image", "Price"];

//   return (
//     <div className="min-h-screen bg-gray-100 px-2 sm:px-4 py-4 sm:py-6">
//       <div className="w-full sm:max-w-3xl mx-auto bg-white shadow-xl rounded-2xl p-2 sm:p-4 md:p-6">
//         {apiError && <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg text-sm">{apiError}</div>}

//         <div className="mb-6">
//           <h2 className="text-xl sm:text-2xl font-semibold text-center text-gray-800 mb-3 sm:mb-4">Add New Product</h2>
//           <div className="hidden sm:block relative">
//             <div className="flex justify-between items-center">
//               {steps.map((stepName, index) => (
//                 <div key={index} className="flex-1 text-center relative z-10">
//                   <div className={`w-10 h-10 mx-auto rounded-full flex items-center justify-center text-sm font-semibold ${step > index + 1 ? "bg-orange-600 text-white" : step === index + 1 ? "bg-orange-400 text-white" : "bg-gray-200 text-gray-600"} transition duration-200`}>
//                     {index + 1}
//                   </div>
//                   <p className="text-xs text-gray-600 mt-2">{stepName}</p>
//                 </div>
//               ))}
//             </div>
//             <div className="absolute top-5 left-0 w-full h-1 bg-gray-200 z-0">
//               {steps.map((_, index) => index < step - 1 && (
//                 <div key={index} className="absolute h-1 bg-orange-600" style={{ width: `${100 / (steps.length - 1)}%`, left: `${(100 / (steps.length - 1)) * index}%`, top: 0 }} />
//               ))}
//             </div>
//           </div>
//         </div>

//         <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
//           {step === 0 && (
//             <div className="col-span-full">
//               <h3 className="text-lg sm:text-xl font-semibold text-gray-800">Guidelines</h3>
//               <div className="mt-4">
//                 <h4 className="text-md font-semibold text-gray-700">Seller Guidelines – Please Review Before Pickup</h4>
//                 <ul className="list-disc pl-5 text-sm text-gray-600 mt-2 space-y-1">
//                   <li>Do not use the item after listing. It must remain in the same condition as shown in the photos.</li>
//                   <li>Please accurately select the product condition based on Sellaids classification:
//                     <ul className="list-disc pl-5 mt-1">
//                       <li>New – Unused, in original packaging/New: Up to 50% below MRP</li>
//                       <li>Almost New – Minimal signs of use, excellent condition/Almost New: 50–60% below MRP</li>
//                       <li>Hardly Ever Used – Very lightly used, no visible wear or tear/Hardly Ever Used: 60–70% below MRP</li>
//                       <li>Good – Normal wear, fully functional/Good: More than 70% below MRP</li>
//                       <li>Satisfactory – Heavily used, noticeable wear, but still functional/Satisfactory: More than 70% below MRP</li>
//                     </ul>
//                   </li>
//                   <li>Upload clear, high-quality images (max 2 MB each).</li>
//                   <li>Listings may take up to 7 days to go live to ensure optimal pricing.</li>
//                   <li>Pickup will occur within 48 hours of sale.</li>
//                   <li>Ensure the product is clean, washed, ironed, or dry-cleaned.</li>
//                   <li>Package the item securely and label it with: SellAids’ address as the recipient and your address as the sender.</li>
//                   <li>Only genuine and authentic products are accepted. No counterfeits or replicas.</li>
//                 </ul>
//               </div>
//             </div>
//           )}

//           {step === 1 && (
//             <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-4">
//               <h3 className="text-lg sm:text-xl font-semibold text-gray-800 col-span-full">Product</h3>
//               {[
//                 { name: "group", label: "Group *", type: "select", options: ["", "Men", "Women", "Girl", "Boy"] },
//                 { name: "productCategory", label: "Product Category *", type: "select", options: isLoadingCategories ? [{ name: "Loading..." }] : categories },
//                 { name: "productType", label: "Product Type *", type: "select", options: isLoadingTypes ? ["Loading..."] : types },
//                 { name: "productCondition", label: "Product Condition", type: "select", options: ["", "New", "Almost New", "Hardly Ever Used", "Good", "Satisfactory"] },
//                 { name: "fit", label: "Fit", type: "select", options: ["", "Comfort Fit", "Slim Fit", "Regular Fit", "Others"] },
//                 { name: "size", label: "Size", type: "select", options: ["", "XXS", "XS", "S", "M", "L", "XL", "XXL", "XXXL", "4xl", "5xl", "6xl", "Kids-Upto 3 Months", "Kids-Upto 6 Months", "Kids- 6-9 Months", "Kids- 9-12 Months", "Kids- 1-2 Years", "Kids- 3-4 Years", "Kids- 5-6 Years", "Kids- 7-8 Years", "Kids- 9-10 Years", "Kids- 10-12 Years", "Kids- 13-14 Years", "K 15-16 Years", "Kids- 17-18 Years"] },
//                 { name: "otherSize", label: "Other Size", type: "text" },
//                 { name: "productColor", label: "Product Color", type: "text" },
//                 { name: "brand", label: "Brand *", type: "text" },
//                 { name: "modelName", label: "Model Name", type: "text" },
//               ].map((field) => (
//                 <FormField
//                   key={field.name}
//                   field={field}
//                   value={formData[field.name]}
//                   onChange={handleChange}
//                   error={errors[field.name]}
//                   disabled={field.disabled || (field.name === "productType" && !formData.productCategory)}
//                 />
//               ))}
//             </div>
//           )}

//           {step === 2 && (
//             <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-4">
//               <h3 className="text-lg sm:text-xl font-semibold text-gray-800 col-span-full">Condition</h3>
//               {[
//                 { name: "invoice", label: "Do You Have Invoice?", type: "select", options: ["No", "Yes"] },
//                 { name: "invoicePhoto", label: "Upload Invoice Photo", type: "file", disabled: formData.invoice !== "Yes" },
//                 { name: "needsRepair", label: "Your Product Needs Repair?", type: "select", options: ["No", "Yes"] },
//                 { name: "repairDetails", label: "If Yes Then What Repair?", type: "text", disabled: formData.needsRepair !== "Yes" },
//                 { name: "repairPhoto", label: "Repair Photo", type: "file", disabled: formData.needsRepair !== "Yes" },
//                 { name: "originalBox", label: "Do You Have The Original Box?", type: "select", options: ["No", "Yes"] },
//                 { name: "dustBag", label: "Do You Have The Dust Bag?", type: "select", options: ["No", "Yes"] },
//                 { name: "additionalItems", label: "Any Additional Items?", type: "textarea" },
//               ].map((field) => (
//                 <FormField
//                   key={field.name}
//                   field={field}
//                   value={formData[field.name]}
//                   onChange={handleChange}
//                   error={errors[field.name]}
//                   disabled={field.disabled}
//                 />
//               ))}
//               {formData.needsRepair === "Yes" && (
//                 <p className="text-gray-600 text-sm mt-1">Charges on repair will be extra</p>
//               )}
//             </div>
//           )}

//           {step === 3 && (
//             <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-4">
//               <h3 className="text-lg sm:text-xl font-semibold text-gray-800 col-span-full">Image</h3>
//               {[
//                 { name: "frontPhoto", label: "Front Photo *", type: "file" },
//                 { name: "backPhoto", label: "Back Photo *", type: "file" },
//                 { name: "labelPhoto", label: "Label/Logo Photo *", type: "file" },
//                 { name: "insidePhoto", label: "Inside/ Close Up Material Image *", type: "file" },
//                 { name: "buttonPhoto", label: "Button/Studs/Zips/Work Image *", type: "file" },
//                 { name: "wearingPhoto", label: "Image Of Wearing/Carrying *", type: "file" },
//                 { name: "moreImages", label: "Upload more image", type: "file", multiple: true },
//               ].map((field) => (
//                 <FormField
//                   key={field.name}
//                   field={field}
//                   value={formData[field.name]}
//                   onChange={handleChange}
//                   error={errors[field.name]}
//                 />
//               ))}
//             </div>
//           )}

//           {step === 4 && (
//             <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-4">
//               <h3 className="text-lg sm:text-xl font-semibold text-gray-800 col-span-full">Price</h3>
//               {[
//                 { name: "purchasePrice", label: "Purchase Price (INR) *", type: "text" },
//                 { name: "sellingPrice", label: "Selling Price (INR) *", type: "text" },
//                 { name: "reasonToSell", label: "Reason To Sell", type: "text" },
//                 { name: "purchaseYear", label: "Purchase Year *", type: "text" },
//                 { name: "purchasePlace", label: "Purchase Place", type: "text" },
//                 { name: "productLink", label: "Product Reference Link", type: "text" },
//                 { name: "additionalInfo", label: "Additional Product Information", type: "textarea" },
//               ].map((field) => (
//                 <FormField
//                   key={field.name}
//                   field={field}
//                   value={formData[field.name]}
//                   onChange={handleChange}
//                   error={errors[field.name]}
//                 />
//               ))}
//               <div className="sm:col-span-full mt-4">
//                 <label className="flex items-center space-x-2">
//                   <FormField
//                     field={{ name: "agree", label: "I agree to the terms *", type: "checkbox" }}
//                     value={formData.agree}
//                     onChange={handleChange}
//                     error={errors.agree}
//                   />
//                   <span className="text-sm text-gray-600">By submitting this form, I agree to abide by our policies, terms and conditions, and seller declaration guidelines.</span>
//                 </label>
//               </div>
//             </div>
//           )}

//           {/* Navigation Buttons */}
//           <div className="flex flex-col sm:flex-row justify-between mt-4 sm:mt-6 space-y-2 sm:space-y-0 sm:space-x-4">
//             {step > 0 && (
//               <button type="button" onClick={prevStep} className="w-full sm:w-auto px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition duration-200">
//                 PREVIOUS
//               </button>
//             )}
//             <div className="flex-1" />
//             {step < 4 && (
//               <button type="button" onClick={nextStep} className="w-full sm:w-auto px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition duration-200">
//                 NEXT
//               </button>
//             )}
//             {step === 4 && (
//               <button type="submit" className="w-full sm:w-auto px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition duration-200">
//                 SUBMIT
//               </button>
//             )}
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default AddProductForm;