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
import { Accordion, AccordionDetails, AccordionSummary, Box, Slider } from "@mui/material";
import { getAllScholarshipProgram } from "@/services/ApiServices/scholarshipProgramService";
import { FaCalendar, FaDollarSign, FaInfoCircle } from "react-icons/fa";
import { HiOutlineChevronDown } from "react-icons/hi";
import { IoMdClose } from "react-icons/io";

const ITEMS_PER_PAGE = 6;

const ScholarshipProgram = () => {
  const [data, setData] = useState<ScholarshipProgramType[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [scholarshipAmount, setScholarshipAmount] = useState<number[]>([0, 50000]);
  const [scholarshipDeadline, setScholarshipDeadline] = useState<string>("");
  const [keyword, setKeyword] = useState<string>("");
  const [fullData, setFullData] = useState<ScholarshipProgramType[]>(scholarshipProgram);

  const [currentPage, setCurrentPage] = useState<number>(1);

  const handlePageExpertsChange = (page: number) => {
    setCurrentPage(page);
  };

  const fetchData = async () => {
    try {
      const [
        response,
      ] = await Promise.all([
        getAllScholarshipProgram(),
      ]);
      if (response.data.statusCode === 200) {
        const filteredData = response.data.data.items.filter(
          (item: any) => item.status !== 'Draft'
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

    // Lọc theo từ khóa
    if (keyword) {
      const keywordLower = keyword.toLowerCase();
      filteredData = filteredData.filter(
        (scholarship) =>
          scholarship.name.toLowerCase().includes(keywordLower) ||
          scholarship.major.name.toLowerCase().includes(keywordLower)
      );
    }

    // Lọc theo khoảng giá trị
    filteredData = filteredData.filter((scholarship) => {
      const scholarshipValue = scholarship.scholarshipAmount;
      return scholarshipValue >= scholarshipAmount[0] && scholarshipValue <= scholarshipAmount[1];
    });

    // Lọc theo deadline
    if (scholarshipDeadline) {
      const deadlineDate = new Date(scholarshipDeadline);
      filteredData = filteredData.filter((scholarship) => {
        const scholarshipDeadlineDate = new Date(scholarship.deadline);
        return scholarshipDeadlineDate >= deadlineDate; // Chỉ giữ các học bổng có hạn sau hoặc bằng ngày lọc
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
    <div>
      <div>
        <div className="relative">
          <ScholarshipProgramBackground />
          <div className="absolute top-0 bg-black/15 left-0 w-full h-full flex flex-col justify-between items-start p-[40px] z-10">
            <div>
              <Breadcrumb className="">
                <BreadcrumbList className="text-[#000]">
                  <BreadcrumbItem>
                    <Link to="/" className="md:text-xl text-lg">
                      Home
                    </Link>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator />
                  <BreadcrumbItem>
                    <p className="text-[#000] font-medium md:text-xl text-lg">
                      Scholarship Program
                    </p>
                  </BreadcrumbItem>
                </BreadcrumbList>
              </Breadcrumb>
            </div>

            <div className="w-full mt-4 lg:mt-6">
              <div className="relative w-full">
                <input
                  className="w-2/3 h-12 pl-14 pr-12 py-3 border-2 border-gray-300 focus:outline-none focus:ring-4 focus:ring-blue-400 focus:border-blue-500 transition-all duration-300 ease-in-out rounded-lg shadow-lg bg-gradient-to-r  text-lg placeholder-gray-500 text-gray-800"
                  placeholder="Search for scholarship, major..."
                  value={keyword}
                  onChange={(e) => {
                    setKeyword(e.target.value);
                    console.log(e.target.value);
                  }}
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
          </div>
        </div>

        <div className="flex flex-wrap px-10 gap-5">

          <div className="w-full xl:w-[9%] min-w-[200px] mt-10 mr-5">
            <span className="bg-[#1eb2a6] w-full mx-auto mb-3 rounded-full h-[3px] block"></span>
            <Accordion defaultExpanded>
              <AccordionSummary
                expandIcon={<HiOutlineChevronDown className="text-[#1eb2a6] text-2xl" />}
                aria-controls="panel1-content"
                id="panel1-header"
              >
                <div className="flex items-center gap-3">
                  <FaDollarSign className="text-[#1eb2a6] text-lg lg:text-xl" />
                  <p className="font-semibold text-md lg:text-lg text-gray-800">Amount</p>
                </div>
              </AccordionSummary>
              <AccordionDetails>
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
                      new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value)
                    }
                    marks={[
                      { value: 0, label: '$0' },
                      { value: 50000, label: 'Max' },
                    ]}
                    disableSwap
                  />
                </Box>
              </AccordionDetails>
            </Accordion>
            <Accordion defaultExpanded>
              <AccordionSummary
                expandIcon={<HiOutlineChevronDown className="text-[#1eb2a6] text-2xl" />}
                aria-controls="panel2-content"
                id="panel2-header"
              >
                <div className="flex items-center gap-3">
                  <FaCalendar className="text-[#1eb2a6] text-lg lg:text-xl" />
                  <p className="font-semibold text-md lg:text-lg text-gray-800">Deadline</p>
                  <FaInfoCircle
                    className="text-gray-600 cursor-pointer"
                    title="The date you filter must be less than the deadline date of that scholarship."
                  />
                </div>

              </AccordionSummary>
              <AccordionDetails>
                <div className="flex items-center mb-5 border border-zinc-950 rounded-sm relative bg-white">
                  <FaCalendar className="w-[20px] h-[20px] ml-3 text-[#1eb2a6]" />
                  <input
                    value={scholarshipDeadline}
                    onChange={(e) => setScholarshipDeadline(e.target.value)}
                    className="w-[85%] lg:w-full outline-none py-[13px] pl-[16px] pr-[32px]"
                    type="date"
                  />
                </div>
              </AccordionDetails>
            </Accordion>
          </div>


          <menu className="w-[100%] xl:w-[80%] grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 mt-10">
            {loading ? (
              <ScholarshipProgramSkeleton />
            ) : error ? (
              <p className="text-center text-2xl font-semibold text-red-600 md:col-span-3 lg:col-span-4">
                Error loading scholarship programs.
              </p>
            ) : data.length === 0 ? (
              <p className="text-center text-2xl font-semibold text-gray-600 md:col-span-3 lg:col-span-4">
                No data found matching your search.
              </p>
            ) : (
              paginatedData.map((scholarship: any) => (
                <li key={scholarship.id}>
                  <Card {...scholarship} />
                </li>
              ))
            )}
          </menu>
        </div>

      </div>
      <div style={{ marginTop: "30px", marginBottom: '10px', display: "flex", justifyContent: "center", marginLeft: '100px' }}>
        {Array.from({ length: totalDataPages }, (_, index) => (
          <button
            key={index}
            onClick={() => handlePageExpertsChange(index + 1)}
            style={{
              margin: "0 5px",
              padding: "5px 10px",
              backgroundColor: currentPage === index + 1 ? "#419f97" : "#f1f1f1",
              color: currentPage === index + 1 ? "white" : "black",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
            }}
          >
            {index + 1}
          </button>
        ))}
      </div>
    </div>

  );
};

export default ScholarshipProgram;
