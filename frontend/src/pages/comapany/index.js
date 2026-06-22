import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import moment from "moment";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import { axios_post } from "../../axios";
import constantApi from "constantApi";

export default function CompanyCardView() {
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedMain, setSelectedMain] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    const res = await axios_post(true, "company/list");
    if (res?.status) setData(res.data.records || []);
    setLoading(false);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this company?"))
      return;
    const res = await axios_post(true, "company/delete", { id });
    if (res?.status) fetchData();
  };

  // group by main company
  const mainCompanies = useMemo(() => {
    const map = {};
    data.forEach((c) => {
      const key = c.main_company_id || "no-main";
      if (!map[key]) map[key] = [];
      map[key].push(c);
    });
    return map;
  }, [data]);

  const getMainCompany = (id) => {
    return data.find((d) => d.id === Number(id));
  };

  return (
    <DashboardLayout>
      <DashboardNavbar />

      <div className="p-4 space-y-5">
        <h1 className="text-lg font-semibold">Company Overview</h1>

        {/* + New */}
        <div className="flex justify-end mb-4">
          <button
            onClick={() => navigate("/master/company")}
            className="px-2 py-1 text-xs bg-blue-600 text-white rounded"
          >
            + New
          </button>
        </div>

        {/* MAIN COMPANIES */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {Object.entries(mainCompanies).map(([mainId, companies]) => {
            const mainCompany =
              mainId !== "no-main" ? getMainCompany(mainId) : null;

            return (
              <div
                key={mainId}
                onClick={() => setSelectedMain(mainId)}
                className={`cursor-pointer rounded-lg border p-4 hover:shadow
                ${
                  selectedMain === mainId
                    ? "border-blue-500 bg-blue-50"
                    : "bg-white"
                }`}
              >
                {/* COMPANY HEADER */}
                <div className="flex gap-3">
                  {mainCompany?.clogo && (
                    <img
                      src={`${constantApi.imageUrl}/logos/${mainCompany.clogo}`}
                      className="w-9 h-9 rounded object-cover"
                      alt=""
                    />
                  )}

                  <div>
                    <div className="text-sm font-medium">
                      {mainId === "no-main"
                        ? "Independent Companies"
                        : mainCompany?.compdesc}
                    </div>

                    {mainCompany?.compcode && (
                      <div className="text-xs text-gray-500">
                        {mainCompany.compcode}
                      </div>
                    )}
                  </div>
                </div>

                {/* LOCATIONS */}
                {(mainCompany?.location || []).length > 0 && (
                  <div className="mt-3 border-t pt-2 space-y-1">
                    {mainCompany.location.map((loc, idx) => (
                      <div
                        key={idx}
                        className="flex justify-between text-[11px] text-gray-600"
                      >
                        <span className="truncate">{loc.locname}</span>
                        <span className="text-gray-400">{loc.loccode}</span>
                      </div>
                    ))}
                  </div>
                )}

                <div className="mt-2 text-xs text-gray-500">
                  {companies.length} companies
                </div>
              </div>
            );
          })}
        </div>

        {/* SUB COMPANIES */}
        {selectedMain && (
          <div className="space-y-4">
            <h2 className="text-sm font-semibold text-gray-700">
              Companies & Locations
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {mainCompanies[selectedMain].map((company) => (
                <div
                  key={company.id}
                  className="relative rounded-lg border bg-white p-4 hover:shadow-sm"
                >
                  {/* ACTIONS */}
                  <div className="absolute top-2 right-2 flex gap-2 text-xs">
                    <button
                      onClick={() =>
                        navigate(`/master/company/view/${company.id}`)
                      }
                      className="text-blue-600"
                    >
                      👁
                    </button>
                    <button
                      onClick={() =>
                        navigate(`/master/company/edit/${company.id}`)
                      }
                      className="text-green-600"
                    >
                      ✏️
                    </button>
                    <button
                      onClick={() => handleDelete(company.id)}
                      className="text-red-600"
                    >
                      🗑
                    </button>
                  </div>

                  {/* INFO */}
                  <div className="flex gap-3">
                    {company.clogo && (
                      <img
                        src={`${constantApi.imageUrl}/logos/${company.clogo}`}
                        className="w-8 h-8 rounded"
                        alt=""
                      />
                    )}
                    <div>
                      <div className="text-sm font-medium">
                        {company.compdesc}
                      </div>
                      <div className="text-[11px] text-gray-500">
                        {company.compcode} •{" "}
                        {moment(company.created_at).format("DD MMM YYYY")}
                      </div>
                    </div>
                  </div>

                  {/* LOCATIONS */}
                  {(company.location || []).length > 0 && (
                    <div className="mt-3 border-t pt-2 space-y-1">
                      {company.location.map((loc, idx) => (
                        <div
                          key={idx}
                          className="flex justify-between text-[11px] text-gray-600"
                        >
                          <span className="truncate">{loc.locname}</span>
                          <span className="text-gray-400">{loc.loccode}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {loading && <div className="text-xs text-gray-500">Loading...</div>}
      </div>
    </DashboardLayout>
  );
}
