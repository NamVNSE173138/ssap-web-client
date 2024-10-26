import { Link, useNavigate, useParams } from "react-router-dom";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { useEffect, useState } from "react";
import axios from "axios";
import { ScholarshipProgramType } from "../ScholarshipProgram/data";
import Spinner from "@/components/Spinner";
import ScholarshipProgramBackground from "@/components/footer/components/ScholarshipProgramImage";
import Accordion from "@mui/material/Accordion";
import AccordionActions from "@mui/material/AccordionActions";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Button from "@mui/material/Button";
import SchoolLogo from "./logo";
import { useSelector } from "react-redux";
import RouteNames from "@/constants/routeNames";
import { BASE_URL } from "@/constants/api";

const ScholarshipProgramDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [data, setData] = useState<ScholarshipProgramType | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const user = useSelector((state: any) => state.token.user);
  const isApplicant = user?.role;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `${BASE_URL}/api/scholarship-programs/${id}`
        );
        if (response.data.statusCode === 200) {
          setData(response.data.data);
        } else {
          setError("Failed to fetch data");
        }
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const deleteScholarship = async () => {
    try {
      const response = await axios.delete(`${BASE_URL}/api/scholarship-programs/${id}`)
      if (response.data.statusCode == 200) {
        setData(response.data.data)
        navigate(RouteNames.ACTIVITY)
      } else {
        setError("Failed to delete scholarship")
      }
    } catch (error) {
      setError((error as Error).message);
    } finally {
      setLoading(false);
    }
  };

  //   if (loading) return <Spinner size='large' />;
  //   if (error) return <p>Error: {error}</p>;
  if (!data) return <Spinner size="large" />;

  return (
    <div>
      <div className="relative">
        <ScholarshipProgramBackground />
        <div className="absolute top-0 bg-black/15 left-0 w-full h-full flex flex-col justify-start items-start p-[70px] gap-[170px]  z-10">
          <div>
            <Breadcrumb className="">
              <BreadcrumbList className="text-white">
                <BreadcrumbItem>
                  <Link to="/" className="md:text-xl text-lg">
                    Home
                  </Link>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <Link
                    to="/scholarship-program"
                    className=" text-white md:text-xl text-lg"
                  >
                    Scholarship Program
                  </Link>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <p className="text-white md:text-xl text-lg">{data.name}</p>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
          <div className="">
            <div className="lg:flex-row items-center :lg:items-center flex-row flex gap-[20px] ">
              <SchoolLogo imageUrl={data.imageUrl} />
              <div>
                <p className="text-white text-5xl  lg:line-clamp-3 line-clamp-5">
                  {data.name}
                </p>
                <p className="text-white text-3xl  text-heading-5 hidden lg:block mt-[12px]">
                  {data.description}
                </p>
              </div>
            </div>
            <div className="text-white text-center flex h-[50px] mt-[26px] ">
              {isApplicant == "APPLICANT" || !user ? (
                <button
                  onClick={() =>
                    navigate(`/scholarship-program/${id}/application`)
                  }
                  className=" text-xl w-full bg-blue-700 rounded-[25px]"
                >
                  Apply now{" "}
                </button>
              ) : (
                <div className="flex justify-between w-full gap-10">
                  <button
                    onClick={() => navigate("")}
                    className=" text-xl w-full  bg-blue-700 rounded-[25px]"
                  >
                    Edit{" "}
                  </button>
                  <button
                    onClick={deleteScholarship}
                    className=" text-xl w-full  bg-red-900 rounded-[25px]"
                  >
                    Delete{" "}
                  </button>
                  <button
                    onClick={() => navigate("")}
                    className=" text-xl w-full bg-green-700 rounded-[25px]"
                  >
                    View application{" "}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <div className="bg-white lg:bg-white drop-shadow-[0_0_5px_rgba(0,0,0,0.1)] lg:drop-shadow-[0_5px_25px_rgba(0,0,0,0.05)] relative">
        <section className="max-w-container mx-auto py-[24px] lg:py-[40px]">
          <div className="grid grid-cols-2 mx-[150px] lg:px-0 lg:flex gap-[30px] flex-row flex-wrap justify-between lg:gap-[40px]">
            <div className="flex flex-col">
              <p className="block mb-[4px] lg:mb-[8px] font-semibold">
                Location
              </p>
              <p className="text-heading-6">VietNam</p>
            </div>
            <div className="flex flex-col">
              <p className="block mb-[4px] lg:mb-[8px] font-semibold">
                Qualification
              </p>
              <p className="text-heading-6">VietNam</p>
            </div>
            <div className="flex flex-col">
              <p className="block mb-[4px] lg:mb-[8px] font-semibold">
                Funding type
              </p>
              <p className="text-heading-6">VietNam</p>
            </div>
            <div className="flex flex-col">
              <p className="block mb-[4px] lg:mb-[8px] font-semibold">
                Deadline
              </p>
              <p className="text-heading-6">VietNam</p>
            </div>
            <div className="flex flex-col">
              <p className="block mb-[4px] lg:mb-[8px] font-semibold">
                Value of Award
              </p>
              <p className="text-heading-6">VietNam</p>
            </div>
          </div>
        </section>
      </div>
      <section className="bg-white lg:bg-grey-lightest py-[40px] md:py-[60px]">
        <div className="max-w-[1216px] mx-auto">
          <div className="mb-[24px] px-[16px] xsm:px-[24px] 2xl:px-0">
            <p className="text-4xl">
              About the scholarship
              <span className="block bg-sky-500 w-[24px] h-[6px] rounded-[8px] mt-[4px]"></span>
            </p>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-4">
            <div className="lg:col-span-3 px-[16px] xsm:px-[24px] 2xl:px-0">
              <div className="lg:pe-[112px]">
                <Accordion defaultExpanded>
                  <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="panel1-content"
                    id="panel1-header"
                  >
                    Overview
                  </AccordionSummary>
                  <AccordionDetails>
                    <div>
                      <div className="flex gap-[16px] flex-wrap justify-between mb-[20px] md:mb-[40px]">
                        <div className="md:w-[48%] w-full">
                          <p className=" text-grey-darkest md:!mb-[8px] !mb-[4px] font-bold">
                            Awarding institution:
                          </p>
                          <Link to="" className="hover:underline">
                            {data.name}
                          </Link>
                        </div>
                        <div className="md:w-[48%] w-full">
                          <p className=" text-grey-darkest md:!mb-[8px] !mb-[4px] font-bold">
                            Average applications per year:
                          </p>
                          Not specified
                        </div>
                      </div>
                    </div>
                    <div>
                      <div className="flex gap-[16px] flex-wrap justify-between mb-[20px] md:mb-[40px]">
                        <div className="md:w-[48%] w-full">
                          <p className=" text-grey-darkest md:!mb-[8px] !mb-[4px] font-bold">
                            Qualification:
                          </p>
                          Not specified
                        </div>
                        <div className="md:w-[48%] w-full">
                          <p className=" text-grey-darkest md:!mb-[8px] !mb-[4px] font-bold">
                            Number of awards available:
                          </p>
                          {data.numberOfScholarships}
                        </div>
                      </div>
                    </div>
                    <div>
                      <div className="flex gap-[16px] flex-wrap justify-between mb-[20px] md:mb-[40px]">
                        <div className="md:w-[48%] w-full">
                          <p className=" text-grey-darkest md:!mb-[8px] !mb-[4px] font-bold">
                            Value of Award
                          </p>
                          {data.scholarshipAmount}
                        </div>
                        <div className="md:w-[48%] w-full">
                          <p className=" text-grey-darkest md:!mb-[8px] !mb-[4px] font-bold">
                            Eligible intake:
                          </p>
                          Not specified
                        </div>
                      </div>
                    </div>
                    <div>
                      <div className="flex gap-[16px] flex-wrap justify-between mb-[20px] md:mb-[40px]">
                        <div className="md:w-[48%] w-full">
                          <p className=" text-grey-darkest md:!mb-[8px] !mb-[4px] font-bold">
                            Funding details:
                          </p>
                          {data.description}
                        </div>
                        <div className="md:w-[48%] w-full">
                          <p className=" text-grey-darkest md:!mb-[8px] !mb-[4px] font-bold">
                            Funding type:
                          </p>
                          Not specified
                        </div>
                      </div>
                    </div>
                    <div>
                      <div className="flex gap-[16px] flex-wrap justify-between mb-[20px] md:mb-[40px]">
                        <div className="md:w-[48%] w-full">
                          <p className=" text-grey-darkest md:!mb-[8px] !mb-[4px] font-bold">
                            Delivery mode:
                          </p>
                          Not specified
                        </div>
                        <div className="md:w-[48%] w-full">
                          <p className=" text-grey-darkest md:!mb-[8px] !mb-[4px] font-bold">
                            Course/offer application deadline:
                          </p>
                          Not specified
                        </div>
                      </div>
                    </div>
                  </AccordionDetails>
                </Accordion>
                <Accordion>
                  <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="panel2-content"
                    id="panel2-header"
                  >
                    Entry Requirement
                  </AccordionSummary>
                  <AccordionDetails>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                    Suspendisse malesuada lacus ex, sit amet blandit leo
                    lobortis eget.
                  </AccordionDetails>
                </Accordion>
                <Accordion>
                  <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="panel3-content"
                    id="panel3-header"
                  >
                    How to Apply
                  </AccordionSummary>
                  <AccordionDetails>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                    Suspendisse malesuada lacus ex, sit amet blandit leo
                    lobortis eget.
                  </AccordionDetails>
                  <AccordionActions>
                    <Button>Cancel</Button>
                    <Button>Agree</Button>
                  </AccordionActions>
                </Accordion>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* <div className="p-12 flex flex-col justify-start gap-4">
        <section className="flex flex-col-reverse md:grid md:grid-cols-2 justify-between gap-8 md:p-12 p-8 rounded-3xl shadow shadow-gray-400">
          {loading ? (
            <Spinner size="large" />
          ) : error ? (
            <p className="text-center text-[2rem] font-semibold md:col-span-3 lg:col-span-4">
              Error loading scholarship programs detail.
            </p>
          ) : (
            <div className="columns-1 flex flex-col justify-between">
              <div className="flex flex-col gap-2">
                <h2 className="text-2xl">{data.name}</h2>
                <div>
                  <p>{data.description}</p>
                </div>
              </div>
              <div className="flex flex-col justify-between gap-4">
                <div className="flex justify-between md:w-1/3 w-[80%] md:mt-0 mt-3">
                  <div className="flex justify-start items-center gap-2">
                    <p>{data.name}</p>
                    <FaStar color="#FFB142" size={24} />
                  </div>
                  <div className="w-[1px] bg-gray-400"></div>
                  <p>{data.numberOfScholarships} Đã đặt</p>
                  <div className="w-[1px] bg-gray-400"></div>
                  <p>{data.scholarshipAmount} VND</p>
                </div>
              </div>
            </div>
          )}
        </section>
      </div> */}
    </div>
  );
};

export default ScholarshipProgramDetail;
