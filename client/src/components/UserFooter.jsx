import React from "react";
import { ArrowLeft } from "lucide-react";

const UserFooter = () => {
  const goToWebsite = () => {
    window.location.href = "/";
  };

  return (
    <div className="mt-4 py-4 border-t border-gray-200 bg-gray-50">
      <div className="max-w-3xl mx-auto text-center">
        <button
          onClick={goToWebsite}
          className="inline-flex items-center gap-2 text-gray-700 hover:text-red-600 font-medium text-lg transition-colors duration-200 group"
        >
          <ArrowLeft size={20} className="mr-2 group-hover:-translate-x-1 transition-transform" />
          Back to Website
        </button>
      </div>
    </div>
  );
};

export default UserFooter;