import { readFile } from "fs/promises";
import { join } from "path";

export const dynamic = "force-dynamic";

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

// Parse CSV line (handles quoted fields)
function parseCSVLine(line: string): string[] {
  const result: string[] = [];
  let current = "";
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === "," && !inQuotes) {
      result.push(current.trim());
      current = "";
    } else {
      current += char;
    }
  }
  result.push(current.trim());
  return result;
}

async function getCallLogs(): Promise<CallLog[]> {
  try {
    // Read CSV file
    const csvPath = join(process.cwd(), "data", "Realtor Data-NJ - Sheet1.csv");
    const csvContent = await readFile(csvPath, "utf-8");
    const lines = csvContent.split("\n").filter((line) => line.trim());

    if (lines.length < 2) {
      return existingCallLogs;
    }

    // Parse header
    const header = parseCSVLine(lines[0]);
    const agencyNameIdx = header.indexOf("agency_name");
    const agentNameIdx = header.indexOf("agent_name");
    const agentEmailIdx = header.indexOf("agent_email");
    const phone1TypeIdx = header.indexOf("phone1_type");
    const phone1Idx = header.indexOf("phone1");
    const phone2TypeIdx = header.indexOf("phone2_type");
    const phone2Idx = header.indexOf("phone2");
    const statusIdx = header.indexOf("status");

    // Use a Map to store unique entries (keyed by email or agency+name)
    const uniqueLogs = new Map<string, CallLog>();

    // Add existing logs first
    existingCallLogs.forEach((log) => {
      const key = log.agent_email || `${log.agency_name}-${log.agent_name}`;
      if (key) {
        uniqueLogs.set(key.toLowerCase(), log);
      }
    });

    // Parse CSV rows
    for (let i = 1; i < lines.length; i++) {
      const row = parseCSVLine(lines[i]);
      if (row.length <= Math.max(agencyNameIdx, agentNameIdx, agentEmailIdx, phone1Idx)) {
        continue;
      }

      const agencyName = row[agencyNameIdx]?.trim() || "";
      const agentName = row[agentNameIdx]?.trim() || "";
      const agentEmail = row[agentEmailIdx]?.trim() || "";
      const phone1Type = row[phone1TypeIdx]?.trim() || "";
      const phone1 = row[phone1Idx]?.trim() || "";
      const phone2Type = row[phone2TypeIdx]?.trim() || "";
      const phone2 = row[phone2Idx]?.trim() || "";
      const status = row[statusIdx]?.trim() || "";

      // Skip if no agency name
      if (!agencyName) continue;

      // Create key for uniqueness (prefer email, fallback to agency+name)
      const key = agentEmail
        ? agentEmail.toLowerCase()
        : `${agencyName}-${agentName}`.toLowerCase();

      // Only add if not already exists or if this entry has more complete data
      if (!uniqueLogs.has(key)) {
        uniqueLogs.set(key, {
          agency_name: agencyName,
          agent_name: agentName,
          agent_email: agentEmail,
          phone1_type: phone1Type,
          phone1: phone1,
          phone2_type: phone2Type,
          phone2: phone2,
          status: status,
        });
      } else {
        // Update existing entry if this one has more complete data
        const existing = uniqueLogs.get(key)!;
        if (!existing.agent_email && agentEmail) {
          existing.agent_email = agentEmail;
        }
        if (!existing.phone1 && phone1) {
          existing.phone1 = phone1;
          existing.phone1_type = phone1Type;
        }
        if (!existing.phone2 && phone2) {
          existing.phone2 = phone2;
          existing.phone2_type = phone2Type;
        }
        if (!existing.status && status) {
          existing.status = status;
        }
      }
    }

    return Array.from(uniqueLogs.values());
  } catch (error) {
    console.error("Error reading CSV:", error);
    return existingCallLogs;
  }
}

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
    tollFree: { label: "Toll Free", color: "bg-pink-100 text-pink-700" },
  };

  return typeMap[type] || { label: type, color: "bg-gray-100 text-gray-600" };
}

// Get badge color for status
function getStatusBadge(status: string): { label: string; color: string } {
  if (!status) return { label: "-", color: "bg-gray-100 text-gray-500" };

  const statusMap: Record<string, { label: string; color: string }> = {
    "On Hubspot": { label: "On Hubspot", color: "bg-green-100 text-green-700" },
    "for_sale": { label: "For Sale", color: "bg-blue-100 text-blue-700" },
  };

  return statusMap[status] || { label: status, color: "bg-gray-100 text-gray-600" };
}

export default async function CallLogsPage() {
  const callLogs = await getCallLogs();

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
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Status
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

                      {/* Status */}
                      <td className="px-6 py-4">
                        {log.status ? (
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              getStatusBadge(log.status).color
                            }`}
                          >
                            {getStatusBadge(log.status).label}
                          </span>
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
