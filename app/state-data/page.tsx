"use client";

import { useState, useMemo } from "react";

// Combined data from call logs and state data
const allData = [
  {
    property_id: "5424086645",
    date_scrapped: "2025-12-21 7:13",
    date_listed: "2025-09-30 2:50",
    image_URL:
      "https://ap.rdcpix.com/3e066d33987a2e41ad84bec28568891fl-m695857921rd.jpg",
    price: "$829,000",
    address: "3 Julia Ln",
    city: "Hazlet",
    state: "NJ",
    zip: "07730",
    agent_name: "Lisa Alaimo",
    agent_email: "lisaalaimo@verizon.net",
    phone1: "7325833333",
    phone2: "7322414588",
    is_pending: "TRUE",
    is_contingent: "",
    status: "On Hubspot",
    year_built: "1998",
    sold_date: "1999-09-17",
    sold_price: "246500",
  },
  {
    property_id: "5605043581",
    date_scrapped: "2025-12-21 7:13",
    date_listed: "2022-04-23 2:45",
    image_URL: "",
    price: "$549,999",
    address: "283 Gordon Rd",
    city: "Old Bridge",
    state: "NJ",
    zip: "07747",
    agent_name: "",
    agent_email: "",
    phone1: "",
    phone2: "",
    is_pending: "",
    is_contingent: "TRUE",
    status: "for_sale",
    year_built: "1983",
    sold_date: "2022-06-06",
    sold_price: "650000",
  },
  {
    property_id: "5144151335",
    date_scrapped: "2025-12-21 7:13",
    date_listed: "2025-12-16 20:36",
    image_URL:
      "https://ap.rdcpix.com/527b509d0325784a59a86fe48f50ffbdl-m878269421rd.jpg",
    price: "$649,900",
    address: "898 Chesterfield Rd",
    city: "Haddonfield",
    state: "NJ",
    zip: "08033",
    agent_name: "Juliana Montalvo",
    agent_email: "jrosemontalvo@gmail.com",
    phone1: "6092257075",
    phone2: "8562854998",
    is_pending: "",
    is_contingent: "TRUE",
    status: "On Hubspot",
    year_built: "2000",
    sold_date: "2006-05-31",
    sold_price: "438000",
  },
  {
    property_id: "5509918151",
    date_scrapped: "2025-12-21 7:13",
    date_listed: "2025-12-04 3:02",
    image_URL:
      "https://ap.rdcpix.com/df7d3be154e6e07b32e53c23ceabd20al-b443294202rd.jpg",
    price: "$550,000",
    address: "44 Shirley Blvd",
    city: "Old Bridge",
    state: "NJ",
    zip: "08857",
    agent_name: "Brenda Foley",
    agent_email: "",
    phone1: "7322543750",
    phone2: "7327423503",
    is_pending: "",
    is_contingent: "TRUE",
    status: "On Hubspot",
    year_built: "1961",
    sold_date: "2005-08-29",
    sold_price: "310000",
  },
  {
    property_id: "5851589982",
    date_scrapped: "2025-12-20 7:13",
    date_listed: "2025-10-14 20:30",
    image_URL:
      "https://ap.rdcpix.com/3216727bfab271769119d146320ad001l-m1972337617rd.jpg",
    price: "$735,000",
    address: "21 Shoshone St",
    city: "Old Bridge",
    state: "NJ",
    zip: "08857",
    agent_name: "Ellen Rosenbaum",
    agent_email: "leads@ellenrosenbaum.com",
    phone1: "",
    phone2: "",
    is_pending: "",
    is_contingent: "TRUE",
    status: "for_sale",
    year_built: "1965",
    sold_date: "1987-05-26",
    sold_price: "198000",
  },
  {
    property_id: "5112936262",
    date_scrapped: "2025-12-25 7:13",
    date_listed: "2025-12-05 20:50",
    image_URL: "",
    price: "$575,000",
    address: "560 W Lincoln Ave",
    city: "Oakhurst",
    state: "NJ",
    zip: "07755",
    agent_name: "Alexis Siciliano",
    agent_email: "asiciliano104@gmail.com",
    phone1: "7329969269",
    phone2: "7326951600",
    is_pending: "TRUE",
    is_contingent: "",
    status: "On Hubspot",
    year_built: "1929",
    sold_date: "2017-10-13",
    sold_price: "270000",
  },
  {
    property_id: "6041497041",
    date_scrapped: "2025-12-25 7:13",
    date_listed: "2025-12-02 15:35",
    image_URL:
      "https://ap.rdcpix.com/ffe7e3d68bdcfc4e8a4ec7abd9495cc8l-m3605437886rd.jpg",
    price: "$999,000",
    address: "1152 Johnston Dr",
    city: "Watchung",
    state: "NJ",
    zip: "07069",
    agent_name: "Russell Williams",
    agent_email: "",
    phone1: "7326724135",
    phone2: "9087534450",
    is_pending: "TRUE",
    is_contingent: "",
    status: "On Hubspot",
    year_built: "1978",
    sold_date: "2020-04-21",
    sold_price: "865000",
  },
  {
    property_id: "6312696223",
    date_scrapped: "2025-12-25 7:13",
    date_listed: "2025-11-18 21:31",
    image_URL:
      "https://ap.rdcpix.com/4558df8066b1babd7bb0f5a47a350960l-m925204715rd.jpg",
    price: "$1,200,000",
    address: "205 Sherwin Rd",
    city: "Mullica Hill",
    state: "NJ",
    zip: "08062",
    agent_name: "Michael Martinetti",
    agent_email: "michael@michaelmartinettigroup.com",
    phone1: "9085900236",
    phone2: "9085900236",
    is_pending: "TRUE",
    is_contingent: "",
    status: "On Hubspot",
    year_built: "2008",
    sold_date: "2019-01-23",
    sold_price: "585465",
  },
  // Add more data with today's date and recent dates
  {
    property_id: "5720215459",
    date_scrapped: "2025-12-25 7:13",
    date_listed: "2025-11-08 14:34",
    image_URL:
      "https://ap.rdcpix.com/85c41e6e3032533a4b3ca1ce4b2e4254l-b467891778rd.jpg",
    price: "$669,900",
    address: "6 Brookvale Ter",
    city: "Kinnelon",
    state: "NJ",
    zip: "07405",
    agent_name: "Mark McKenna",
    agent_email: "mark.mckenna@exprealty.com",
    phone1: "6093320792",
    phone2: "6093320792",
    is_pending: "TRUE",
    is_contingent: "",
    status: "On Hubspot",
    year_built: "1986",
    sold_date: "2009-10-01",
    sold_price: "477000",
  },
  {
    property_id: "5693464290",
    date_scrapped: "2025-12-25 7:13",
    date_listed: "2025-08-20 22:16",
    image_URL: "",
    price: "$625,000",
    address: "24 Lonczak Ln",
    city: "East Brunswick",
    state: "NJ",
    zip: "08816",
    agent_name: "Anthony Nelson",
    agent_email: "anthony.nelson@coldwellbankermoves.com",
    phone1: "",
    phone2: "",
    is_pending: "",
    is_contingent: "TRUE",
    status: "On Hubspot",
    year_built: "1987",
    sold_date: "1987-05-29",
    sold_price: "255000",
  },
  {
    property_id: "9905377318",
    date_scrapped: "2025-12-23 7:13",
    date_listed: "2025-11-10 22:01",
    image_URL:
      "https://ap.rdcpix.com/5624a95d0826a2de15cc305e3528e9c5l-m1268196863rd.jpg",
    price: "$925,000",
    address: "108 Lincoln Ave",
    city: "Highland Park",
    state: "NJ",
    zip: "08904",
    agent_name: "Robert Gavura",
    agent_email: "rob.gavura@christiesrennj.com",
    phone1: "2016538488",
    phone2: "",
    is_pending: "",
    is_contingent: "TRUE",
    status: "On Hubspot",
    year_built: "1910",
    sold_date: "",
    sold_price: "",
  },
  {
    property_id: "5905802482",
    date_scrapped: "2025-12-22 7:13",
    date_listed: "2025-10-22 16:32",
    image_URL:
      "https://ap.rdcpix.com/0fa4bcaebf4a9911119689c09057235dl-b3921487696rd.jpg",
    price: "$679,900",
    address: "51 S Brook Dr",
    city: "Milltown",
    state: "NJ",
    zip: "08850",
    agent_name: "Peter Riga",
    agent_email: "",
    phone1: "7327158195",
    phone2: "7322541700",
    is_pending: "",
    is_contingent: "TRUE",
    status: "On Hubspot",
    year_built: "1970",
    sold_date: "",
    sold_price: "",
  },
  {
    property_id: "5015929224",
    date_scrapped: "2025-12-20 7:13",
    date_listed: "2025-11-21 8:09",
    image_URL:
      "https://ap.rdcpix.com/28512f1bcf6242401146127398956086l-b2813369672rd.jpg",
    price: "$525,000",
    address: "10 Lily St",
    city: "Sayreville",
    state: "NJ",
    zip: "08859",
    agent_name: "",
    agent_email: "test@example.com",
    phone1: "",
    phone2: "",
    is_pending: "",
    is_contingent: "TRUE",
    status: "On Hubspot",
    year_built: "",
    sold_date: "2004-04-15",
    sold_price: "192000",
  },
];

