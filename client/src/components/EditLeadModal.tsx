import { useState } from "react";

import toast from "react-hot-toast";

import { updateLead } from "../services/lead.service";

import type { Lead } from "../types/lead.types";

interface EditLeadModalProps {
  token: string;

  lead: Lead;

  onClose: () => void;

  fetchLeads: () => void;
}

const EditLeadModal = ({
  token,
  lead,
  onClose,
  fetchLeads,
}: EditLeadModalProps) => {
  const [formData, setFormData] =
    useState({
      name: lead.name,
      email: lead.email,
      status: lead.status,
      source: lead.source,
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
      const response = await updateLead(
        token,
        lead._id,
        formData
      );

      toast.success(response.message);

      fetchLeads();

      onClose();
    } catch (error: any) {
      toast.error(
        error.response?.data?.message ||
          "Failed to update lead"
      );
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/40">
      <div className="w-full max-w-md p-6 bg-white rounded-2xl">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold">
            Edit Lead
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
            value={formData.name}
            onChange={handleChange}
            className="w-full p-3 text-black border rounded-lg"
          />

          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full p-3 text-black border rounded-lg"
          />

          <select
            name="status"
            value={formData.status}
            onChange={handleChange}
            className="w-full p-3 text-black border rounded-lg"
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
            className="w-full p-3 text-black border rounded-lg"
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
            className="w-full py-3 text-white bg-yellow-500 rounded-lg"
          >
            Update Lead
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditLeadModal;