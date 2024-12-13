import React from "react";
import { Users, UserCheck, Phone, Briefcase } from "lucide-react";
import { FarmProfileData } from "@/store/type/formtypes";

const CooperativeDetails: React.FC<{ profile: FarmProfileData }> = ({
  profile,
}) => {
  // If the farmer does not belong to a cooperative, show a message
  if (!profile.belongsToCooperative) {
    return (
      <div className="space-y-6 p-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
        <div className="flex items-center justify-between border-b pb-3">
          <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 flex items-center">
            <Users className="mr-3 text-primary" size={24} />
            Cooperative Information
          </h3>
        </div>
        <div className="text-center text-gray-600 dark:text-gray-400 py-6">
          <UserCheck className="mx-auto mb-4 text-primary/70" size={40} />
          <p>This farmer is not currently part of a cooperative.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full space-y-6 p-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
      <div className="flex items-center justify-between border-b pb-3">
        <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 flex items-center">
          <Users className="mr-3 text-primary" size={24} />
          Cooperative Information
        </h3>
      </div>

      {/* Cooperative Basic Information */}
      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div className="flex items-center">
            <Briefcase className="mr-3 text-primary/70" size={20} />
            <div>
              <label className="block text-sm font-medium text-gray-600 dark:text-gray-400">
                Cooperative Name
              </label>
              <p className="text-base font-semibold text-gray-900 dark:text-gray-100">
                {profile.cooperativeName}
              </p>
            </div>
          </div>
        </div>

        {/* Cooperative Executive Information */}
        {profile.cooperativeExecutive && (
          <div className="space-y-4">
            <div className="flex items-center">
              <UserCheck className="mr-3 text-primary/70" size={20} />
              <div>
                <label className="block text-sm font-medium text-gray-600 dark:text-gray-400">
                  Executive Name
                </label>
                <p className="text-base text-gray-900 dark:text-gray-100">
                  {profile.cooperativeExecutive.name}
                </p>
              </div>
            </div>
            <div className="flex items-center">
              <Briefcase className="mr-3 text-primary/70" size={20} />
              <div>
                <label className="block text-sm font-medium text-gray-600 dark:text-gray-400">
                  Position
                </label>
                <p className="text-base text-gray-900 dark:text-gray-100">
                  {profile.cooperativeExecutive.position}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Contact Information */}
      {profile.cooperativeExecutive && (
        <div className="border-t pt-4 mt-4">
          <div className="flex items-center mb-4">
            <Phone className="mr-3 text-primary/70" size={20} />
            <h4 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              Contact Information
            </h4>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            {profile.cooperativeExecutive.phone && (
              <div>
                <label className="block text-sm font-medium text-gray-600 dark:text-gray-400">
                  Phone Number
                </label>
                <p className="text-base text-gray-900 dark:text-gray-100">
                  {profile.cooperativeExecutive.phone}
                </p>
              </div>
            )}
            {profile.cooperativeExecutive.email && (
              <div>
                <label className="block text-sm font-medium text-gray-600 dark:text-gray-400">
                  Email Address
                </label>
                <p className="text-base text-gray-900 dark:text-gray-100">
                  {profile.cooperativeExecutive.email}
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Agricultural Officer Information (if available) */}
      {profile.agriculturalOfficer && (
        <div className="border-t pt-4 mt-4">
          <div className="flex items-center mb-4">
            <Users className="mr-3 text-primary/70" size={20} />
            <h4 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              Agricultural Officer
            </h4>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-600 dark:text-gray-400">
                Name
              </label>
              <p className="text-base text-gray-900 dark:text-gray-100">
                {profile.agriculturalOfficer.name}
              </p>
            </div>
            {profile.agriculturalOfficer.phone && (
              <div>
                <label className="block text-sm font-medium text-gray-600 dark:text-gray-400">
                  Phone Number
                </label>
                <p className="text-base text-gray-900 dark:text-gray-100">
                  {profile.agriculturalOfficer.phone}
                </p>
              </div>
            )}
            {profile.agriculturalOfficer.email && (
              <div>
                <label className="block text-sm font-medium text-gray-600 dark:text-gray-400">
                  Email Address
                </label>
                <p className="text-base text-gray-900 dark:text-gray-100">
                  {profile.agriculturalOfficer.email}
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default CooperativeDetails;
