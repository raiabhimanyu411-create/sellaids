// src/components/AddProductForm.jsx
import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";

// API URL from .env (production mein change kar dena)
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";
const PRODUCT_CONDITION_OPTIONS = [
  { value: "new", label: "New" },
  { value: "almost_new", label: "Almost New" },
  { value: "good", label: "Good" },
  { value: "hardly_ever_used", label: "Hardly Ever Used" },
  { value: "satisfactory", label: "Satisfactory" },
];
// Reusable FormField Component (exactly same as before)
const FormField = ({ field, value, onChange, error, disabled }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [filteredOptions, setFilteredOptions] = useState(field.options || []);
  const wrapperRef = useRef(null);


  useEffect(() => {
    if (searchValue && Array.isArray(field.options)) {
      const filtered = field.options.filter((opt) =>
        opt.name
          ? opt.name.toLowerCase().includes(searchValue.toLowerCase())
          : opt.toString().toLowerCase().includes(searchValue.toLowerCase())
      );
      setFilteredOptions(filtered);
    } else {
      setFilteredOptions(field.options || []);
    }
  }, [searchValue, field.options]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (selectedValue) => {
    // If condition field
    if (field.name === "product_condition") {
      // selectedValue === "new" / "good" etc.
      onChange({
        target: {
          name: field.name,
          value: selectedValue
        }
      });
    }

    // If category
    else if (field.name === "productCategory") {
      onChange({
        target: { name: field.name, value: selectedValue.name }
      });
    }

    // Default
    else {
      onChange({
        target: { name: field.name, value: selectedValue }
      });
    }

    setSearchValue("");
    setIsOpen(false);
  };


  const handleToggle = () => setIsOpen(!isOpen);

  // SELECT FIELDS
  if (
    field.type === "select" &&
    ["product_group", "fit", "size", "product_condition", "productCategory", "product_type", "invoice", "needs_repair", "original_box", "dust_bag"].includes(field.name)
  ) {
    return (
      <div className="flex flex-col" ref={wrapperRef}>
        <label className="text-gray-700 font-medium mb-1" data-field={field.name}>{field.label}</label>
        <div className="relative">
          <div
            className={`border rounded px-2 py-1 cursor-pointer focus:outline-none focus:ring-2 focus:ring-orange-400 ${disabled ? "bg-gray-100 cursor-not-allowed" : ""}`}
            onClick={disabled ? null : handleToggle}
          >
            {
              field.name === "product_condition"
                ? (PRODUCT_CONDITION_OPTIONS.find(x => x.value === value)?.label || "Select Condition")
                : (value || `Select ${field.label}`)
            }

          </div>
          {isOpen && !disabled && (
            <div className="absolute z-10 w-full bg-white border rounded-b mt-1 max-h-40 overflow-y-auto">
              <input
                type="text"
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                placeholder={`Search ${field.label}...`}
                className="border-b px-2 py-1 w-full focus:outline-none"
                onClick={(e) => e.stopPropagation()}
              />
              {filteredOptions.length > 0 ? (
                filteredOptions.map((opt, idx) => (
                  <div
                    key={idx}
                    onClick={() => handleSelect(opt)}
                    className="px-2 py-1 hover:bg-gray-100 cursor-pointer"
                  >
                    {
                      field.name === "product_condition"
                        ? PRODUCT_CONDITION_OPTIONS.find(x => x.value === opt)?.label   // UI label
                        : field.name === "productCategory"
                          ? opt.name
                          : opt
                    }


                  </div>
                ))
              ) : (
                <div className="px-2 py-1 text-gray-500">No options found</div>
              )}
            </div>
          )}
        </div>
        {error && <span className="text-red-500 text-xs mt-1">{error}</span>}
      </div>
    );
  }

  // FILE INPUT
  if (field.type === "file") {
    return (
      <div className="flex flex-col">
        <label className="text-gray-700 font-medium mb-1" data-field={field.name}>{field.label}</label>
        <input
          type="file"
          name={field.name}
          onChange={onChange}
          multiple={field.multiple}
          className="border rounded px-2 py-1"
          disabled={disabled}
          accept={field.accept || "*/*"}
        />
        {error && <span className="text-red-500 text-xs mt-1">{error}</span>}
      </div>
    );
  }

  // CHECKBOX
  if (field.type === "checkbox") {
    return (
      <div className="flex items-center space-x-2">
        <input type="checkbox" name={field.name} checked={value} onChange={onChange} disabled={disabled} />
        <label className="text-gray-700 text-sm" data-field={field.name}>{field.label}</label>
        {error && <span className="text-red-500 text-xs mt-1">{error}</span>}
      </div>
    );
  }

  // TEXTAREA
  if (field.type === "textarea") {
    return (
      <div className="flex flex-col">
        <label className="text-gray-700 font-medium mb-1" data-field={field.name}>{field.label}</label>
        <textarea
          name={field.name}
          value={value}
          onChange={onChange}
          placeholder={field.placeholder || ""}
          className="border rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-orange-400"
          rows="4"
        />
        {error && <span className="text-red-500 text-xs mt-1">{error}</span>}
      </div>
    );
  }

  // DEFAULT INPUT
  return (
    <div className="flex flex-col">
      <label className="text-gray-700 font-medium mb-1" data-field={field.name}>{field.label}</label>
      <input
        type={field.type || "text"}
        name={field.name}
        value={value}
        onChange={onChange}
        className="border rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-orange-400"
        disabled={disabled}
      />
      {error && <span className="text-red-500 text-xs mt-1">{error}</span>}
    </div>
  );
};

// MAIN COMPONENT
const AddProductForm = () => {
  const [step, setStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const initialFormData = {
    product_group: "",
    productCategory: "",
    category_id: "",
    product_type: "",
    product_condition: "",
    fit: "",
    size: "",
    other_size: "",
    product_color: "",
    brand: "",
    model_name: "",
    invoice: "No",
    invoice_photo: null,
    needs_repair: "No",
    repair_photo: null,
    original_box: "No",
    dust_bag: "No",
    additional_items: "",
    front_photo: null,
    back_photo: null,
    label_photo: null,
    inside_photo: null,
    button_photo: null,
    wearing_photo: null,
    more_images: [],
    purchase_price: "",
    selling_price: "",
    reason_to_sell: "",
    purchase_year: "",
    purchase_place: "",
    product_link: "",
    additional_info: {
      title: "",
      fabric: "",
      model_size: "",
      info: "",
      description: "",
    },
    agree: false,
  };

  const [formData, setFormData] = useState(initialFormData);
  const [errors, setErrors] = useState({});
  const [categories, setCategories] = useState([]);
  const [types, setTypes] = useState([]);
  const [apiError, setApiError] = useState(null);
  const [isLoadingCategories, setIsLoadingCategories] = useState(false);
  const [isLoadingTypes, setIsLoadingTypes] = useState(false);

  // FETCH CATEGORIES
  // FETCH CATEGORIES - YE PURA REPLACE KAR DE
  useEffect(() => {
    const fetchCategories = async () => {
      if (!formData.product_group) {
        setCategories([]);
        return;
      }

      setIsLoadingCategories(true);
      try {
        const params = new URLSearchParams();
        params.append("group", formData.product_group);

        const res = await axios.get(
          `${API_URL}/api/product/categories-list?${params.toString()}`,
          { withCredentials: true }
        );

        if (res.data.success) {
          setCategories(res.data.data || []);
        } else {
          setApiError("Failed to load categories");
          setCategories([]);
        }
      } catch (err) {
        setApiError("Failed to load categories");
        setCategories([]);
        toast.error("Could not load categories for this group");
      } finally {
        setIsLoadingCategories(false);
      }
    };

    fetchCategories();
  }, [formData.product_group]); // ← YE SABSE ZAROORI HAI

  // FETCH TYPES
  useEffect(() => {
    const fetchTypes = async () => {
      if (!formData.category_id) return setTypes([]);
      setIsLoadingTypes(true);
      try {
        const res = await axios.get(`${API_URL}/api/product?category_id=${formData.category_id}`, {
          withCredentials: true,
        });
        if (res.data.success) setTypes(res.data.data.map((t) => t.name || t.type_name || ""));
        else setApiError("Failed to load types");
      } catch (err) {
        setApiError("Failed to load types: " + (err.message || ""));
      } finally {
        setIsLoadingTypes(false);
      }
    };
    fetchTypes();
  }, [formData.category_id]);

  const handleChange = (e) => {

    const { name, value, type, checked, files } = e.target || e;
    if (name.startsWith("additional_info.")) {
      const key = name.split(".")[1];

      setFormData((prev) => ({
        ...prev,
        additional_info: {
          ...prev.additional_info,
          [key]: value,
        },
      }));
      return;
    }
    if (type === "file") {
      setFormData((prev) => ({
        ...prev,
        [name]: name === "more_images" ? Array.from(files) : files[0],
      }));
    } else if (type === "checkbox") {
      setFormData((prev) => ({ ...prev, [name]: checked }));
    } else if (name === "productCategory") {
      const selectedCategory = categories.find((c) => c.name === value);
      setFormData((prev) => ({
        ...prev,
        productCategory: value,
        category_id: selectedCategory ? selectedCategory.id : "",
        product_type: "",
      }));
    } else if (name === "size" && value === "Other") {
      setFormData((prev) => ({ ...prev, size: value }));
    } else if (name === "size" && value !== "Other") {
      setFormData((prev) => ({ ...prev, size: value, other_size: "" }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const validateStep = () => {
    const newErrors = {};
    const requiredFields = {
      1: ["product_group", "productCategory", "product_type", "product_condition", "brand"],
      2: ["invoice", "needs_repair", "original_box", "dust_bag"],
      3: ["front_photo", "back_photo", "label_photo", "inside_photo", "button_photo"],
      4: ["purchase_price", "selling_price", "purchase_year", "agree"],
    };

    if (requiredFields[step]) {
      requiredFields[step].forEach((f) => {
        if (!formData[f] || (f === "agree" && !formData.agree)) {
          const label = document.querySelector(`[data-field="${f}"]`)?.textContent || f;
          newErrors[f] = `${label.replace("*", "").trim()} is required`;
        }
      });
    }

    if (step === 2 && formData.invoice === "Yes" && !formData.invoice_photo) {
      newErrors.invoice_photo = "Invoice photo is required";
    }
    if (step === 2 && formData.needs_repair === "Yes" && !formData.repair_photo) {
      newErrors.repair_photo = "Repair photo is required";
    }

    if (formData.size === "Other" && !formData.other_size?.trim()) {
      newErrors.other_size = "Custom size is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const nextStep = () => {
    if (validateStep()) {
      setStep(step + 1);
      setErrors({});
    } else {
      const firstError = Object.values(errors)[0];
      toast.error(firstError || "Please fill all required fields.");
    }
  };


  const prevStep = () => {
    setStep(step - 1);
    setErrors({});
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    toast.dismiss();

    if (!validateStep()) {
      const firstError = Object.keys(errors).length > 0 ? Object.values(errors)[0] : "Please fill all required fields.";
      toast.error(firstError);
      return;
    }

    setIsSubmitting(true);
    setApiError(null);

    try {
      const data = new FormData();
      Object.entries(formData).forEach(([key, value]) => {

        // 🪓 1. additional_info → JSON STRING
        if (key === "additional_info") {
          data.append("additional_info", JSON.stringify(value));
          return;
        }

        // 🪓 2. Multiple images
        if (key === "more_images" && Array.isArray(value)) {
          value.forEach((file) => file && data.append("more_images", file));
          return;
        }

        // 🪓 3. Single file
        if (value instanceof File) {
          data.append(key, value);
          return;
        }

        // 🪓 4. Normal fields
        if (
          key !== "productCategory" &&
          key !== "agree" &&
          value !== null &&
          value !== ""
        ) {
          if (key !== "other_size") {
            data.append(key, value);
          }

          if (key === "other_size" && formData.size === "Other") {
            data.append("size_other", value.trim());
          }
        }
      });


      const res = await axios.post(`${API_URL}/api/product/add`, data, {
        headers: { "Content-Type": "multipart/form-data" },
        withCredentials: true,
      });

      if (res.data.success) {
        toast.success("Product added successfully!");
        setFormData(initialFormData);
        setStep(0);
        setErrors({});
      } else {
        toast.error(res.data.message || "Failed to add product");
      }
    } catch (err) {
      const message = err.response?.data?.message || err.message || "Submission failed";
      toast.error(message);
      setApiError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const steps = ["Guidelines", "Product", "Condition", "Image", "Price"];

  return (
    <div className="min-h-screen py-6">
      {/* Reduced side padding for mobile */}
      <div className="w-full max-w-3xl mx-auto bg-white shadow-xl rounded-2xl p-4 sm:p-6">
        {apiError && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg text-sm border-l-4 border-red-500">
            {apiError}
          </div>
        )}

        <div className="mb-6">
          <h2 className="text-xl sm:text-2xl font-semibold text-center text-gray-800 mb-4">Add New Product</h2>

          {/* Progress Bar - Desktop only */}
          <div className="hidden sm:block relative">
            <div className="flex justify-between items-center">
              {steps.map((stepName, index) => (
                <div key={index} className="flex-1 text-center relative z-10">
                  <div
                    className={`w-10 h-10 mx-auto rounded-full flex items-center justify-center text-sm font-semibold ${step > index
                      ? "bg-orange-600 text-white"
                      : step === index
                        ? "bg-orange-400 text-white"
                        : "bg-gray-200 text-gray-600"
                      } transition duration-200`}
                  >
                    {index + 1}
                  </div>
                  <p className="text-xs text-gray-600 mt-2">{stepName}</p>
                </div>
              ))}
            </div>
            <div className="absolute top-5 left-0 w-full h-1 bg-gray-200 z-0">
              {steps.map(
                (_, index) =>
                  index < step - 1 && (
                    <div
                      key={index}
                      className="absolute h-1 bg-orange-600"
                      style={{
                        width: `${100 / (steps.length - 1)}%`,
                        left: `${(100 / (steps.length - 1)) * index}%`,
                        top: 0,
                      }}
                    />
                  )
              )}
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">

          {/* STEP 0: GUIDELINES */}
          {step === 0 && (
            <div className="col-span-full">
              <div className="mt-4">
                <h4 className="text-md font-semibold text-gray-700">Seller Guidelines – Please Review Before Pickup</h4>
                <ul className="list-disc pl-5 text-sm text-gray-600 mt-2 space-y-1">
                  <li>Do not use the item after listing. It must remain in the same condition as shown in the photos.</li>
                  <li>
                    Please accurately select the product condition based on Sellaids classification:
                    <ul className="list-disc pl-5 mt-1">
                      <li>New – Unused, in original packaging/New: Up to 50% below MRP</li>
                      <li>Almost New – Minimal signs of use, excellent condition/Almost New: 50–60% below MRP</li>
                      <li>Hardly Ever Used – Very lightly used, no visible wear or tear/Hardly Ever Used: 60–70% below MRP</li>
                      <li>Good – Normal wear, fully functional/Good: More than 70% below MRP</li>
                      <li>Satisfactory – Heavily used, noticeable wear, but still functional/Satisfactory: More than 70% below MRP</li>
                    </ul>
                  </li>
                  <li>Upload clear, high-quality images (max 2 MB each).</li>
                  <li>Listings may take up to 7 days to go live to ensure optimal pricing.</li>
                  <li>Pickup will occur within 48 hours of sale.</li>
                  <li>Ensure the product is clean, washed, ironed, or dry-cleaned.</li>
                  <li>Package the item securely and label it with: SellAids' address as the recipient and your address as the sender.</li>
                  <li>Only genuine and authentic products are accepted. No counterfeits or replicas.</li>
                </ul>
              </div>
            </div>
          )}

          {/* STEP 1: PRODUCT */}
          {step === 1 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <h3 className="text-lg sm:text-xl font-semibold text-gray-800 col-span-full">Product</h3>
              {[
                { name: "product_group", label: "Group *", type: "select", options: ["", "Men", "Women", "Girl", "Boy"] },
                { name: "productCategory", label: "Product Category *", type: "select", options: isLoadingCategories ? [{ name: "Loading..." }] : categories },
                { name: "product_type", label: "Product Type *", type: "select", options: isLoadingTypes ? ["Loading..."] : types },
                { name: "product_condition", label: "Product Condition *", type: "select", options: PRODUCT_CONDITION_OPTIONS.map((x) => x.value), labelsMap: PRODUCT_CONDITION_OPTIONS },
                { name: "fit", label: "Fit(Only For Men Apparel)", type: "select", options: ["", "Slim", "Regular", "Loose", "Oversized", "Tailored", "Modern", "Fitted", "Other"] },
                {
                  name: "size",
                  label: "Size *",
                  type: "select",
                  options: [
                    "", "XS", "S", "M", "L", "XL", "XXL", "XXXL", "4xl", "5xl", "6xl",
                    "Kids-Upto 3 Months", "Kids-Upto 6 Months", "Kids- 6-9 Months", "Kids- 9-12 Months",
                    "Kids- 1-2 Years", "Kids- 3-4 Years", "Kids- 5-6 Years", "Kids- 7-8 Years",
                    "Kids- 9-10 Years", "Kids- 10-12 Years", "Kids- 13-14 Years", "K 15-16 Years", "Kids- 17-18 Years",
                    "Other"
                  ]
                },
                { name: "product_color", label: "Product Color", type: "text" },
                { name: "brand", label: "Brand *", type: "text" },
                { name: "model_name", label: "Model Name ", type: "text" },
              ].map((field) => (
                <React.Fragment key={field.name}>
                  {field.name === "size" ? (
                    <>
                      <FormField field={field} value={formData.size} onChange={handleChange} error={errors.size} />
                      {formData.size === "Other" && (
                        <div className="sm:col-span-2">
                          <label className="text-gray-700 font-medium mb-1" data-field="other_size">Other Size *</label>
                          <input
                            type="text"
                            name="other_size"
                            placeholder="Enter custom size (e.g. 28W x 32L)"
                            value={formData.other_size || ""}
                            onChange={handleChange}
                            className="w-full border rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-orange-400"
                          />
                          {errors.other_size && <span className="text-red-500 text-xs mt-1">{errors.other_size}</span>}
                        </div>
                      )}
                    </>
                  ) : (
                    <FormField
                      field={field}
                      value={formData[field.name]}
                      onChange={handleChange}
                      error={errors[field.name]}
                      disabled={field.name === "product_type" && !formData.productCategory}
                    />
                  )}
                </React.Fragment>
              ))}
              <FormField
                field={{ name: "additional_info.title", label: "Title" }}
                value={formData.additional_info.title}
                onChange={handleChange}
              />

              <FormField
                field={{ name: "additional_info.fabric", label: "Fabric" }}
                value={formData.additional_info.fabric}
                onChange={handleChange}
              />

              <FormField
                field={{ name: "additional_info.model_size", label: "Model Size" }}
                value={formData.additional_info.model_size}
                onChange={handleChange}
              />
            </div>
          )}

          {/* STEP 2: CONDITION */}
          {step === 2 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <h3 className="text-lg sm:text-xl font-semibold text-gray-800 col-span-full">Condition</h3>
              {[
                { name: "invoice", label: "Do You Have Invoice? *", type: "select", options: ["No", "Yes"] },
                { name: "invoice_photo", label: "Upload Invoice Photo", type: "file", accept: "image/*", disabled: formData.invoice !== "Yes" },
                { name: "needs_repair", label: "Your Product Needs Repair? *", type: "select", options: ["No", "Yes"] },
                { name: "repair_photo", label: "Repair Photo", type: "file", accept: "image/*", disabled: formData.needs_repair !== "Yes" },
                { name: "original_box", label: "Do You Have The Original Box? *", type: "select", options: ["No", "Yes"] },
                { name: "dust_bag", label: "Do You Have The Dust Bag? *", type: "select", options: ["No", "Yes"] },
                { name: "additional_items", label: "Any Additional Items?", type: "textarea" },
              ].map((field) => (
                <FormField
                  key={field.name}
                  field={field}
                  value={formData[field.name]}
                  onChange={handleChange}
                  error={errors[field.name]}
                  disabled={field.disabled}
                />
              ))}
              {formData.needs_repair === "Yes" && (
                <p className="text-gray-600 text-sm col-span-full">Charges on repair will be extra</p>
              )}
            </div>
          )}

          {/* STEP 3: IMAGE */}
          {step === 3 && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <h3 className="text-lg sm:text-xl font-semibold text-gray-800 col-span-full">Image</h3>
              {[
                { name: "front_photo", label: "Front Photo *", type: "file", accept: "image/*" },
                { name: "back_photo", label: "Back Photo *", type: "file", accept: "image/*" },
                { name: "label_photo", label: "Label/Logo Photo *", type: "file", accept: "image/*" },
                { name: "inside_photo", label: "Inside/Close Up Material Image *", type: "file", accept: "image/*" },
                { name: "button_photo", label: "Button/Studs/Zips/Work Image *", type: "file", accept: "image/*" },
                { name: "wearing_photo", label: "Image Of Wearing and Carrying ", type: "file", accept: "image/*" },
                { name: "more_images", label: "Upload More Images", type: "file", multiple: true, accept: "image/*" },
              ].map((field) => (
                <FormField
                  key={field.name}
                  field={field}
                  value={formData[field.name]}
                  onChange={handleChange}
                  error={errors[field.name]}
                />
              ))}
            </div>
          )}

          {/* STEP 4: PRICE - RESPONSIVE AGREEMENT FIXED */}
          {step === 4 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <h3 className="text-lg sm:text-xl font-semibold text-gray-800 col-span-full">Price</h3>
              {[
                { name: "purchase_price", label: "Purchase Price (INR) *", type: "number" },
                { name: "selling_price", label: "Selling Price (INR) *", type: "number" },
                { name: "reason_to_sell", label: "Reason To Sell *", type: "text" },
                { name: "purchase_year", label: "Purchase Year *", type: "number" },
                { name: "purchase_place", label: "Purchase Place *", type: "text" },
                { name: "product_link", label: "Product Reference Link ", type: "url" },
              ].map((field) => (
                <FormField key={field.name} field={field} value={formData[field.name]} onChange={handleChange} error={errors[field.name]} />
              ))}
              {/* Full Width Additional Info */}
              <div className="col-span-full">
                <div className="col-span-full">
                  <div className="mt-4">
                    <FormField
                      field={{
                        name: "additional_info.description",
                        label: "Product Description",
                        type: "textarea",
                      }}
                      value={formData.additional_info.description}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="mt-4">
                    <FormField
                      field={{
                        name: "additional_info.info",
                        label: "Additional Info",
                        type: "textarea",
                      }}
                      value={formData.additional_info.info}
                      onChange={handleChange}
                    />
                  </div>
                </div>

              </div>

              {/* RESPONSIVE "I agree to the terms" */}
              <div className="col-span-full mt-6 p-4 bg-gray-50 rounded-lg border">
                <label className="flex flex-col sm:flex-row items-start gap-3 cursor-pointer">
                  <div className="flex items-center gap-3 flex-shrink-0">
                    <input
                      type="checkbox"
                      name="agree"
                      checked={formData.agree}
                      onChange={handleChange}
                      className="w-5 h-5 text-orange-600 rounded focus:ring-orange-500"
                    />
                    <span className="font-semibold text-gray-800">I agree to the terms *</span>
                  </div>
                  <span className="text-sm text-gray-600 leading-relaxed">
                    By submitting this form, I agree to abide by our policies, terms and conditions, and seller declaration guidelines.
                  </span>
                </label>
                {errors.agree && <p className="text-red-500 text-xs mt-2">{errors.agree}</p>}
              </div>
            </div>
          )}

          {/* BUTTONS */}
          <div className="mt-8 pt-6 border-t">
            <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-between items-center">
              {step > 0 && (
                <button
                  type="button"
                  onClick={prevStep}
                  disabled={isSubmitting}
                  className="w-full sm:w-auto px-8 py-3 bg-gray-300 hover:bg-gray-400 text-gray-800 font-medium rounded-lg transition disabled:opacity-50 order-2 sm:order-1"
                >
                  Back
                </button>
              )}

              <div className="w-full sm:w-auto order-1 sm:order-2">
                {step < steps.length - 1 ? (
                  <button
                    type="button"
                    onClick={nextStep}
                    disabled={isSubmitting}
                    className="w-full px-10 py-3 bg-orange-500 hover:bg-orange-600 text-white font-medium rounded-lg transition disabled:opacity-50"
                  >
                    Next
                  </button>
                ) : (
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full px-10 py-3 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition disabled:opacity-50 shadow-lg"
                  >
                    {isSubmitting ? "Submitting..." : "Submit Product"}
                  </button>
                )}
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddProductForm;