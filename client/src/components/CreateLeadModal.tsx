import { useState } from "react";

import toast from "react-hot-toast";

import { createLead } from "../services/lead.service";

interface CreateLeadModalProps {
  token: string;

  onClose: () => void;

  fetchLeads: () => void;
}

const CreateLeadModal = ({
  token,
  onClose,
  fetchLeads,
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
    <div className="fixed inset-0 flex items-center justify-center bg-black/40">
      <div className="w-full max-w-md p-6 bg-white rounded-2xl">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold">
            Create Lead
          </h2>

          <button
            onClick={onClose}
            className="text-xl"
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
            className="w-full p-3 border rounded-lg"
          />

          <input
            type="email"
            name="email"
            placeholder="Enter email"
            value={formData.email}
            onChange={handleChange}
            className="w-full p-3 border rounded-lg"
          />

          <select
            name="status"
            value={formData.status}
            onChange={handleChange}
            className="w-full p-3 border rounded-lg"
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
            className="w-full p-3 border rounded-lg"
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
            className="w-full py-3 text-white bg-blue-600 rounded-lg"
          >
            Create Lead
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateLeadModal;