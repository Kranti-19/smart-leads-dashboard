import { useEffect, useState } from "react";

import LeadTable from "../components/LeadTable";

import type { Lead } from "../types/lead.types";

import { getLeads } from "../services/lead.service";

import CreateLeadModal from "../components/CreateLeadModal";

import toast from "react-hot-toast";

const Dashboard = () => {
  const token = localStorage.getItem("token");

  if (!token) {
    window.location.href = "/login";
  }

  const user = JSON.parse(
    localStorage.getItem("user") || "{}"
  );

  const [leads, setLeads] = useState<Lead[]>(
    []
  );

  const [search, setSearch] = useState("");

  const [status, setStatus] = useState("");

  const [source, setSource] = useState("");

  const [page, setPage] = useState(1);

  const [totalPages, setTotalPages] =
    useState(1);

  const [loading, setLoading] =
    useState<boolean>(true);

  const [openModal, setOpenModal] =
    useState(false);

  const [darkMode, setDarkMode] =
    useState(
      localStorage.getItem("theme") ===
        "dark"
    );

  useEffect(() => {
    setPage(1);
  }, [search, status, source]);

  useEffect(() => {
    if (darkMode) {
      localStorage.setItem(
        "theme",
        "dark"
      );
    } else {
      localStorage.setItem(
        "theme",
        "light"
      );
    }
  }, [darkMode]);

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

      setLeads(response.data);

      setTotalPages(
        response.pagination.totalPages
      );
    } catch (error: any) {
      toast.error(
        error.response?.data?.message ||
          "Failed to fetch leads"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchLeads();
    }, 500);

    return () => clearTimeout(timer);
  }, [search, status, source, page]);

  return (
    <div
      className={`min-h-screen p-6 transition-all duration-300 ${
        darkMode
          ? "bg-gray-900 text-white"
          : "bg-gray-100 text-black"
      }`}
    >
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-4xl font-bold text-blue-600">
            Smart Leads Dashboard
          </h1>

          <p
            className={
              darkMode
                ? "text-gray-300"
                : "text-gray-600"
            }
          >
            Welcome, {user.name}
          </p>
        </div>

        <div className="flex items-center">
          <button
            onClick={() =>
              setDarkMode(!darkMode)
            }
            className="px-4 py-2 mr-3 text-white bg-gray-800 rounded-lg"
          >
            {darkMode
              ? "☀️ Light"
              : "🌙 Dark"}
          </button>

          <button
            onClick={() =>
              setOpenModal(true)
            }
            className="px-4 py-2 mr-3 text-white bg-blue-600 rounded-lg"
          >
            + Create Lead
          </button>

          <button
            onClick={() => {
              localStorage.clear();

              window.location.href =
                "/login";
            }}
            className="px-4 py-2 text-white bg-red-500 rounded-lg"
          >
            Logout
          </button>
        </div>
      </div>

      {openModal && (
        <CreateLeadModal
          token={token as string}
          onClose={() =>
            setOpenModal(false)
          }
          fetchLeads={fetchLeads}
        />
      )}

      {/* SEARCH + FILTERS */}
      <div className="grid grid-cols-1 gap-4 mb-6 md:grid-cols-3">
        <input
          type="text"
          placeholder="Search by name or email..."
          value={search}
          onChange={(e) =>
            setSearch(e.target.value)
          }
          className={`p-3 border rounded-lg shadow-sm outline-none ${
            darkMode
              ? "bg-gray-800 border-gray-700 text-white"
              : "bg-white"
          }`}
        />

        <select
          value={status}
          onChange={(e) =>
            setStatus(e.target.value)
          }
          className={`p-3 border rounded-lg shadow-sm outline-none ${
            darkMode
              ? "bg-gray-800 border-gray-700 text-white"
              : "bg-white"
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
            setSource(e.target.value)
          }
          className={`p-3 border rounded-lg shadow-sm outline-none ${
            darkMode
              ? "bg-gray-800 border-gray-700 text-white"
              : "bg-white"
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

      {/* TABLE */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="w-12 h-12 border-4 border-blue-500 rounded-full border-t-transparent animate-spin"></div>
        </div>
      ) : (
        <>
          <LeadTable
            darkMode={darkMode}
            leads={leads}
            token={token as string}
            fetchLeads={fetchLeads}
          />

          <div className="flex items-center justify-center mt-6 space-x-4">
            <button
              disabled={page === 1}
              onClick={() =>
                setPage((prev) => prev - 1)
              }
              className="px-4 py-2 text-white bg-blue-600 rounded-lg disabled:bg-gray-400"
            >
              Previous
            </button>

            <span className="font-medium">
              Page {page} of {totalPages}
            </span>

            <button
              disabled={
                page === totalPages
              }
              onClick={() =>
                setPage((prev) => prev + 1)
              }
              className="px-4 py-2 text-white bg-blue-600 rounded-lg disabled:bg-gray-400"
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