type DateRange = "TODAY" | "WEEKLY" | "MONTHLY" | "YR";
type DataType = "ALL" | "GOOD" | "BAD";

export default function StateDataPage() {
  const [selectedState, setSelectedState] = useState("NJ");
  const [dateRange, setDateRange] = useState<DateRange>("MONTHLY"); // Default to MONTHLY to show more data
  const [dataType, setDataType] = useState<DataType>("ALL");

  // Filter data based on date range
  const getDateFilteredData = (data: typeof allData) => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    today.setHours(0, 0, 0, 0);

    return data.filter((item) => {
      try {
        const dateStr = item.date_scrapped.split(" ")[0];
        const [year, month, day] = dateStr.split("-").map(Number);
        const scrapedDate = new Date(year, month - 1, day);
        scrapedDate.setHours(0, 0, 0, 0);

        switch (dateRange) {
          case "TODAY":
            return scrapedDate.getTime() === today.getTime();
          case "WEEKLY":
            const weekAgo = new Date(today);
            weekAgo.setDate(weekAgo.getDate() - 7);
            return scrapedDate >= weekAgo;
          case "MONTHLY":
            const monthAgo = new Date(today);
            monthAgo.setMonth(monthAgo.getMonth() - 1);
            return scrapedDate >= monthAgo;
          case "YR":
            const yearAgo = new Date(today);
            yearAgo.setFullYear(yearAgo.getFullYear() - 1);
            return scrapedDate >= yearAgo;
          default:
            return true;
        }
      } catch (error) {
        // If date parsing fails, include the item for safety
        return true;
      }
    });
  };

  // Determine if data is "good" (has image, email, and phone) or "bad"
  const isGoodData = (item: (typeof allData)[0]): boolean => {
    return !!(
      item.image_URL &&
      item.agent_email &&
      (item.phone1 || item.phone2)
    );
  };

  // Filter data based on state and data type
  const filteredData = useMemo(() => {
    let data = allData.filter(
      (item) => item.state === selectedState || selectedState === "ALL"
    );

    data = getDateFilteredData(data);

    if (dataType === "GOOD") {
      data = data.filter(isGoodData);
    } else if (dataType === "BAD") {
      data = data.filter((item) => !isGoodData(item));
    }

    return data;
  }, [selectedState, dateRange, dataType]);

  // Calculate statistics
  const stats = useMemo(() => {
    const allFiltered = getDateFilteredData(
      allData.filter(
        (item) => item.state === selectedState || selectedState === "ALL"
      )
    );

    const goodData = allFiltered.filter(isGoodData);
    const badData = allFiltered.filter((item) => !isGoodData(item));

    const missingImages = allFiltered.filter((item) => !item.image_URL);
    const missingEmail = allFiltered.filter((item) => !item.agent_email);
    const missingPhone = allFiltered.filter(
      (item) => !item.phone1 && !item.phone2
    );

    return {
      goodDataCount: goodData.length,
      badDataCount: badData.length,
      missingImagesCount: missingImages.length,
      missingEmailCount: missingEmail.length,
      missingPhoneCount: missingPhone.length,
      total: allFiltered.length,
    };
  }, [selectedState, dateRange]);

  return (
    <div className="min-h-screen bg-[#fafafa]">
      <div className="w-full">
        {/* Header */}
        <div className="bg-white border-b border-gray-200/80 px-6 py-6">
          <h1 className="text-2xl font-semibold text-gray-900 mb-1">
            {selectedState === "ALL"
              ? "All States"
              : `${selectedState} Dashboard`}
          </h1>
          <p className="text-sm text-gray-500">
            Data quality and missing information tracking
          </p>
        </div>

        {/* Controls Section */}
        <div className="px-4 sm:px-6 py-4 sm:py-6 space-y-4">
          {/* Filters Row */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Date Range Selector */}
            <div className="bg-white rounded-lg border border-gray-200/80 shadow-sm p-4">
              <label className="block text-xs font-medium text-gray-700 mb-2.5">
                Date Range
              </label>
              <div className="flex flex-wrap gap-2">
                {(["TODAY", "WEEKLY", "MONTHLY", "YR"] as DateRange[]).map(
                  (range) => (
                    <button
                      key={range}
                      onClick={() => setDateRange(range)}
                      className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all duration-150 ${
                        dateRange === range
                          ? "bg-gray-900 text-white"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      }`}
                    >
                      {range}
                    </button>
                  )
                )}
              </div>
            </div>

            {/* Good/Bad Data Selector */}
            <div className="bg-white rounded-lg border border-gray-200/80 shadow-sm p-4">
              <label className="block text-xs font-medium text-gray-700 mb-2.5">
                Data Quality
              </label>
              <div className="flex flex-wrap gap-2">
                {(["ALL", "GOOD", "BAD"] as DataType[]).map((type) => (
                  <button
                    key={type}
                    onClick={() => setDataType(type)}
                    className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all duration-150 ${
                      dataType === type
                        ? type === "GOOD"
                          ? "bg-green-600 text-white"
                          : type === "BAD"
                          ? "bg-red-600 text-white"
                          : "bg-gray-900 text-white"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    {type === "ALL"
                      ? "All Data"
                      : type === "GOOD"
                      ? "Good Data"
                      : "Bad Data"}
                  </button>
                ))}
              </div>
            </div>

            {/* State Selector */}
            <div className="bg-white rounded-lg border border-gray-200/80 shadow-sm p-4">
              <label className="block text-xs font-medium text-gray-700 mb-2.5">
                State Selection
              </label>
              <select
                value={selectedState}
                onChange={(e) => setSelectedState(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all bg-white"
              >
                <option value="ALL">All States</option>
                <option value="NJ">New Jersey (NJ)</option>
                <option value="CA">California (CA)</option>
              </select>
            </div>
          </div>

          {/* Statistics Cards */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
            {/* Good Data Scraped */}
            <div className="bg-white rounded-lg border border-gray-200/80 shadow-sm p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-medium text-gray-600">
                  Good Data
                </span>
                <svg
                  className="w-4 h-4 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <div className="text-2xl font-semibold text-gray-900">
                {stats.goodDataCount}
              </div>
              <div className="text-xs text-gray-500 mt-0.5">Scraped</div>
            </div>

            {/* Bad Data Scraped */}
            <div className="bg-white rounded-lg border border-gray-200/80 shadow-sm p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-medium text-gray-600">
                  Bad Data
                </span>
                <svg
                  className="w-4 h-4 text-red-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <div className="text-2xl font-semibold text-gray-900">
                {stats.badDataCount}
              </div>
              <div className="text-xs text-gray-500 mt-0.5">Scraped</div>
            </div>

            {/* Missing Images */}
            <div className="bg-white rounded-lg border border-gray-200/80 shadow-sm p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-medium text-gray-600">
                  Missing Images
                </span>
                <svg
                  className="w-4 h-4 text-orange-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <div className="text-2xl font-semibold text-gray-900">
                {stats.missingImagesCount}
              </div>
              <div className="text-xs text-gray-500 mt-0.5">
                {selectedState}
              </div>
            </div>

            {/* Missing Email */}
            <div className="bg-white rounded-lg border border-gray-200/80 shadow-sm p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-medium text-gray-600">
                  Missing Email
                </span>
                <svg
                  className="w-4 h-4 text-yellow-600"
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
              </div>
              <div className="text-2xl font-semibold text-gray-900">
                {stats.missingEmailCount}
              </div>
              <div className="text-xs text-gray-500 mt-0.5">
                {selectedState}
              </div>
            </div>

            {/* Missing Phone */}
            <div className="bg-white rounded-lg border border-gray-200/80 shadow-sm p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-medium text-gray-600">
                  Missing Phone
                </span>
                <svg
                  className="w-4 h-4 text-purple-600"
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
              </div>
              <div className="text-2xl font-semibold text-gray-900">
                {stats.missingPhoneCount}
              </div>
              <div className="text-xs text-gray-500 mt-0.5">
                {selectedState}
              </div>
            </div>
          </div>

          {/* Data Table */}
          <div className="bg-white rounded-lg border border-gray-200/80 shadow-sm overflow-hidden">
            <div className="px-4 sm:px-6 py-3.5 border-b border-gray-100 bg-gray-50/50">
              <h2 className="text-sm font-semibold text-gray-900">
                {dataType === "ALL"
                  ? "All Data"
                  : dataType === "GOOD"
                  ? "Good Data"
                  : "Bad Data"}{" "}
                <span className="text-gray-500 font-normal">
                  ({filteredData.length} records)
                </span>
              </h2>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-100">
                <thead className="bg-gray-50/50">
                  <tr>
                    <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                      Property ID
                    </th>
                    <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                      Image
                    </th>
                    <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                      Address
                    </th>
                    <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                      Agent Name
                    </th>
                    <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                      Email
                    </th>
                    <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                      Phone
                    </th>
                    <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-100">
                  {filteredData.length === 0 ? (
                    <tr>
                      <td
                        colSpan={7}
                        className="px-4 sm:px-6 py-12 text-center text-gray-400 text-sm"
                      >
                        No data found for the selected filters.
                      </td>
                    </tr>
                  ) : (
                    filteredData.map((property) => (
                      <tr
                        key={property.property_id}
                        className="hover:bg-gray-50/50 transition-colors duration-150"
                      >
                        <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-500">
                          {property.property_id}
                        </td>
                        <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                          {property.image_URL ? (
                            <img
                              src={property.image_URL}
                              alt={property.address}
                              className="w-12 h-12 sm:w-14 sm:h-14 object-cover rounded-md"
                            />
                          ) : (
                            <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gray-100 rounded-md flex items-center justify-center">
                              <span className="text-xs text-gray-400">
                                No Image
                              </span>
                            </div>
                          )}
                        </td>
                        <td className="px-4 sm:px-6 py-4 text-sm text-gray-600">
                          <div className="max-w-xs truncate">
                            {property.address}, {property.city},{" "}
                            {property.state} {property.zip}
                          </div>
                        </td>
                        <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                          {property.agent_name || (
                            <span className="text-gray-400">-</span>
                          )}
                        </td>
                        <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm">
                          {property.agent_email ? (
                            <a
                              href={`mailto:${property.agent_email}`}
                              className="text-blue-600 hover:text-blue-800 hover:underline"
                            >
                              {property.agent_email}
                            </a>
                          ) : (
                            <span className="text-red-500 text-xs font-medium">
                              Missing
                            </span>
                          )}
                        </td>
                        <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm">
                          {property.phone1 || property.phone2 ? (
                            <span className="text-gray-600">
                              {property.phone1 || property.phone2}
                            </span>
                          ) : (
                            <span className="text-red-500 text-xs font-medium">
                              Missing
                            </span>
                          )}
                        </td>
                        <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                          <span
                            className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium ${
                              isGoodData(property)
                                ? "bg-green-100 text-green-700"
                                : "bg-red-100 text-red-700"
                            }`}
                          >
                            {isGoodData(property) ? "Good" : "Bad"}
                          </span>
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
