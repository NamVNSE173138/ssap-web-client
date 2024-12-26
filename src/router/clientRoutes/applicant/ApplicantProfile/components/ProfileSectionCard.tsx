import { useState } from "react";
import { AiOutlinePlus } from "react-icons/ai";
import ExperienceDialog from "./ExperienceDialog";

const ProfileSectionCard = (props: any) => {
  const { section, title, icon: Icon, items, placeholder, buttonText } = props;

  const [open, setOpen] = useState<boolean>(false);

  return (
    <div className="p-6 bg-white shadow-md rounded-lg border border-gray-200">
      <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
      {items && items.length > 0 ? (
        <div className="mt-4 space-y-4">
          {items.map((item: any, index: any) => (
            <div
              key={index}
              className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200 hover:border-green-600 hover:cursor-pointer"
              onClick={() => setOpen(true)}
            >
              {/* Left: Icon and Info */}
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 flex items-center justify-center bg-green-100 text-green-600 rounded-full">
                  <Icon className="text-xl" />
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-800">
                    {item.name}
                  </h4>
                  <p className="text-xs text-gray-500">{item.detail}</p>
                </div>
              </div>
              {/* Right: Date and Duration */}
              <div className="text-right text-sm text-gray-600">
                <p>
                  {item.fromYear || "Unknown"} - {item.toYear || "Present"}
                </p>
                <p className="text-xs text-gray-400">
                  {item.toYear - item.fromYear} years
                </p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="mt-4 text-sm text-gray-500">{placeholder}</p>
      )}
      {/* Add Button */}
      <button
        className="w-full mt-4 flex items-center justify-center gap-2 p-2 text-green-600 border border-green-200 rounded-lg hover:bg-green-50"
        onClick={() => setOpen(true)}
      >
        <AiOutlinePlus />
        {buttonText}
      </button>

      {section === "experience" && (
        <ExperienceDialog open={open} setOpen={setOpen} />
      )}
    </div>
  );
};

export default ProfileSectionCard;
