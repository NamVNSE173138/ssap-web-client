import FptLogo from "../../assets/FPT_logo.jpg";
import { ScholarshipProgramType } from "@/router/clientRoutes/ScholarshipProgram/data";
import { FaStar } from "react-icons/fa";

const CreatedCard = (sholarshipProgram: ScholarshipProgramType) => {
  
  return (
    <div className="flex flex-row items-center w-[80%] h-full gap-8 p-4 bg-blue-100/80 rounded-[2rem] shadow-lg mt-2 ">
      <div className="w-full h-[90%] grid md:grid-rows-2 grid-rows-1 ">
        <div className="flex flex-row h-[40%]">
          <div className="columns-1 w-[50%] h-[30%]">
            <img
              src={FptLogo}
              alt="service"
              className="md:w-[150px] rounded-[1rem] object-cover"
            />
          </div>
          <div className="">
            <p className="text-2xl font-semibold">{sholarshipProgram?.name}</p>
            <p>{sholarshipProgram?.description}</p>
          </div>
        </div>
        <div className="h-[1px] mt-[2.25rem] bg-gray-300"></div>
        <div className="flex flex-col justify-start columns-1">
          <div className="flex justify-start items-center gap-2 mb-4">
            <FaStar color="#FFB142" size={24} />
            <p>ABC</p>
          </div>
          <div className="flex justify-start items-center gap-2 mb-4">
            <FaStar color="#FFB142" size={24} />
            <p>ABC</p>{" "}
          </div>
          <div className="flex justify-start items-center gap-2 mb-4">
            <FaStar color="#FFB142" size={24} />
            <p>28 Oct 2025</p>
          </div>
          <div className="flex justify-start items-center gap-2 mb-4">
            <FaStar color="#FFB142" size={24} />
            <p>ABC</p>{" "}
          </div>
        </div>
      </div>
      {/* <Actions service={service} bookingHubConnection={bookingHubConnection} refetch={refetch}/> */}
    </div>
  );
};

export default CreatedCard;
