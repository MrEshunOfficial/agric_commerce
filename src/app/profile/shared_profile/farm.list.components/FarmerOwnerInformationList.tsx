import React from "react";
import { User, Phone, Mail, Home } from "lucide-react";
import { FarmProfileData } from "@/store/type/formtypes";
import { FaMale } from "react-icons/fa";

const FarmerInformationDetails: React.FC<{ profile: FarmProfileData }> = ({
  profile,
}) => {
  return (
    <div className="w-full space-y-6 p-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
      <div className="flex items-center justify-between border-b pb-3">
        <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 flex items-center">
          <User className="mr-3 text-primary" size={24} />
          Farmer Information
        </h3>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Personal Information */}
        <div className="space-y-4">
          <div className="flex items-center">
            <User className="mr-3 text-primary/70" size={20} />
            <div>
              <label className="block text-sm font-medium text-gray-600 dark:text-gray-400">
                Full Name
              </label>
              <p className="text-base font-semibold text-gray-900 dark:text-gray-100">
                {profile.fullName}
              </p>
            </div>
          </div>

          <div className="flex items-center">
            <FaMale className="mr-3 text-primary/70" size={20} />
            <div>
              <label className="block text-sm font-medium text-gray-600 dark:text-gray-400">
                Gender
              </label>
              <p className="text-base text-gray-900 dark:text-gray-100">
                {profile.gender}
              </p>
            </div>
          </div>
        </div>

        {/* Contact Information */}
        <div className="space-y-4">
          <div className="flex items-center">
            <Phone className="mr-3 text-primary/70" size={20} />
            <div>
              <label className="block text-sm font-medium text-gray-600 dark:text-gray-400">
                Contact Phone
              </label>
              <p className="text-base text-gray-900 dark:text-gray-100">
                {profile.contactPhone}
              </p>
            </div>
          </div>

          {profile.contactEmail && (
            <div className="flex items-center">
              <Mail className="mr-3 text-primary/70" size={20} />
              <div>
                <label className="block text-sm font-medium text-gray-600 dark:text-gray-400">
                  Email
                </label>
                <p className="text-base text-gray-900 dark:text-gray-100">
                  {profile.contactEmail}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Ownership and Additional Information */}
      <div className="border-t pt-4 mt-4">
        <div className="flex items-center mb-4">
          <Home className="mr-3 text-primary/70" size={20} />
          <h4 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            Ownership Details
          </h4>
        </div>
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-600 dark:text-gray-400">
              Ownership Status
            </label>
            <p className="text-base text-gray-900 dark:text-gray-100">
              {profile.ownershipStatus}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FarmerInformationDetails;
