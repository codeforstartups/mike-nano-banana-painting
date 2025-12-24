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

export default function CallLogsPage() {
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent mb-2">
            Call Logs
          </h1>
          <p className="text-gray-600">View and manage agent call logs</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Agency Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Agent Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Agent Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Phone 1 Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Phone 1
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Phone 2 Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Phone 2
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {callLogs.map((log, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {log.agency_name || "-"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {log.agent_name || "-"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {log.agent_email || "-"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {log.phone1_type || "-"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {log.phone1 || "-"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {log.phone2_type || "-"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {log.phone2 || "-"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

