import { IoIosAddCircleOutline } from "react-icons/io";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import { BASE_URL } from "@/constants/api";
import { Link } from "react-router-dom";
import RouteNames from "@/constants/routeNames";
import scholarshipProgram, { ScholarshipProgramType } from "./data";
import ScholarshipProgramSkeleton from "./ScholarshipProgramSkeleton";
import * as Tabs from "@radix-ui/react-tabs";
import CreatedCard from "./CreatedCard";

const Activity = () => {
  const user = useSelector((state: any) => state.token.user);
  const role = user?.role; // Check the user role
  const funderId = user?.id;

  const [data, setData] =
    useState<ScholarshipProgramType[]>(scholarshipProgram);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // const fetchData = async () => {
  //   setLoading(true);
  //   try {
  //     if (role === "FUNDER") {
  //       const response = await axios.get(
  //         `${BASE_URL}/api/scholarship-programs/by-funder-id/${funderId}`
  //       );
  //       if (response.data.statusCode === 200) {
  //         setData(response.data.data);
  //       } else {
  //         setError("Failed to fetch scholarship programs");
  //       }
  //     } else if (role === "PROVIDER") {
  //       const response = await axios.get(
  //         `${BASE_URL}/api/services/by-provider-id/${funderId}`
  //       );
  //       if (response.data.statusCode === 200) {
  //         const activeServices = response.data.data.filter((service: any) => service.status === 'Active');
  //         setServices(activeServices);
  //       } else {
  //         setError("Failed to fetch services");
  //       }
  //     }
  //   } catch (err) {
  //     setError((err as Error).message);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${BASE_URL}/api/scholarship-programs/by-funder-id/${funderId}`,
      );
      if (response.data.statusCode === 200) {
        setData(response.data.data);
      } else {
        setError("Failed to fetch scholarship programs");
      }
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [role, funderId]);

  return (
    <Tabs.Content value="activity" className="pt-4 w-full">
      <div className="grid grid-cols-12">
        <div className="col-span-12 col-start-1 p-6">
          <div className="relative w-full flex items-center justify-between my-5">
            <div className="flex items-center"></div>
            {(role == "FUNDER" || role == "Funder") && (
              <Link
                to={RouteNames.FORM_CREATE_SCHOLARSHIP_PROGRAM}
                // onClick={() => setIsScholarshipModalOpen(true)}
                className="flex justify-start items-center hover:bg-blue-400 hover:text-white transition-all duration-200 gap-4 px-4 py-2 bg-white rounded-lg active:scale-95"
              >
                <IoIosAddCircleOutline className="text-3xl text-blue-500" />
                <p className="text-xl text-blue-600">Add Scholarship Program</p>
              </Link>
            )}
          </div>

          <menu className="mt-4 grid md:grid-cols-2 grid-cols-1 gap-12 md:px-16 px-2 bg-white rounded-lg">
            {loading ? (
              <ScholarshipProgramSkeleton />
            ) : error ? (
              <p className="text-center text-[2rem] font-semibold md:col-span-3 lg:col-span-4">
                Error loading scholarship programs
              </p>
            ) : data.length === 0 ? (
              <p className="text-center text-[2rem] font-semibold md:col-span-3 lg:col-span-4">
                No scholarship programs found
              </p>
            ) : (
              data.map((item: any) => (
                <li key={item.id}>
                  <CreatedCard {...item} />
                </li>
              ))
            )}
          </menu>
        </div>
      </div>
    </Tabs.Content>
  );
};

export default Activity;
