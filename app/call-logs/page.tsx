"use client";

import { useState, useMemo, useEffect } from "react";

interface CallLog {
  agency_name: string;
  agent_name: string;
  agent_email: string;
  phone1_type: string;
  phone1: string;
  phone2_type: string;
  phone2: string;
  status?: string;
}

// Existing call logs
const existingCallLogs: CallLog[] = [
  {
    agency_name: "VRI Homes",
    agent_name: "Lisa Alaimo",
    agent_email: "lisaalaimo@verizon.net",
    phone1_type: "landline",
    phone1: "7325833333",
    phone2_type: "mobile",
    phone2: "7322414588",
    status: "On Hubspot",
  },
  {
    agency_name: "RE MAX Central",
    agent_name: "",
    agent_email: "",
    phone1_type: "",
    phone1: "",
    phone2_type: "",
    phone2: "",
    status: "for_sale",
  },
  {
    agency_name: "Redfin",
    agent_name: "Juliana Montalvo",
    agent_email: "jrosemontalvo@gmail.com",
    phone1_type: "mobile",
    phone1: "6092257075",
    phone2_type: "mobile",
    phone2: "8562854998",
    status: "On Hubspot",
  },
  {
    agency_name: "Coldwell Banker Realty",
    agent_name: "Brenda Foley",
    agent_email: "brenda.foley@cbmoves.com",
    phone1_type: "nonFixedVoip",
    phone1: "7322543750",
    phone2_type: "mobile",
    phone2: "7327423503",
    status: "On Hubspot",
  },
  {
    agency_name: "Ellen Rosenbaum Real Estate, Inc",
    agent_name: "Ellen Rosenbaum",
    agent_email: "leads@ellenrosenbaum.com",
    phone1_type: "fixedVoip",
    phone1: "7326795661",
    phone2_type: "",
    phone2: "",
    status: "for_sale",
  },
  {
    agency_name: "RE/MAX Gateway",
    agent_name: "Alexis Siciliano",
    agent_email: "asiciliano104@gmail.com",
    phone1_type: "mobile",
    phone1: "7329969269",
    phone2_type: "nonFixedVoip",
    phone2: "7326951600",
    status: "On Hubspot",
  },
  {
    agency_name: "BH HOMESERVICES FOX & ROACH",
    agent_name: "Russell Williams",
    agent_email: "Russell.Williams@foxroach.com",
    phone1_type: "mobile",
    phone1: "7326724135",
    phone2_type: "nonFixedVoip",
    phone2: "9087534450",
    status: "On Hubspot",
  },
  {
    agency_name: "Keller Williams Realty",
    agent_name: "Michael Martinetti",
    agent_email: "michael@michaelmartinettigroup.com",
    phone1_type: "mobile",
    phone1: "9085900236",
    phone2_type: "mobile",
    phone2: "9085900236",
    status: "On Hubspot",
  },
  {
    agency_name: "EXP Realty, LLC",
    agent_name: "Mark McKenna",
    agent_email: "mark.mckenna@exprealty.com",
    phone1_type: "mobile",
    phone1: "6093320792",
    phone2_type: "mobile",
    phone2: "6093320792",
    status: "On Hubspot",
  },
  {
    agency_name: "Coldwell Banker Realty",
    agent_name: "Anthony Nelson",
    agent_email: "anthony.nelson@coldwellbankermoves.com",
    phone1_type: "nonFixedVoip",
    phone1: "2014459400",
    phone2_type: "mobile",
    phone2: "9739304667",
    status: "On Hubspot",
  },
  {
    agency_name: "CHRISTIE'S INT.REAL ESTATE GROUP",
    agent_name: "Robert Gavura",
    agent_email: "rob.gavura@christiesrennj.com",
    phone1_type: "mobile",
    phone1: "2016538488",
    phone2_type: "",
    phone2: "",
    status: "On Hubspot",
  },
  {
    agency_name: "Weichert, Realtors - East Brunswick",
    agent_name: "Peter Riga",
    agent_email: "peterriga@weichert.com",
    phone1_type: "mobile",
    phone1: "7327158195",
    phone2_type: "mobile",
    phone2: "7322541700",
    status: "On Hubspot",
  },
];

