import { useState } from "react";

import toast from "react-hot-toast";

import { createLead } from "../services/lead.service";

interface CreateLeadModalProps {
  token: string;

  onClose: () => void;

  fetchLeads: () => void;

  darkMode: boolean;
}

const CreateLeadModal = ({
  token,
  onClose,
  fetchLeads,
  darkMode,
}: CreateLeadModalProps) => {
  const [formData, setFormData] =
    useState({
      name: "",
      email: "",
      status: "new",
      source: "website",
    });

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement
    >
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    try {
      const response = await createLead(
        token,
        formData
      );

      toast.success(response.message);

      fetchLeads();

      onClose();
    } catch (error: any) {
      toast.error(
        error.response?.data?.message ||
          "Failed to create lead"
      );
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div
        className={`w-full max-w-md p-6 rounded-2xl shadow-xl transition-all
        ${
          darkMode
            ? "bg-gray-900 text-white"
            : "bg-white text-black"
        }`}
      >
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-2xl font-bold">
            Create Lead
          </h2>

          <button
            onClick={onClose}
            className={`text-xl font-bold
            ${
              darkMode
                ? "text-gray-300 hover:text-white"
                : "text-gray-600 hover:text-black"
            }`}
          >
            ✕
          </button>
        </div>

        <form
          onSubmit={handleSubmit}
          className="space-y-4"
        >
          <input
            type="text"
            name="name"
            placeholder="Enter name"
            value={formData.name}
            onChange={handleChange}
            className={`w-full p-3 border rounded-lg outline-none
            ${
              darkMode
                ? "bg-gray-800 text-white border-gray-700 placeholder-gray-400"
                : "bg-white text-black border-gray-300"
            }`}
          />

          <input
            type="email"
            name="email"
            placeholder="Enter email"
            value={formData.email}
            onChange={handleChange}
            className={`w-full p-3 border rounded-lg outline-none
            ${
              darkMode
                ? "bg-gray-800 text-white border-gray-700 placeholder-gray-400"
                : "bg-white text-black border-gray-300"
            }`}
          />

          <select
            name="status"
            value={formData.status}
            onChange={handleChange}
            className={`w-full p-3 border rounded-lg outline-none
            ${
              darkMode
                ? "bg-gray-800 text-white border-gray-700"
                : "bg-white text-black border-gray-300"
            }`}
          >
            <option value="new">
              New
            </option>

            <option value="contacted">
              Contacted
            </option>

            <option value="qualified">
              Qualified
            </option>

            <option value="lost">
              Lost
            </option>
          </select>

          <select
            name="source"
            value={formData.source}
            onChange={handleChange}
            className={`w-full p-3 border rounded-lg outline-none
            ${
              darkMode
                ? "bg-gray-800 text-white border-gray-700"
                : "bg-white text-black border-gray-300"
            }`}
          >
            <option value="website">
              Website
            </option>

            <option value="instagram">
              Instagram
            </option>

            <option value="referral">
              Referral
            </option>
          </select>

          <button
            type="submit"
            className="w-full py-3 font-medium text-white transition-all bg-blue-600 rounded-lg hover:bg-blue-700"
          >
            Create Lead
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateLeadModal;