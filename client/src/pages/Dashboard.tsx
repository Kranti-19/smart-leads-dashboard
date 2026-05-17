import { useEffect, useState } from "react";

import CreateLeadModal from "../components/CreateLeadModal";

import EditLeadModal from "../components/EditLeadModal";

import toast from "react-hot-toast";

import { getLeads, deleteLead } from "../services/lead.service";

import type { Lead } from "../types/lead.types";

const Dashboard = () => {
  const token = localStorage.getItem("token");

  const user = JSON.parse(
    localStorage.getItem("user") || "{}"
  );

  const [leads, setLeads] =
    useState<Lead[]>([]);

  const [loading, setLoading] =
    useState(false);

  const [openModal, setOpenModal] =
    useState(false);

  const [openEditModal, setOpenEditModal] =
    useState(false);

  const [selectedLead, setSelectedLead] =
    useState<Lead | null>(null);

  const [search, setSearch] =
    useState("");

  const [status, setStatus] =
    useState("");

  const [source, setSource] =
    useState("");

  const [page, setPage] =
    useState(1);

  const [totalPages, setTotalPages] =
    useState(1);

  const [darkMode, setDarkMode] =
    useState(true);

  const fetchLeads = async () => {
    try {
      setLoading(true);

      const response = await getLeads({
        token: token as string,
        search,
        status,
        source,
        page,
      });

      const fetchedLeads =
        response?.data || [];

      setLeads(
        Array.isArray(fetchedLeads)
          ? fetchedLeads
          : []
      );

      setTotalPages(
        response?.pagination
          ?.totalPages || 1
      );
    } catch (error: any) {
      console.log(error);

      toast.error(
        "Failed to fetch leads"
      );
    } finally {
      setLoading(false);
    }
  };

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
        token as string,
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

  useEffect(() => {
    if (!token) {
      window.location.href =
        "/login";
    }
  }, [token]);

  useEffect(() => {
    const timeout =
      setTimeout(() => {
        fetchLeads();
      }, 300);

    return () =>
      clearTimeout(timeout);
  }, [
    page,
    search,
    status,
    source,
  ]);

  const handleLogout = () => {
    localStorage.removeItem(
      "token"
    );

    localStorage.removeItem(
      "user"
    );

    toast.success("Logged out");

    window.location.href =
      "/login";
  };

  return (
    <div
      className={`min-h-screen p-6 transition-all ${
        darkMode
          ? "bg-[#0f172a] text-white"
          : "bg-gray-100 text-black"
      }`}
    >
      {/* HEADER */}
      <div className="flex flex-col gap-4 mb-8 md:flex-row md:items-start md:justify-between">
        <div>
          <h1 className="text-5xl font-bold text-blue-600">
            Smart Leads Dashboard
          </h1>

          <p className="mt-2 text-xl">
            Welcome,{" "}
            {user?.name || "User"}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() =>
              setDarkMode(!darkMode)
            }
            className={`px-5 py-3 rounded-xl font-medium ${
              darkMode
                ? "bg-gray-800 text-white"
                : "bg-gray-200 text-black"
            }`}
          >
            {darkMode
              ? "🌞 Light"
              : "🌙 Dark"}
          </button>

          <button
            onClick={() =>
              setOpenModal(true)
            }
            className="px-5 py-3 text-white bg-blue-600 rounded-xl hover:bg-blue-700"
          >
            + Create Lead
          </button>

          <button
            onClick={handleLogout}
            className="px-5 py-3 text-white bg-red-500 rounded-xl hover:bg-red-600"
          >
            Logout
          </button>
        </div>
      </div>

      {/* FILTERS */}
      <div className="grid grid-cols-1 gap-4 mb-6 md:grid-cols-3">
        <input
          type="text"
          placeholder="Search by name or email..."
          value={search}
          onChange={(e) =>
            setSearch(
              e.target.value
            )
          }
          className={`p-4 border rounded-xl outline-none ${
            darkMode
              ? "bg-gray-800 border-gray-700 text-white placeholder-gray-400"
              : "bg-white border-gray-300 text-black"
          }`}
        />

        <select
          value={status}
          onChange={(e) =>
            setStatus(
              e.target.value
            )
          }
          className={`p-4 border rounded-xl outline-none ${
            darkMode
              ? "bg-gray-800 border-gray-700 text-white"
              : "bg-white border-gray-300 text-black"
          }`}
        >
          <option value="">
            All Status
          </option>

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
          value={source}
          onChange={(e) =>
            setSource(
              e.target.value
            )
          }
          className={`p-4 border rounded-xl outline-none ${
            darkMode
              ? "bg-gray-800 border-gray-700 text-white"
              : "bg-white border-gray-300 text-black"
          }`}
        >
          <option value="">
            All Sources
          </option>

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
      </div>

      {/* MODALS */}
      {openModal && (
        <CreateLeadModal
          token={token as string}
          onClose={() =>
            setOpenModal(false)
          }
          fetchLeads={fetchLeads}
          darkMode={darkMode}
        />
      )}

      {openEditModal &&
        selectedLead && (
          <EditLeadModal
            token={token as string}
            lead={selectedLead}
            onClose={() =>
              setOpenEditModal(false)
            }
            fetchLeads={fetchLeads}
            darkMode={darkMode}
          />
        )}

      {/* TABLE */}
      {loading ? (
        <div className="flex items-center justify-center mt-20">
          <div className="w-12 h-12 border-4 border-blue-500 rounded-full border-t-transparent animate-spin"></div>
        </div>
      ) : (
        <>
          <h1 className="mb-4 text-2xl text-white">
            Total Leads: {leads.length}
          </h1>

          <div className="overflow-x-auto rounded-xl">
            <table className="w-full">
              <thead className="bg-blue-600 text-white">
                <tr>
                  <th className="p-4 text-left">
                    Name
                  </th>

                  <th className="p-4 text-left">
                    Email
                  </th>

                  <th className="p-4 text-left">
                    Status
                  </th>

                  <th className="p-4 text-left">
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
                          : "border-gray-200"
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
                        {lead.status}
                      </td>

                      <td
                        className={`p-4 ${
                          darkMode
                            ? "text-white"
                            : "text-black"
                        }`}
                      >
                        {lead.source}
                      </td>

                      <td className="p-4">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => {
                              setSelectedLead(
                                lead
                              );

                              setOpenEditModal(
                                true
                              );
                            }}
                            className="px-3 py-1 text-sm text-white bg-yellow-500 rounded-lg hover:bg-yellow-600"
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
                              className="px-3 py-1 text-sm text-white bg-red-500 rounded-lg hover:bg-red-600"
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
                      className="p-8 text-center text-gray-400"
                    >
                      No leads found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* PAGINATION */}
          <div className="flex items-center justify-center mt-8 space-x-4">
            <button
              disabled={page === 1}
              onClick={() =>
                setPage(
                  (prev) =>
                    prev - 1
                )
              }
              className="px-5 py-2 text-white bg-gray-500 rounded-lg disabled:opacity-50"
            >
              Previous
            </button>

            <span className="text-lg font-medium">
              Page {page} of{" "}
              {totalPages}
            </span>

            <button
              disabled={
                page === totalPages
              }
              onClick={() =>
                setPage(
                  (prev) =>
                    prev + 1
                )
              }
              className="px-5 py-2 text-white bg-gray-500 rounded-lg disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default Dashboard;