import { useState } from "react";

import type { Lead } from "../types/lead.types";

import { deleteLead } from "../services/lead.service";

import EditLeadModal from "./EditLeadModal";

import toast from "react-hot-toast";

interface LeadTableProps {
  leads: Lead[];

  token: string;

  fetchLeads: () => void;

  darkMode: boolean;
}

const LeadTable = ({
  leads,
  token,
  fetchLeads,
  darkMode,
}: LeadTableProps) => {
  const [openEditModal, setOpenEditModal] =
    useState(false);

  const [selectedLead, setSelectedLead] =
    useState<Lead | null>(null);

  const handleDelete = async (
    id: string
  ) => {
    const confirmDelete =
      window.confirm(
        "Are you sure you want to delete this lead?"
      );

    if (!confirmDelete) return;

    try {
      const response = await deleteLead(
        token,
        id
      );

      toast.success(response.message);

      fetchLeads();
    } catch (error: any) {
      toast.error(
        error.response?.data?.message ||
          "Failed to delete lead"
      );
    }
  };

  const user = JSON.parse(
    localStorage.getItem("user") || "{}"
  );

  return (
    <>
      {openEditModal &&
        selectedLead && (
          <EditLeadModal
            token={token}
            lead={selectedLead}
            onClose={() =>
              setOpenEditModal(false)
            }
            fetchLeads={fetchLeads}
          />
        )}

      <div className="overflow-x-auto">
        <table className="w-full bg-white rounded-xl shadow">
          <thead className="text-left bg-blue-600 text-white">
            <tr>
              <th className="p-4">
                Name
              </th>

              <th className="p-4">
                Email
              </th>

              <th className="p-4">
                Status
              </th>

              <th className="p-4">
                Source
              </th>

              <th className="p-4 text-center">
                Actions
              </th>
            </tr>
          </thead>

          <tbody
            className={
              darkMode
                ? "bg-gray-800"
                : "bg-white"
            }
          >
  {leads.length > 0 ? (
    leads.map((lead) => (
      <tr
        key={lead._id}
        className={`border-b ${
          darkMode
            ? "border-gray-700"
            : ""
        }`}
      >
        <td
  className={`p-4 ${
    darkMode
      ? "text-white"
      : "text-black"
  }`}
>
  {lead.name}
</td>

<td
  className={`p-4 ${
    darkMode
      ? "text-white"
      : "text-black"
  }`}
>
  {lead.email}
</td>

        <td
  className={`p-4 ${
    darkMode
      ? "text-white"
      : "text-black"
  }`}
>
          <span
            className={`px-3 py-1 text-sm rounded-full text-white capitalize
            ${
              lead.status === "new"
                ? "bg-blue-500"
                : lead.status ===
                  "contacted"
                ? "bg-yellow-500"
                : lead.status ===
                  "qualified"
                ? "bg-green-500"
                : "bg-red-500"
            }`}
          >
            {lead.status}
          </span>
        </td>

        <td className="p-4 capitalize">
          {lead.source}
        </td>

        <td className="p-4">
          <div className="flex items-center justify-center space-x-2">
            <button
              onClick={() => {
                setSelectedLead(
                  lead
                );

                setOpenEditModal(
                  true
                );
              }}
              className="px-3 py-1 text-sm text-white bg-yellow-500 rounded-lg"
            >
              Edit
            </button>

            {user.role ===
              "admin" && (
              <button
                onClick={() =>
                  handleDelete(
                    lead._id
                  )
                }
                className="px-3 py-1 text-sm text-white bg-red-500 rounded-lg"
              >
                Delete
              </button>
            )}
          </div>
        </td>
      </tr>
    ))
  ) : (
    <tr>
      <td
        colSpan={5}
        className="py-10 text-center text-gray-500"
      >
        No leads found
      </td>
    </tr>
  )}
</tbody>
        </table>
      </div>
    </>
  );
};

export default LeadTable;