"use client";

import { useState } from "react";

const stateData = [
  {
    property_id: "5424086645",
    date_scrapped: "2025-12-21 7:13",
    date_listed: "2025-09-30 2:50",
    image_URL: "https://ap.rdcpix.com/3e066d33987a2e41ad84bec28568891fl-m695857921rd.jpg",
    price: "$829,000",
    address: "3 Julia Ln",
    city: "Hazlet",
    state: "NJ",
    zip: "07730",
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
    image_URL: "https://ap.rdcpix.com/8212ec04512c31031ad5b2be04b33efbl-b2425240304rd.jpg",
    price: "$549,999",
    address: "283 Gordon Rd",
    city: "Old Bridge",
    state: "NJ",
    zip: "07747",
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
    image_URL: "https://ap.rdcpix.com/527b509d0325784a59a86fe48f50ffbdl-m878269421rd.jpg",
    price: "$649,900",
    address: "898 Chesterfield Rd",
    city: "Haddonfield",
    state: "NJ",
    zip: "08033",
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
    image_URL: "https://ap.rdcpix.com/df7d3be154e6e07b32e53c23ceabd20al-b443294202rd.jpg",
    price: "$550,000",
    address: "44 Shirley Blvd",
    city: "Old Bridge",
    state: "NJ",
    zip: "08857",
    is_pending: "",
    is_contingent: "TRUE",
    status: "On Hubspot",
    year_built: "1961",
    sold_date: "2005-08-29",
    sold_price: "310000",
  },
  {
    property_id: "5851589982",
    date_scrapped: "2025-12-21 7:13",
    date_listed: "2025-10-14 20:30",
    image_URL: "https://ap.rdcpix.com/3216727bfab271769119d146320ad001l-m1972337617rd.jpg",
    price: "$735,000",
    address: "21 Shoshone St",
    city: "Old Bridge",
    state: "NJ",
    zip: "08857",
    is_pending: "",
    is_contingent: "TRUE",
    status: "for_sale",
    year_built: "1965",
    sold_date: "1987-05-26",
    sold_price: "198000",
  },
  {
    property_id: "5112936262",
    date_scrapped: "2025-12-21 7:13",
    date_listed: "2025-12-05 20:50",
    image_URL: "https://ap.rdcpix.com/68f4be985ca35aa66f539986dfadcdb7l-b560218544rd.jpg",
    price: "$575,000",
    address: "560 W Lincoln Ave",
    city: "Oakhurst",
    state: "NJ",
    zip: "07755",
    is_pending: "TRUE",
    is_contingent: "",
    status: "On Hubspot",
    year_built: "1929",
    sold_date: "2017-10-13",
    sold_price: "270000",
  },
  {
    property_id: "6041497041",
    date_scrapped: "2025-12-21 7:13",
    date_listed: "2025-12-02 15:35",
    image_URL: "https://ap.rdcpix.com/ffe7e3d68bdcfc4e8a4ec7abd9495cc8l-m3605437886rd.jpg",
    price: "$999,000",
    address: "1152 Johnston Dr",
    city: "Watchung",
    state: "NJ",
    zip: "07069",
    is_pending: "TRUE",
    is_contingent: "",
    status: "On Hubspot",
    year_built: "1978",
    sold_date: "2020-04-21",
    sold_price: "865000",
  },
  {
    property_id: "6312696223",
    date_scrapped: "2025-12-21 7:13",
    date_listed: "2025-11-18 21:31",
    image_URL: "https://ap.rdcpix.com/4558df8066b1babd7bb0f5a47a350960l-m925204715rd.jpg",
    price: "$1,200,000",
    address: "205 Sherwin Rd",
    city: "Mullica Hill",
    state: "NJ",
    zip: "08062",
    is_pending: "TRUE",
    is_contingent: "",
    status: "On Hubspot",
    year_built: "2008",
    sold_date: "2019-01-23",
    sold_price: "585465",
  },
  {
    property_id: "5720215459",
    date_scrapped: "2025-12-21 7:13",
    date_listed: "2025-11-08 14:34",
    image_URL: "https://ap.rdcpix.com/85c41e6e3032533a4b3ca1ce4b2e4254l-b467891778rd.jpg",
    price: "$669,900",
    address: "6 Brookvale Ter",
    city: "Kinnelon",
    state: "NJ",
    zip: "07405",
    is_pending: "TRUE",
    is_contingent: "",
    status: "On Hubspot",
    year_built: "1986",
    sold_date: "2009-10-01",
    sold_price: "477000",
  },
  {
    property_id: "5693464290",
    date_scrapped: "2025-12-21 7:13",
    date_listed: "2025-08-20 22:16",
    image_URL: "https://ap.rdcpix.com/97a744c1b2fd1a0b2f994a9e157320dbl-m2995043129rd.jpg",
    price: "$625,000",
    address: "24 Lonczak Ln",
    city: "East Brunswick",
    state: "NJ",
    zip: "08816",
    is_pending: "",
    is_contingent: "TRUE",
    status: "On Hubspot",
    year_built: "1987",
    sold_date: "1987-05-29",
    sold_price: "255000",
  },
  {
    property_id: "9905377318",
    date_scrapped: "2025-12-21 7:13",
    date_listed: "2025-11-10 22:01",
    image_URL: "https://ap.rdcpix.com/5624a95d0826a2de15cc305e3528e9c5l-m1268196863rd.jpg",
    price: "$925,000",
    address: "108 Lincoln Ave",
    city: "Highland Park",
    state: "NJ",
    zip: "08904",
    is_pending: "",
    is_contingent: "TRUE",
    status: "On Hubspot",
    year_built: "1910",
    sold_date: "",
    sold_price: "",
  },
  {
    property_id: "5905802482",
    date_scrapped: "2025-12-21 7:13",
    date_listed: "2025-10-22 16:32",
    image_URL: "https://ap.rdcpix.com/0fa4bcaebf4a9911119689c09057235dl-b3921487696rd.jpg",
    price: "$679,900",
    address: "51 S Brook Dr",
    city: "Milltown",
    state: "NJ",
    zip: "08850",
    is_pending: "",
    is_contingent: "TRUE",
    status: "On Hubspot",
    year_built: "1970",
    sold_date: "",
    sold_price: "",
  },
  {
    property_id: "5015929224",
    date_scrapped: "2025-12-21 7:13",
    date_listed: "2025-11-21 8:09",
    image_URL: "https://ap.rdcpix.com/28512f1bcf6242401146127398956086l-b2813369672rd.jpg",
    price: "$525,000",
    address: "10 Lily St",
    city: "Sayreville",
    state: "NJ",
    zip: "08859",
    is_pending: "",
    is_contingent: "TRUE",
    status: "On Hubspot",
    year_built: "",
    sold_date: "2004-04-15",
    sold_price: "192000",
  },
  {
    property_id: "6633102805",
    date_scrapped: "2025-12-21 7:13",
    date_listed: "2025-11-09 13:45",
    image_URL: "https://ap.rdcpix.com/44e01b89a48cafbacef28b14564de762l-m3424203975rd.jpg",
    price: "$647,000",
    address: "551 Rosewood Dr Unit 551R",
    city: "Lacey",
    state: "NJ",
    zip: "08734",
    is_pending: "",
    is_contingent: "TRUE",
    status: "On Hubspot",
    year_built: "1972",
    sold_date: "2010-07-30",
    sold_price: "286000",
  },
  {
    property_id: "5378816749",
    date_scrapped: "2025-12-21 7:13",
    date_listed: "2025-04-15 14:32",
    image_URL: "https://ap.rdcpix.com/e571822e5eac3a3a18d312e5788c74c6l-m275581712rd.jpg",
    price: "$525,000",
    address: "1986 Greentree Rd",
    city: "Cherry Hill",
    state: "NJ",
    zip: "08003",
    is_pending: "",
    is_contingent: "TRUE",
    status: "On Hubspot",
    year_built: "1986",
    sold_date: "2013-11-27",
    sold_price: "256000",
  },
];

