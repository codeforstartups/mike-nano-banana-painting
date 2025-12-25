import { readFile } from "fs/promises";
import { join } from "path";
import { NextResponse } from "next/server";

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

export async function GET() {
  try {
    // Read CSV file
    const csvPath = join(process.cwd(), "data", "Realtor Data-NJ - Sheet1.csv");
    const csvContent = await readFile(csvPath, "utf-8");
    const lines = csvContent.split("\n").filter((line) => line.trim());

    if (lines.length < 2) {
      return NextResponse.json(existingCallLogs);
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

    return NextResponse.json(Array.from(uniqueLogs.values()));
  } catch (error) {
    console.error("Error reading CSV:", error);
    return NextResponse.json(existingCallLogs);
  }
}

