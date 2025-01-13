import { useState, useEffect } from "react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Link } from "react-router-dom";
import ScholarshipProgramSkeleton from "./ScholarshipProgramSkeleton";
import { Card } from "@/components/ScholarshipProgram";
import scholarshipProgram, { ScholarshipProgramType } from "./data";
import ScholarshipProgramBackground from "@/components/footer/components/ScholarshipProgramImage";
import { SearchIcon } from "lucide-react";
import { Box, Slider } from "@mui/material";
import { getAllScholarshipProgram } from "@/services/ApiServices/scholarshipProgramService";
import { FaCalendar, FaDollarSign, FaInfoCircle } from "react-icons/fa";
import { IoMdClose } from "react-icons/io";

const ITEMS_PER_PAGE = 9;

const ScholarshipProgram = () => {
  const [data, setData] = useState<ScholarshipProgramType[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [scholarshipAmount, setScholarshipAmount] = useState<number[]>([
    0, 50000,
  ]);
  const [scholarshipDeadline, setScholarshipDeadline] = useState<string>("");
  const [keyword, setKeyword] = useState<string>("");
  const [fullData, setFullData] =
    useState<ScholarshipProgramType[]>(scholarshipProgram);

  const [currentPage, setCurrentPage] = useState<number>(1);

  const handlePageExpertsChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 200, behavior: "smooth" });
  };

  const fetchData = async () => {
    try {
      const [response] = await Promise.all([getAllScholarshipProgram()]);
      if (response.data.statusCode === 200) {
        const filteredData = response.data.data.items.filter(
          (item: any) => item.status !== "Draft"
        );
        setData(filteredData);
        setFullData(filteredData);
      } else {
        setError("Failed to fetch data");
      }
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const filterScholarships = () => {
    let filteredData = fullData;
    if (keyword) {
      const keywordLower = keyword.toLowerCase();
      filteredData = filteredData.filter(
        (scholarship) =>
          scholarship.name.toLowerCase().includes(keywordLower) ||
          scholarship.major.name.toLowerCase().includes(keywordLower)
      );
    }

    filteredData = filteredData.filter((scholarship) => {
      const scholarshipValue = scholarship.scholarshipAmount;
      return (
        scholarshipValue >= scholarshipAmount[0] &&
        scholarshipValue <= scholarshipAmount[1]
      );
    });

    if (scholarshipDeadline) {
      const deadlineDate = new Date(scholarshipDeadline);
      filteredData = filteredData.filter((scholarship) => {
        const scholarshipDeadlineDate = new Date(scholarship.deadline);
        return scholarshipDeadlineDate >= deadlineDate;
      });
    }

    setData(filteredData);
    setCurrentPage(1);
  };

  const totalDataPages = Math.ceil(data?.length / ITEMS_PER_PAGE);
  const paginatedData = data?.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    filterScholarships();
  }, [keyword, scholarshipAmount, scholarshipDeadline, fullData]);

  return (
    <div className="bg-white">
      <div className="relative">
        <ScholarshipProgramBackground />
      </div>

      <div className="relative w-full flex flex-col lg:flex-row justify-between items-center p-5 lg:p-[40px] z-10">
        <Breadcrumb className="flex-1">
          <BreadcrumbList className="text-[#000] font-bold">
            <BreadcrumbItem>
              <Link
                to="/"
                className="text-lg md:text-xl hover:underline cursor-pointer"
              >
                Home
              </Link>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <p className="text-[#1eb2a6] font-medium text-lg md:text-xl hover:underline cursor-pointer">
                Scholarship Program
              </p>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <div className="relative w-full max-w-xl mt-4 lg:mt-0">
          <input
            className="w-full h-12 pl-14 pr-12 py-3 border-2 border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#1eb2a6] focus:border-[#1eb2a6] transition-all duration-300 ease-in-out rounded-lg text-lg placeholder-gray-500 text-gray-800"
            placeholder="Search by scholarship name"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
          />
          <SearchIcon className="absolute top-1/2 left-4 transform -translate-y-1/2 text-gray-500 text-xl" />
          {keyword && (
            <IoMdClose
              className="absolute top-1/2 right-4 transform -translate-y-1/2 text-gray-500 cursor-pointer text-xl hover:text-red-500 transition-colors"
              onClick={() => setKeyword("")}
            />
          )}
        </div>
      </div>

      <div className="flex flex-col lg:flex-row px-5 lg:px-10 gap-5 mb-10">
        <div className="w-full lg:w-[400px]">
          <div className="bg-white p-5 shadow-lg">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Filters
            </h3>
            <p>You can narrow your search with the filters below.</p>

            <div className="mt-5 mb-5">
              <div className="flex items-center gap-3 mb-3">
                <FaDollarSign className="text-[#1eb2a6] text-xl" />
                <p className="font-medium text-gray-800">Amount</p>
              </div>
              <Box sx={{ width: "100%", padding: "0px 10px" }}>
                <Slider
                  aria-label="Scholarship Amount"
                  value={scholarshipAmount}
                  max={50000}
                  onChange={(_: Event, value: number | number[]) =>
                    setScholarshipAmount(value as number[])
                  }
                  valueLabelDisplay="auto"
                  valueLabelFormat={(value: number) =>
                    new Intl.NumberFormat("en-US", {
                      style: "currency",
                      currency: "USD",
                    }).format(value)
                  }
                  marks={[
                    { value: 0, label: "$0" },
                    { value: 50000, label: "Max" },
                  ]}
                  disableSwap
                  sx={{
                    color: "#1eb2a6",
                    "& .MuiSlider-thumb": {
                      backgroundColor: "#1eb2a6",
                      "&:hover, &.Mui-focusVisible": {
                        boxShadow: "0px 0px 0px 8px rgba(30, 178, 166, 0.16)",
                      },
                    },
                    "& .MuiSlider-rail": {
                      backgroundColor: "#e0e0e0",
                    },
                  }}
                />
              </Box>
            </div>

            <div>
              <div className="flex items-center gap-3 mb-3">
                <FaCalendar className="text-[#1eb2a6] text-xl" />
                <p className="font-medium text-gray-800">Deadline</p>
                <FaInfoCircle
                  className="text-gray-500 text-sm cursor-pointer"
                  title="Filter scholarships with deadlines on or before the selected date."
                />
              </div>
              <div className="relative">
                <input
                  type="date"
                  value={scholarshipDeadline}
                  onChange={(e) => setScholarshipDeadline(e.target.value)}
                  className="w-full mb-4 py-2 px-3 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-[#1eb2a6] focus:outline-none text-gray-800 placeholder-gray-400 transition duration-200"
                  placeholder="Select a deadline"
                />
              </div>
            </div>
          </div>
        </div>

        <menu className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading ? (
            <ScholarshipProgramSkeleton />
          ) : error ? (
            <p className="text-center text-2xl font-semibold text-red-600 col-span-full">
              Error loading scholarship programs.
            </p>
          ) : data.length === 0 ? (
            <p className="text-center text-2xl font-semibold text-gray-600 col-span-full">
              No data found matching your search.
            </p>
          ) : (
            <>
              {paginatedData.map((scholarship: any) => (
                <li key={scholarship.id}>
                  <Card {...scholarship} />
                </li>
              ))}
              <div className="col-span-full mt-5 flex justify-center">
                {Array.from({ length: totalDataPages }, (_, index) => (
                  <button
                    key={index}
                    onClick={() => handlePageExpertsChange(index + 1)}
                    className={`mx-1 px-4 py-2 rounded-lg ${
                      currentPage === index + 1
                        ? "bg-[#419f97] text-white"
                        : "bg-gray-200 text-black"
                    }`}
                  >
                    {index + 1}
                  </button>
                ))}
              </div>
            </>
          )}
        </menu>
      </div>
    </div>
  );
};

export default ScholarshipProgram;
