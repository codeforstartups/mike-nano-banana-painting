"use client";

const callLogs = [
  {
    agency_name: "VRI Homes",
    agent_name: "Lisa Alaimo",
    agent_email: "lisaalaimo@verizon.net",
    phone1_type: "landline",
    phone1: "7325833333",
    phone2_type: "mobile",
    phone2: "7322414588",
  },
  {
    agency_name: "RE MAX Central",
    agent_name: "",
    agent_email: "",
    phone1_type: "",
    phone1: "",
    phone2_type: "",
    phone2: "",
  },
  {
    agency_name: "Redfin",
    agent_name: "Juliana Montalvo",
    agent_email: "jrosemontalvo@gmail.com",
    phone1_type: "mobile",
    phone1: "6092257075",
    phone2_type: "mobile",
    phone2: "8562854998",
  },
  {
    agency_name: "Coldwell Banker Realty",
    agent_name: "Brenda Foley",
    agent_email: "brenda.foley@cbmoves.com",
    phone1_type: "nonFixedVoip",
    phone1: "7322543750",
    phone2_type: "mobile",
    phone2: "7327423503",
  },
  {
    agency_name: "Ellen Rosenbaum Real Estate, Inc",
    agent_name: "Ellen Rosenbaum",
    agent_email: "leads@ellenrosenbaum.com",
    phone1_type: "fixedVoip",
    phone1: "7326795661",
    phone2_type: "",
    phone2: "",
  },
  {
    agency_name: "RE/MAX Gateway",
    agent_name: "Alexis Siciliano",
    agent_email: "asiciliano104@gmail.com",
    phone1_type: "mobile",
    phone1: "7329969269",
    phone2_type: "nonFixedVoip",
    phone2: "7326951600",
  },
  {
    agency_name: "BH HOMESERVICES FOX & ROACH",
    agent_name: "Russell Williams",
    agent_email: "Russell.Williams@foxroach.com",
    phone1_type: "mobile",
    phone1: "7326724135",
    phone2_type: "nonFixedVoip",
    phone2: "9087534450",
  },
  {
    agency_name: "Keller Williams Realty",
    agent_name: "Michael Martinetti",
    agent_email: "michael@michaelmartinettigroup.com",
    phone1_type: "mobile",
    phone1: "9085900236",
    phone2_type: "mobile",
    phone2: "9085900236",
  },
  {
    agency_name: "EXP Realty, LLC",
    agent_name: "Mark McKenna",
    agent_email: "mark.mckenna@exprealty.com",
    phone1_type: "mobile",
    phone1: "6093320792",
    phone2_type: "mobile",
    phone2: "6093320792",
  },
  {
    agency_name: "Coldwell Banker Realty",
    agent_name: "Anthony Nelson",
    agent_email: "anthony.nelson@coldwellbankermoves.com",
    phone1_type: "nonFixedVoip",
    phone1: "2014459400",
    phone2_type: "mobile",
    phone2: "9739304667",
  },
  {
    agency_name: "CHRISTIE'S INT.REAL ESTATE GROUP",
    agent_name: "Robert Gavura",
    agent_email: "rob.gavura@christiesrennj.com",
    phone1_type: "mobile",
    phone1: "2016538488",
    phone2_type: "",
    phone2: "",
  },
  {
    agency_name: "Weichert, Realtors - East Brunswick",
    agent_name: "Peter Riga",
    agent_email: "peterriga@weichert.com",
    phone1_type: "mobile",
    phone1: "7327158195",
    phone2_type: "mobile",
    phone2: "7322541700",
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
    nonFixedVoip: { label: "Non-Fixed VoIP", color: "bg-orange-100 text-orange-700" },
  };
  
  return typeMap[type] || { label: type, color: "bg-gray-100 text-gray-600" };
}

export default function CallLogsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="w-full">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 px-6 py-6">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent mb-2">
            Call Logs
          </h1>
          <p className="text-gray-600">View and manage agent call logs</p>
        </div>

        {/* Table Container */}
        <div className="px-6 py-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Agency Name
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Agent Name
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Agent Email
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Primary Phone
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Secondary Phone
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {callLogs.map((log, index) => (
                    <tr
                      key={index}
                      className="hover:bg-gradient-to-r hover:from-blue-50/50 hover:to-purple-50/50 transition-colors duration-150"
                    >
                      {/* Agency Name */}
                      <td className="px-6 py-4">
                        <div className="text-sm font-semibold text-gray-900">
                          {log.agency_name || (
                            <span className="text-gray-400 italic">Not available</span>
                          )}
                        </div>
                      </td>

                      {/* Agent Name */}
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900">
                          {log.agent_name || (
                            <span className="text-gray-400">-</span>
                          )}
                        </div>
                      </td>

                      {/* Agent Email */}
                      <td className="px-6 py-4">
                        {log.agent_email ? (
                          <a
                            href={`mailto:${log.agent_email}`}
                            className="text-sm text-blue-600 hover:text-blue-800 hover:underline flex items-center gap-1"
                          >
                            <svg
                              className="w-4 h-4"
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
                            {log.agent_email}
                          </a>
                        ) : (
                          <span className="text-sm text-gray-400">-</span>
                        )}
                      </td>

                      {/* Primary Phone */}
                      <td className="px-6 py-4">
                        {log.phone1 ? (
                          <div className="space-y-1">
                            <span
                              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                getPhoneTypeBadge(log.phone1_type).color
                              }`}
                            >
                              {getPhoneTypeBadge(log.phone1_type).label}
                            </span>
                            <div className="flex items-center gap-2">
                              <svg
                                className="w-4 h-4 text-gray-400"
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
                      <td className="px-6 py-4">
                        {log.phone2 ? (
                          <div className="space-y-1">
                            <span
                              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                getPhoneTypeBadge(log.phone2_type).color
                              }`}
                            >
                              {getPhoneTypeBadge(log.phone2_type).label}
                            </span>
                            <div className="flex items-center gap-2">
                              <svg
                                className="w-4 h-4 text-gray-400"
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
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