const states = ["All", "California", "New Jersey"];

export default function StateDataPage() {
  const [selectedState, setSelectedState] = useState("All");

  const filteredData =
    selectedState === "All"
      ? stateData
      : stateData.filter((item) => item.state === (selectedState === "New Jersey" ? "NJ" : "CA"));

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent mb-2">
              State Data
            </h1>
            <p className="text-gray-600">Browse property data by state</p>
          </div>
          <div className="flex items-center space-x-4">
            <label className="text-sm font-medium text-gray-700">State Selection:</label>
            <select
              value={selectedState}
              onChange={(e) => setSelectedState(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {states.map((state) => (
                <option key={state} value={state}>
                  {state}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Property ID
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date Scrapped
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date Listed
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Image
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Price
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Address
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    City
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    State
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Zip
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Pending
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Contingent
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Year Built
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Sold Date
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Sold Price
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredData.map((property) => (
                  <tr key={property.property_id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                      {property.property_id}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                      {property.date_scrapped}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                      {property.date_listed}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <img
                        src={property.image_URL}
                        alt={property.address}
                        className="w-16 h-16 object-cover rounded"
                      />
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                      {property.price}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                      {property.address}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                      {property.city}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                      {property.state}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                      {property.zip}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                      {property.is_pending || "-"}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                      {property.is_contingent || "-"}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                      {property.status}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                      {property.year_built || "-"}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                      {property.sold_date || "-"}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                      {property.sold_price ? `$${property.sold_price}` : "-"}
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

