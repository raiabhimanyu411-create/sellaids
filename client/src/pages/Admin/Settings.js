import { useState } from "react";

const menuItems = [
  "General Settings",
  "Payment Gateways",
  "Shipping & Tax",
  "Notifications",
  "Email Templates",
  "Security",
];

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("General Settings");

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-7xl mx-auto bg-white shadow rounded-lg flex">
        {/* Sidebar */}
        <div className="w-64 border-r">
          <div className="p-4 text-lg font-semibold border-b">Settings Menu</div>
          <ul>
            {menuItems.map((item) => (
              <li
                key={item}
                className={`p-4 cursor-pointer hover:bg-gray-100 ${
                  activeTab === item
                    ? "bg-blue-100 text-blue-600 font-semibold"
                    : ""
                }`}
                onClick={() => setActiveTab(item)}
              >
                {item}
              </li>
            ))}
          </ul>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-6">
          <h2 className="text-2xl font-bold mb-4">Settings & Configuration</h2>
          <p className="text-gray-500 mb-6">
            Manage platform settings and configurations
          </p>

          {activeTab === "General Settings" && <GeneralSettings />}
          {activeTab === "Payment Gateways" && <PaymentGateways />}
          {activeTab === "Shipping & Tax" && <ShippingTax />}
          {activeTab === "Notifications" && <Notifications />}
          {activeTab === "Email Templates" && <EmailTemplates />}
          {activeTab === "Security" && <SecuritySettings />}
        </div>
      </div>
    </div>
  );
}

function GeneralSettings() {
  return (
    <FormLayout onSubmitText="Save Changes">
      <Input label="Site Name" placeholder="E-Commerce Platform" />
      <Input label="Site Email" type="email" placeholder="admin@platform.com" />
      <Input label="Phone Number" placeholder="+92 300 1234567" />
      <Input label="Address" placeholder="Karachi, Pakistan" />
      <Select label="Currency" options={["Pakistani Rupee (PKR)", "USD", "EUR"]} />
      <Select label="Timezone" options={["Asia/Karachi", "Asia/Dubai", "UTC"]} />
    </FormLayout>
  );
}

function PaymentGateways() {
  return (
    <FormLayout onSubmitText="Update Gateway Settings">
      <Select label="Select Gateway" options={["Stripe", "PayPal", "JazzCash", "Easypaisa"]} />
      <Input label="Public Key / Client ID" />
      <Input label="Secret Key" type="password" />
      <Select label="Mode" options={["Sandbox", "Live"]} />
    </FormLayout>
  );
}

function ShippingTax() {
  return (
    <FormLayout onSubmitText="Save Shipping & Tax">
      <Input label="Flat Shipping Rate" placeholder="e.g. 250" />
      <Select label="Shipping Available In" options={["Pakistan", "International", "Both"]} />
      <Input label="Tax Rate (%)" placeholder="e.g. 15" />
      <Select label="Apply Tax On" options={["Products", "Shipping", "Both"]} />
    </FormLayout>
  );
}

function Notifications() {
  return (
    <FormLayout onSubmitText="Save Notification Settings">
      <Checkbox label="Enable Order Confirmation Email" />
      <Checkbox label="Enable Shipping Notification" />
      <Checkbox label="Enable New User Registration Alert" />
    </FormLayout>
  );
}

function EmailTemplates() {
  return (
    <FormLayout onSubmitText="Save Templates">
      <Textarea label="Order Confirmation Template" placeholder="Your order has been placed..." />
      <Textarea label="Shipping Notification Template" placeholder="Your order has been shipped..." />
    </FormLayout>
  );
}

function SecuritySettings() {
  return (
    <FormLayout onSubmitText="Update Security Settings">
      <Checkbox label="Enable Two-Factor Authentication (2FA)" />
      <Checkbox label="Require Strong Passwords" />
      <Input label="Session Timeout (minutes)" placeholder="e.g. 30" />
    </FormLayout>
  );
}

/* --- Shared Components --- */

function FormLayout({ children, onSubmitText = "Save" }) {
  return (
    <form className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {children}
      <div className="col-span-full">
        <button
          type="submit"
          className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
        >
          {onSubmitText}
        </button>
      </div>
    </form>
  );
}

function Input({ label, type = "text", placeholder = "" }) {
  return (
    <div>
      <label className="block font-medium mb-1">{label}</label>
      <input
        type={type}
        className="w-full border rounded px-3 py-2"
        placeholder={placeholder}
      />
    </div>
  );
}

function Select({ label, options = [] }) {
  return (
    <div>
      <label className="block font-medium mb-1">{label}</label>
      <select className="w-full border rounded px-3 py-2">
        {options.map((opt, idx) => (
          <option key={idx}>{opt}</option>
        ))}
      </select>
    </div>
  );
}

function Checkbox({ label }) {
  return (
    <div className="col-span-full flex items-center space-x-2">
      <input type="checkbox" className="w-4 h-4" />
      <label className="text-sm">{label}</label>
    </div>
  );
}

function Textarea({ label, placeholder }) {
  return (
    <div className="col-span-full">
      <label className="block font-medium mb-1">{label}</label>
      <textarea
        rows="4"
        className="w-full border rounded px-3 py-2"
        placeholder={placeholder}
      />
    </div>
  );
}