// Format phone number to (XXX) XXX-XXXX
function formatPhoneNumber(phone: string): string {
  if (!phone || phone.length !== 10) return phone;
  return `(${phone.slice(0, 3)}) ${phone.slice(3, 6)}-${phone.slice(6)}`;
}

// Get badge color for phone type
function getPhoneTypeBadge(type: string): { label: string; color: string } {
  if (!type) return { label: "-", color: "bg-gray-100 text-gray-500" };

  const typeMap: Record<string, { label: string; color: string }> = {
    mobile: { label: "Mobile", color: "bg-blue-100 text-blue-700" },
    landline: { label: "Landline", color: "bg-green-100 text-green-700" },
    fixedVoip: { label: "Fixed VoIP", color: "bg-purple-100 text-purple-700" },
    nonFixedVoip: {
      label: "Non-Fixed VoIP",
      color: "bg-orange-100 text-orange-700",
    },
    tollFree: { label: "Toll Free", color: "bg-pink-100 text-pink-700" },
  };

  return typeMap[type] || { label: type, color: "bg-gray-100 text-gray-600" };
}

// Get badge color for status (for filters)
function getStatusBadge(status: string): { label: string; color: string } {
  if (!status) return { label: "-", color: "bg-gray-100 text-gray-500" };

  const statusMap: Record<string, { label: string; color: string }> = {
    "On Hubspot": { label: "On Hubspot", color: "bg-gray-900 text-white" },
    for_sale: { label: "For Sale", color: "bg-gray-800 text-white" },
  };

  return (
    statusMap[status] || { label: status, color: "bg-gray-100 text-gray-700" }
  );
}

// Get badge color for status in table (better contrast and differentiation)
function getTableStatusBadge(status: string): { label: string; color: string } {
  if (!status)
    return {
      label: "-",
      color: "bg-gray-50 text-gray-400 border border-gray-200",
    };

  const statusMap: Record<string, { label: string; color: string }> = {
    "On Hubspot": {
      label: "On Hubspot",
      color: "bg-gray-50 text-gray-900 border border-gray-300 font-medium",
    },
    for_sale: {
      label: "For Sale",
      color: "bg-gray-100 text-gray-800 border border-gray-400 font-medium",
    },
  };

  return (
    statusMap[status] || {
      label: status,
      color: "bg-gray-50 text-gray-600 border border-gray-200",
    }
  );
}

