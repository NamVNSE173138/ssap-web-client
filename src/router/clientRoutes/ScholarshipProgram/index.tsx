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

const ScholarshipProgram = () => {
  const [data, setData] =
    useState<ScholarshipProgramType[]>(scholarshipProgram);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5254/api/scholarship-programs"
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
  }, []);

  return (
    <div>
      <div className="relative">
        <ScholarshipProgramBackground />
        <div className="absolute top-0 bg-black/15 left-0 w-full h-full flex flex-col justify-start items-start p-[70px] z-10">
        <div>
          <Breadcrumb className=" ">
            <BreadcrumbList className="text-white">
              <BreadcrumbItem>
                <Link to="/" className="md:text-xl text-lg">
                  Home
                </Link>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <p className="text-white md:text-xl text-lg">
                  Scholarship Program
                </p>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
          </div>
        </div>
      </div>
      <menu className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 justify-between items-start gap-10 mt-10 my-8  px-12">
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
  );
};

export default ScholarshipProgram;
