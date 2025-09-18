"use client";

export default function FormInput({ 
  label, 
  type = "text", 
  value, 
  onChange, 
  placeholder = "" 
}) {
  return (
    <div className="mb-4">
      {/* Label */}
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>

      {/* Input */}
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    </div>
  );
}
