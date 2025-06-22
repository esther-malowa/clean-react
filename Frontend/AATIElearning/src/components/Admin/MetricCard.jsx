import React from "react";

const MetricCard = ({ title, value, icon, bg = "bg-blue-100", text = "text-blue-600" }) => {
  return (
    <div className="flex items-center gap-4 p-4 rounded-xl shadow bg-white">
      <div className={`text-2xl ${bg} ${text} p-2 rounded-lg`}>
        {icon}
      </div>
      <div>
        <p className="text-sm text-gray-500">{title}</p>
        <p className="text-xl font-bold">{value}</p>
      </div>
    </div>
  );
};

export default MetricCard;
