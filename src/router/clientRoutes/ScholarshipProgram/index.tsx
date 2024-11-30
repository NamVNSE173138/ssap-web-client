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
import axios from "axios";
import scholarshipProgram, { ScholarshipProgramType } from "./data";
import ScholarshipProgramBackground from "@/components/footer/components/ScholarshipProgramImage";
import { BASE_URL } from "@/constants/api";
import { getAllCountries } from "@/services/ApiServices/countryService";
import { getAllMajors } from "@/services/ApiServices/majorService";
import { getAllCategories } from "@/services/ApiServices/categoryService";
import { ArrowDownIcon, CalendarIcon, SearchIcon } from "lucide-react";
import { getAllCertificates } from "@/services/ApiServices/certificateService";
import { Accordion, AccordionDetails, AccordionSummary, Box, Container, Slider } from "@mui/material";
import { getScholarshipProgram, searchScholarshipProgram } from "@/services/ApiServices/scholarshipProgramService";
import { FaCalendarAlt, FaCircle, FaDollarSign } from "react-icons/fa";
import { HiOutlineChevronDown } from "react-icons/hi";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
const ScholarshipProgram = () => {
  const [data, setData] =
    useState<ScholarshipProgramType[]>(scholarshipProgram);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [countries, setCountries] = useState<{ name: string }[]>([]);
  const [majors, setMajors] = useState<{ name: string }[]>([]);
  const [categories, setCategories] = useState<{ name: string }[]>([]);
  const [certificates, setCertificates] = useState<{ name: string }[]>([]);

  const [scholarshipAmount, setScholarshipAmount] = useState<number[]>([0, 1400000]);
  const [scholarshipDeadline, setScholarshipDeadline] = useState<string>("");
  const [scholarshipStatus, setScholarshipStatus] = useState<string>("");
  const [scholarshipCategory, setScholarshipCategory] = useState<string>("");
  const [scholarshipKeyword, setScholarshipKeyword] = useState<string>("");

  const handleSearch = async () => {
    if (!scholarshipKeyword || scholarshipAmount[0] == null || scholarshipAmount[1] == null || !scholarshipCategory || !scholarshipStatus || !scholarshipDeadline) {
      setLoading(true);
      await fetchData();
      return;
    }
    try {
      setLoading(true);
      const response = await searchScholarshipProgram(
        scholarshipKeyword,
        scholarshipAmount[0],
        scholarshipAmount[1],
        scholarshipCategory,
        scholarshipStatus,
        scholarshipDeadline && new Date(scholarshipDeadline).toISOString());
      const scholarships = []
      for (let res of response.data) {
        const scholarshipProgram = await getScholarshipProgram(res.id);
        scholarships.push(scholarshipProgram.data);
      }
      setData(scholarships);

      if (response.statusCode === 200) {
      } else {
        //setError("Failed to fetch data");
      }
    } catch (err) {
      //setError((err as Error).message);
    } finally {
      setLoading(false);
    }


    //console.log(scholarshipAmount, scholarshipDeadline, scholarshipStatus, scholarshipCategory);
  };
  const fetchData = async () => {
    try {
      const response = await axios.get(
        `${BASE_URL}/api/scholarship-programs`
      );
      const countryDatas = await getAllCountries();
      const majorDatas = await getAllMajors();
      const categoriesDatas = await getAllCategories();
      const certificatesDatas = await getAllCertificates();

      if (response.data.statusCode === 200) {
        setData(response.data.data.items);
        setCountries(countryDatas.data);
        setMajors(majorDatas.data.items);
        setCategories(categoriesDatas.data);
        setCertificates(certificatesDatas.data);
      } else {
        setError("Failed to fetch data");
      }
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {


    fetchData();
  }, []);

  // useEffect(() => {
  //   const fetchCountriesData = async () => {
  //     try {
  //       const response = await axios.get(`${BASE_URL}/api/countries`);
  //       console.log("Countries API Response:", response.data);
  //       if (response.data.statusCode === 200) {
  //         const countryNames = response.data.data.map(
  //           (country: { name: string }) => ({
  //             name: country.name,
  //           })
  //         );
  //         setCountries(countryNames);
  //       } else {
  //         setError("Failed to fetch countries data");
  //       }
  //     } catch (err) {
  //       setError((err as Error).message);
  //     }
  //   };

  //   fetchCountriesData();
  // }, []);

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

          <form action="" className="w-full">
            <div className="flex items-center mb-5  rounded-sm relative after:absolute after:right-[16px] after:top-[22px] bg-white after:w-[12px] after:h-[7px] w-full  cursor-pointer ">
              <SearchIcon className="w-[20px] h-[20px] ml-3 rounded-full" />
              <input value={scholarshipKeyword} onChange={(e) => setScholarshipKeyword(e.target.value)}
                placeholder="Search scholarships by keyword" className="w-full outline-none py-[13px] pl-[16px] pr-[32px]" type="text" />
            </div>
            <div className="grid gap-[16px] grid-cols-1 lg:grid-cols-[1fr_120px]">
              <div className="flex gap-[16px] flex-col lg:flex-row flex-wrap">
                <div className=" rounded-sm py-[13px] pl-[16px] pr-[32px] relative after:absolute after:right-[16px] after:top-[22px] bg-white after:w-[12px] after:h-[7px] w-full sm:1/2 lg:w-1/5 cursor-pointer ">
                  <label hidden>Study Major</label>
                  <select className="w-full">
                    <option value="">Select study major</option>
                    {majors.map((major, index) => (
                      <option key={index} value={major.name}>
                        {major.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="rounded-sm py-[13px] pl-[16px] pr-[32px] relative  after:absolute after:right-[16px] after:top-[22px] bg-white after:w-[12px] after:h-[7px] w-1/5 cursor-pointer">
                  <label hidden>Study destination</label>
                  <select className="w-full">
                    <option value="">Select a study destination</option>
                    {countries.map((country, index) => (
                      <option key={index} value={country.name}>
                        {country.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className=" rounded-sm py-[13px] pl-[16px] pr-[32px] relative  after:absolute after:right-[16px] after:top-[22px] bg-white after:w-[12px] after:h-[7px] w-1/5 cursor-pointer">
                  <label hidden>Scholarship Categories</label>
                  <select value={scholarshipCategory} onChange={(e) => setScholarshipCategory(e.target.value)} className="w-full">
                    <option value="">Select a scholarship categories</option>
                    {categories.map((category, index) => (
                      <option key={index} value={category.name}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="rounded-sm py-[13px] pl-[16px] pr-[32px] relative  after:absolute after:right-[16px] after:top-[22px] bg-white after:w-[12px] after:h-[7px] w-1/5 cursor-pointer">
                  <label hidden>Scholarship Certificates</label>
                  <select className="w-full">
                    <option value="">Select a scholarship certificates</option>
                    {certificates.map((certificate, index) => (
                      <option key={index} value={certificate.name}>
                        {certificate.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className=" flex w-full text-white  justify-center rounded-full">
                <Button className="bg-[#1eb2a6] w-full h-full" type="button" onClick={handleSearch}>Search</Button>
              </div>
            </div>
          </form>
        </div>
      </div>

      <div className="flex px-10 gap-5">

        <div className="w-[250px] mt-10">
          <span className="bg-[#1eb2a6] w-[98%] mx-auto mb-3 rounded-full h-[3px] block"></span>

          {/* Amount Accordion */}
          <Accordion defaultExpanded>
            <AccordionSummary
              expandIcon={<HiOutlineChevronDown className="text-[#1eb2a6] text-2xl" />}
              aria-controls="panel1-content"
              id="panel1-header"
            >
              <div className="flex items-center gap-3">
                <FaDollarSign className="text-[#1eb2a6] text-xl" />
                <p className="font-semibold text-lg text-gray-800">Amount</p>
              </div>
            </AccordionSummary>
            <AccordionDetails>
              <Box sx={{ width: "100%", padding: "0px 10px" }}>
                <Slider
                  aria-label="Scholarship Amount"
                  value={scholarshipAmount}
                  max={1400000}
                  onChange={(_: Event, value: number | number[]) =>
                    setScholarshipAmount(value as number[])
                  }
                  valueLabelDisplay="auto"
                  valueLabelFormat={(value: number) =>
                    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value)
                  }
                  marks={[
                    { value: 0, label: '$0' },
                    { value: 1400000, label: 'Max' },
                  ]}
                  disableSwap
                />
              </Box>
            </AccordionDetails>
          </Accordion>

          {/* Deadline Accordion */}
          <Accordion defaultExpanded>
            <AccordionSummary
              expandIcon={<HiOutlineChevronDown className="text-[#1eb2a6] text-2xl" />}
              aria-controls="panel2-content"
              id="panel2-header"
            >
              <div className="flex items-center gap-3">
                <FaCalendarAlt className="text-[#1eb2a6] text-xl" />
                <p className="font-semibold text-lg text-gray-800">Deadline After</p>
              </div>
            </AccordionSummary>
            <AccordionDetails>
              <div className="flex items-center mb-5 border border-zinc-950 rounded-sm relative bg-white">
                <FaCalendarAlt className="w-[20px] h-[20px] ml-3 text-[#1eb2a6]" />
                <input
                  value={scholarshipDeadline}
                  onChange={(e) => setScholarshipDeadline(e.target.value)}
                  className="w-full outline-none py-[13px] pl-[16px] pr-[32px]"
                  type="date"
                />
              </div>
            </AccordionDetails>
          </Accordion>

          {/* Status Accordion */}
          <Accordion defaultExpanded>
            <AccordionSummary
              expandIcon={<HiOutlineChevronDown className="text-[#1eb2a6] text-2xl" />}
              aria-controls="panel3-content"
              id="panel3-header"
            >
              <div className="flex items-center gap-3">
                <FaCircle className="text-[#1eb2a6] text-xl" />
                <p className="font-semibold text-lg text-gray-800">Status</p>
              </div>
            </AccordionSummary>
            <AccordionDetails>
              <div className="flex py-[13px] pl-[16px] pr-[32px] items-center mb-5 border border-zinc-950 rounded-sm relative bg-white">
                <select
                  value={scholarshipStatus}
                  onChange={(e) => setScholarshipStatus(e.target.value)}
                  className="w-full h-full outline-none bg-white focus:ring-2 focus:ring-sky-500"
                >
                  <option>Select scholarship status</option>
                  <option value="ACTIVE">ACTIVE</option>
                  <option value="FINISHED">FINISHED</option>
                  <option value="INACTIVE">INACTIVE</option>
                </select>
              </div>
            </AccordionDetails>
          </Accordion>
        </div>


        <menu className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 justify-between items-start gap-10 mt-10 my-8  px-12">
          {loading ? (
            <ScholarshipProgramSkeleton />
          ) : error ? (
            <p className="text-center text-[2rem] font-semibold md:col-span-3 lg:col-span-4">
              Error loading scholarship programs.
            </p>
          ) : data.length == 0 ? (
            <p className="text-center text-[2rem] font-semibold md:col-span-3 lg:col-span-4">
              No scholarship programs found.
            </p>
          ) : (
            data.map((service: any) => (
              <li key={service.id}>
                <Card {...service} />
              </li>
            ))
          )}
        </menu>
      </div>
    </div>
  );
};

export default ScholarshipProgram;
