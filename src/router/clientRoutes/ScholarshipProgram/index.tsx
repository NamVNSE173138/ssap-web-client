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
const ScholarshipProgram = () => {
  const [data, setData] =
    useState<ScholarshipProgramType[]>(scholarshipProgram);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [scholarshipAmount, setScholarshipAmount] = useState<number[]>([0, 50000]);
  const [scholarshipDeadline, setScholarshipDeadline] = useState<string>("");
  const [keyword, setKeyword] = useState<string>("");
  const [fullData, setFullData] = useState<ScholarshipProgramType[]>(scholarshipProgram);

  const fetchData = async () => {
    try {
      const [
    response,
    /*countryDatas,
    majorDatas,
    categoriesDatas,
    certificatesDatas*/
  ] = await Promise.all([
    getAllScholarshipProgram(),
    /*getAllCountries(),
    getAllMajors(),
    getAllCategories(),
    getAllCertificates()*/
  ]);
      if (response.data.statusCode === 200) {
        setData(response.data.data.items);
        setFullData(response.data.data.items);
        /*setCountries(countryDatas.data);
        setMajors(majorDatas.data.items);
        setCategories(categoriesDatas.data);
        setCertificates(certificatesDatas.data);*/
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
    const dataFull = fullData;

    const filteredByKeyword = dataFull.filter((scholarship) => {
      const keywordLower = keyword.toLowerCase();
      return (
        scholarship.name.toLowerCase().includes(keywordLower) ||
        (scholarship.university).name.toLowerCase().includes(keywordLower) ||
        (scholarship.major).name.toLowerCase().includes(keywordLower)
      );
    });

    const filteredScholarships = filteredByKeyword.filter((scholarship) => {
      const scholarshipValue = scholarship.scholarshipAmount;
      const scholarshipDeadlineDate = new Date(scholarship.deadline);

      const isWithinAmountRange =
        scholarshipValue >= scholarshipAmount[0] && scholarshipValue <= scholarshipAmount[1];
      const isAfterDeadline =
        scholarshipDeadline ? scholarshipDeadlineDate >= new Date(scholarshipDeadline) : true;

      return isWithinAmountRange && isAfterDeadline;
    });

    setData(filteredScholarships);
  };


  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    filterScholarships();
  }, [keyword, scholarshipAmount, scholarshipDeadline, fullData]);



  return (
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
                placeholder="Search for scholarship, university, major..."
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

      <div className="flex px-10 gap-5">

        <div className="w-[200px] lg:w-[250px] mt-10">
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


        <menu className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 justify-between items-start gap-10 mt-10 my-8  px-12">
          {loading ? (
            <ScholarshipProgramSkeleton />
          ) : error ? (
            <p className="text-center text-[2rem] font-semibold md:col-span-3 lg:col-span-4">
              Error loading scholarship programs.
            </p>
          ) : data.length === 0 ? (
            <p className="text-center text-[2rem] font-semibold md:col-span-3 lg:col-span-4">
              No data found matching your search.
            </p>
          ) : (
            data.map((scholarship: any) => (
              <li key={scholarship.id}>
                <Card {...scholarship} />
              </li>
            ))
          )}
        </menu>
      </div>
    </div>
  );
};

export default ScholarshipProgram;
