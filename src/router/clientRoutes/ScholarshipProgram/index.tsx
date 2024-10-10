import { useState, useEffect } from "react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import RouteNames from "@/constants/routeNames";
import { Link } from "react-router-dom";
import ScholarshipProgramSkeleton from "./ScholarshipProgramSkeleton";
import { Card } from "@/components/ScholarshipProgram";
import axios from "axios";
import scholarshipProgram, { ScholarshipProgramType } from "./data";

const ScholarshipProgram = () => {
  const [data, setData] = useState<ScholarshipProgramType[]>(scholarshipProgram);
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

  // if (loading) return <p>Loading...</p>;
  // if (error) return <p>Error: {error}</p>;

  return (
    <div className="my-8 px-12">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <Link
              to={RouteNames.SCHOLARSHIP_PROGRAM}
              className="md:text-xl text-lg"
            >
              Dịch vụ
            </Link>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <p className="text-black md:text-xl text-lg">
              Scholarship Program
            </p>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <menu className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 justify-between items-start gap-10 mt-6">
        {loading ? (
          <ScholarshipProgramSkeleton />
        ) : error ? (
          <p className="text-center text-[2rem] font-semibold md:col-span-3 lg:col-span-4">
            Error loading scholarship programs.
          </p>
        ) : data.length == 0 ? (
          <p className="text-center text-[2rem] font-semibold md:col-span-3 lg:col-span-4">
            Chưa có dịch vụ nào
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
