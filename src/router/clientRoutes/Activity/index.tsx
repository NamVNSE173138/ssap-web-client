import { Sidebar } from "@/components/AccountInfo";
import CreateScholarshipModal from "./CreateScholarshipModal";
import { IoIosAddCircleOutline } from "react-icons/io";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import ScholarshipProgramSkeleton from "../ScholarshipProgram/ScholarshipProgramSkeleton";
import { CreatedCard } from "@/components/CreatedScholarshipProgram";
import axios from "axios";
import scholarshipProgram, {
  ScholarshipProgramType,
} from "../ScholarshipProgram/data";
import { BASE_URL } from "@/constants/api";
import AddServiceModal from "./AddServiceModal";
import ServiceCard from "@/components/Services/ServiceCard";

const Activity = () => {
  const user = useSelector((state: any) => state.token.user);
  const role = user?.role; // Check the user role
  const funderId = user?.id;

  const [isScholarshipModalOpen, setIsScholarshipModalOpen] = useState(false);
  const [isServiceModalOpen, setIsServiceModalOpen] = useState(false);
  const [data, setData] = useState<ScholarshipProgramType[]>(scholarshipProgram);
  const [services, setServices] = useState<any[]>([]); 
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      if (role === "FUNDER") {
        const response = await axios.get(
          `${BASE_URL}/api/scholarship-programs/by-funder-id/${funderId}`
        );
        if (response.data.statusCode === 200) {
          setData(response.data.data);
        } else {
          setError("Failed to fetch scholarship programs");
        }
      } else if (role === "PROVIDER") {
        const response = await axios.get(
          `${BASE_URL}/api/services/by-provider-id/${funderId}`
        );
        if (response.data.statusCode === 200) {
          setServices(response.data.data); 
        } else {
          setError("Failed to fetch services");
        }
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
    <div className="grid grid-cols-12">
      <Sidebar className="col-start-1 col-end-3" />
      <div className="col-start-3 col-end-13 flex flex-col justify-start gap-1 p-5 ">
        <div className="relative w-full flex items-center justify-between p-5 ">
          <div className="flex items-center"></div>
          {role === "FUNDER" && (
            <button
              onClick={() => setIsScholarshipModalOpen(true)}
              className="flex justify-start items-center hover:bg-blue-400 hover:text-white transition-all duration-200 gap-4 px-4 py-2 bg-white rounded-lg active:scale-95"
            >
              <IoIosAddCircleOutline className="text-3xl text-blue-500" />
              <p className="text-xl text-blue-600">Add Scholarship Program</p>
            </button>
          )}
          {role === "PROVIDER" && (
            <button
              onClick={() => setIsServiceModalOpen(true)}
              className="flex justify-start items-center hover:bg-blue-400 hover:text-white transition-all duration-200 gap-4 px-4 py-2 bg-white rounded-lg active:scale-95"
            >
              <IoIosAddCircleOutline className="text-3xl text-blue-500" />
              <p className="text-xl text-blue-600">Add Service</p>
            </button>
          )}
        </div>
        <div className="h-[1px] bg-gray-300"></div>
        <menu className="mt-4 grid md:grid-cols-2 grid-cols-1 gap-12 md:px-16 px-2">
          {loading ? (
            <ScholarshipProgramSkeleton />
          ) : error ? (
            <p className="text-center text-[2rem] font-semibold md:col-span-3 lg:col-span-4">
              {"Error loading " + (role === "FUNDER" ? "scholarship programs." : "services.")}
            </p>
          ) : (role === "FUNDER" ? data.length : services.length) === 0 ? (
            <p className="text-center text-[2rem] font-semibold md:col-span-3 lg:col-span-4">
              {"No " + (role === "FUNDER" ? "scholarship programs found." : "services found.")}
            </p>
          ) : (
            (role === "FUNDER" ? data.map((item: any) => (
              <li key={item.id}>
                <CreatedCard {...item} />
              </li>
            )): services.map((item: any) => (
              <li key={item.id}>
                <ServiceCard {...item} />
              </li>))
            )
          )}
        </menu>

        <CreateScholarshipModal
          isOpen={isScholarshipModalOpen}
          setIsOpen={setIsScholarshipModalOpen}
        />
        <AddServiceModal
          isOpen={isServiceModalOpen}
          setIsOpen={setIsServiceModalOpen}
          fetchServices={fetchData}
        />
      </div>
    </div>
  );
};

export default Activity;