export default function CallLogsPage() {
  const [callLogs, setCallLogs] = useState<CallLog[]>(existingCallLogs);
  const [selectedStatus, setSelectedStatus] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadCallLogs() {
      try {
        const response = await fetch("/api/call-logs");
        const logs = await response.json();
        setCallLogs(logs);
      } catch (error) {
        console.error("Error loading call logs:", error);
      } finally {
        setIsLoading(false);
      }
    }
    loadCallLogs();
  }, []);

  // Get unique statuses from call logs
  const uniqueStatuses = useMemo(() => {
    const statuses = new Set<string>();
    callLogs.forEach((log) => {
      if (log.status) {
        statuses.add(log.status);
      }
    });
    return Array.from(statuses).sort();
  }, [callLogs]);

  // Filter call logs by status and search query
  const filteredLogs = useMemo(() => {
    let filtered = callLogs;

    // Filter by status
    if (selectedStatus !== "ALL") {
      filtered = filtered.filter((log) => log.status === selectedStatus);
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      filtered = filtered.filter((log) => {
        const searchFields = [
          log.agency_name,
          log.agent_name,
          log.agent_email,
          log.phone1,
          log.phone2,
          formatPhoneNumber(log.phone1),
          formatPhoneNumber(log.phone2),
          log.status,
        ]
          .filter(Boolean)
          .map((field) => field?.toLowerCase() || "");

        return searchFields.some((field) => field.includes(query));
      });
    }

    return filtered;
  }, [callLogs, selectedStatus, searchQuery]);

  return (
    <div className="min-h-screen bg-[#fafafa]">
      <div className="w-full">
        {/* Header */}
        <div className="bg-white border-b border-gray-200/80 px-4 sm:px-6 py-6">
          <h1 className="text-2xl font-semibold text-gray-900 mb-1">
            Call Logs
          </h1>
          <p className="text-sm text-gray-500">
            View and manage agent call logs
          </p>
        </div>

        {/* Search and Filters */}
        <div className="px-4 sm:px-6 py-4">
          <div className="bg-white rounded-lg border border-gray-200/80 shadow-sm p-5">
            <div className="flex flex-col lg:flex-row lg:items-end gap-4">
              {/* Search Bar - Takes priority */}
              <div className="flex-1 min-w-0">
                <label className="block text-xs font-semibold text-gray-700 mb-2 uppercase tracking-wide">
                  Search
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                    <svg
                      className="h-4 w-4 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                      />
                    </svg>
                  </div>
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search by agency, agent name, email, phone, or status..."
                    className="block w-full pl-10 pr-10 py-2.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-gray-900 transition-all bg-white placeholder:text-gray-400"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery("")}
                      className="absolute inset-y-0 right-0 pr-3.5 flex items-center hover:opacity-70 transition-opacity"
                      aria-label="Clear search"
                    >
                      <svg
                        className="h-4 w-4 text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    </button>
                  )}
                </div>
              </div>

              {/* Status Filter */}
              <div className="lg:flex-shrink-0">
                <label className="block text-xs font-semibold text-gray-700 mb-2 uppercase tracking-wide">
                  Status
                </label>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => setSelectedStatus("ALL")}
                    className={`px-3.5 py-2 text-xs font-semibold rounded-lg transition-all duration-200 ${
                      selectedStatus === "ALL"
                        ? "bg-gray-900 text-white shadow-sm"
                        : "bg-gray-50 text-gray-700 hover:bg-gray-100 border border-gray-200"
                    }`}
                  >
                    All
                  </button>
                  {uniqueStatuses.map((status) => {
                    const badge = getStatusBadge(status);
                    return (
                      <button
                        key={status}
                        onClick={() => setSelectedStatus(status)}
                        className={`px-3.5 py-2 text-xs font-semibold rounded-lg transition-all duration-200 ${
                          selectedStatus === status
                            ? "bg-gray-900 text-white shadow-sm"
                            : "bg-gray-50 text-gray-700 hover:bg-gray-100 border border-gray-200"
                        }`}
                      >
                        {badge.label}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Table Container */}
        <div className="px-4 sm:px-6 pb-6">
          <div className="bg-white rounded-lg border border-gray-200/80 shadow-sm overflow-hidden">
            <div className="px-4 sm:px-6 py-3.5 border-b border-gray-100 bg-gray-50/50">
              <h2 className="text-sm font-semibold text-gray-900">
                Call Logs
                <span className="text-gray-500 font-normal ml-1">
                  ({filteredLogs.length} records)
                </span>
              </h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full divide-y divide-gray-100 table-fixed">
                <colgroup>
                  <col className="w-[22.22%]" />
                  <col className="w-[22.22%]" />
                  <col className="w-[22.22%]" />
                  <col className="w-[11.11%]" />
                  <col className="w-[11.11%]" />
                  <col className="w-[11.11%]" />
                </colgroup>
                <thead className="bg-gray-50/50">
                  <tr>
                    <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider align-middle">
                      Agency Name
                    </th>
                    <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider align-middle">
                      Agent Name
                    </th>
                    <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider align-middle">
                      Agent Email
                    </th>
                    <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider align-middle">
                      Primary Phone
                    </th>
                    <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider align-middle">
                      Secondary Phone
                    </th>
                    <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider align-middle">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-100">
                  {isLoading ? (
                    <tr>
                      <td
                        colSpan={6}
                        className="px-4 sm:px-6 py-12 text-center text-gray-400 text-sm"
                      >
                        Loading call logs...
                      </td>
                    </tr>
                  ) : filteredLogs.length === 0 ? (
                    <tr>
                      <td
                        colSpan={6}
                        className="px-4 sm:px-6 py-12 text-center text-gray-400 text-sm"
                      >
                        No call logs found for the selected status.
                      </td>
                    </tr>
                  ) : (
                    filteredLogs.map((log, index) => (
                      <tr
                        key={index}
                        className="hover:bg-gray-50/50 transition-colors duration-150"
                      >
                        {/* Agency Name */}
                        <td className="px-4 sm:px-6 py-4 align-middle">
                          <div className="text-sm font-medium text-gray-900">
                            {log.agency_name || (
                              <span className="text-gray-400">
                                Not available
                              </span>
                            )}
                          </div>
                        </td>

                        {/* Agent Name */}
                        <td className="px-4 sm:px-6 py-4 align-middle">
                          <div className="text-sm text-gray-600">
                            {log.agent_name || (
                              <span className="text-gray-400">-</span>
                            )}
                          </div>
                        </td>

                        {/* Agent Email */}
                        <td className="px-4 sm:px-6 py-4 align-middle">
                          {log.agent_email ? (
                            <a
                              href={`mailto:${log.agent_email}`}
                              className="text-sm text-blue-600 hover:text-blue-800 hover:underline flex items-center gap-1.5"
                            >
                              <svg
                                className="w-3.5 h-3.5 flex-shrink-0"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                                />
                              </svg>
                              <span className="truncate max-w-[200px]">
                                {log.agent_email}
                              </span>
                            </a>
                          ) : (
                            <span className="text-sm text-gray-400">-</span>
                          )}
                        </td>

                        {/* Primary Phone */}
                        <td className="px-4 sm:px-6 py-4 align-middle">
                          {log.phone1 ? (
                            <div className="flex flex-col gap-1.5">
                              <span
                                className={`inline-flex items-center w-fit px-2 py-0.5 rounded-md text-xs font-medium ${
                                  getPhoneTypeBadge(log.phone1_type).color
                                }`}
                              >
                                {getPhoneTypeBadge(log.phone1_type).label}
                              </span>
                              <div className="flex items-center gap-1.5">
                                <svg
                                  className="w-3.5 h-3.5 text-gray-400 flex-shrink-0"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                                  />
                                </svg>
                                <a
                                  href={`tel:${log.phone1}`}
                                  className="text-sm font-medium text-gray-900 hover:text-blue-600"
                                >
                                  {formatPhoneNumber(log.phone1)}
                                </a>
                              </div>
                            </div>
                          ) : (
                            <span className="text-sm text-gray-400">-</span>
                          )}
                        </td>

                        {/* Secondary Phone */}
                        <td className="px-4 sm:px-6 py-4 align-middle">
                          {log.phone2 ? (
                            <div className="flex flex-col gap-1.5">
                              <span
                                className={`inline-flex items-center w-fit px-2 py-0.5 rounded-md text-xs font-medium ${
                                  getPhoneTypeBadge(log.phone2_type).color
                                }`}
                              >
                                {getPhoneTypeBadge(log.phone2_type).label}
                              </span>
                              <div className="flex items-center gap-1.5">
                                <svg
                                  className="w-3.5 h-3.5 text-gray-400 flex-shrink-0"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                                  />
                                </svg>
                                <a
                                  href={`tel:${log.phone2}`}
                                  className="text-sm font-medium text-gray-900 hover:text-blue-600"
                                >
                                  {formatPhoneNumber(log.phone2)}
                                </a>
                              </div>
                            </div>
                          ) : (
                            <span className="text-sm text-gray-400">-</span>
                          )}
                        </td>

                        {/* Status */}
                        <td className="px-4 sm:px-6 py-4 align-middle">
                          {log.status ? (
                            <span
                              className={`inline-flex items-center px-2.5 py-1 rounded text-xs ${
                                getTableStatusBadge(log.status).color
                              }`}
                            >
                              {getTableStatusBadge(log.status).label}
                            </span>
                          ) : (
                            <span className="text-sm text-gray-400">-</span>
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
