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

const Activity = () => {
  const user = useSelector((state: any) => state.token.user);
  const isApplicant = user?.role;
  console.log("ROLE", user?.role);
  const funder = useSelector((state: any) => state.token.user);
  const funderId = funder?.id;
  console.log("FUNDERID", funder?.id);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [data, setData] =
    useState<ScholarshipProgramType[]>(scholarshipProgram);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `${BASE_URL}/api/scholarship-programs/by-funder-id/${funderId}`
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
    <div className="grid grid-cols-12">
      <Sidebar className="col-start-1 col-end-3" />
      <div className="col-start-3 col-end-13 flex flex-col justify-start gap-1 p-5 ">
        <div className="relative w-full flex items-center justify-between p-5 ">
          <div className="flex items-center"></div>
          {isApplicant == "FUNDER" && (
            <button
              onClick={() => setIsModalOpen(true)}
              className="flex justify-start items-center hover:bg-blue-400 hover:text-white transition-all duration-200 gap-4 px-4 py-2 bg-white rounded-lg active:scale-95"
            >
              <IoIosAddCircleOutline className="text-3xl text-blue-500" />
              <p className="text-xl text-blue-600">Add Scholarship Program</p>
            </button>
          )}
        </div>
        <div className="h-[1px] bg-gray-300"></div>
        <menu className="grid md:grid-cols-2 grid-cols-1 gap-12 md:px-16 px-2">
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
                <CreatedCard {...service} />
              </li>
            ))
          )}
        </menu>

        <CreateScholarshipModal
          isOpen={isModalOpen}
          setIsOpen={setIsModalOpen}
        />
      </div>
    </div>
  );
};

export default Activity;
