import {
  ScholarshipProgramType,
} from "../../router/clientRoutes/ScholarshipProgram/data";
import { Separator } from "../ui/separator";
import { Link } from "react-router-dom";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { IoLocation } from "react-icons/io5";
import { GiGraduateCap } from "react-icons/gi";
import { FaCalendar, FaDollarSign } from "react-icons/fa";
import { RiMoneyDollarCircleFill } from "react-icons/ri";

const truncateString = (str: string, num: number) => {
  if (str.length <= num) {
    return str;
  }
  return str.slice(0, num) + "...";
};


const Card = (scholarshipProgram: ScholarshipProgramType) => {
  const truncatedDescription = truncateString(
    scholarshipProgram.description,
    30
  );

  return (
    <Link to={`/scholarship-program/${scholarshipProgram.id}`}>
      <div className="columns-1 flex flex-col justify-between gap-8 p-4 rounded-3xl shadow shadow-gray-400 cursor-pointer hover:bg-gray-200 hover:scale-105 hover:shadow-xl transition-all">

        <div className="flex flex-col justify-between gap-2">
          <p className="text-lg md:text-xl lg:text-xl mt-4 font-bold text-black">
            {scholarshipProgram?.name.length > 20
              ? scholarshipProgram?.name.substring(0, 25) + "..."
              : scholarshipProgram?.name}
          </p>

          <div className=" mb-5">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <p>{truncatedDescription}</p>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{scholarshipProgram?.description}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>


          <Separator orientation="horizontal" />
          <div className=" flex-row justify-between mt-5 ml-5">

            {scholarshipProgram.university && (
              <div className="flex items-center gap-2 mb-4">
                <IoLocation color="#1eb2a6" size={24} />
                <p className="text-black">
                  {scholarshipProgram.university.name.length > 30
                    ? scholarshipProgram.university.name.substring(0, 30) + "..."
                    : scholarshipProgram.university.name}
                </p>
              </div>
            )}

            {scholarshipProgram.major && (
              <div className="flex justify-start items-center gap-2 mb-4">
                <GiGraduateCap color="#1eb2a6" size={24} />
                <p className="text-black">
                  {scholarshipProgram.major.name.length > 30
                    ? scholarshipProgram.major.name.substring(0, 30) + "..."
                    : scholarshipProgram.major.name}
                </p>

              </div>
            )}
            <div className="flex justify-start items-center gap-2 mb-4">
              <FaCalendar color="#1eb2a6" size={24} />
              <p className="text-black">
                {new Date(scholarshipProgram?.deadline).toLocaleDateString('en-US')}
              </p>

            </div>
            <div className="flex justify-start items-center gap-2 mb-4">
              <FaDollarSign color="#1eb2a6" size={24} />
              <p className="text-black">
                {scholarshipProgram?.scholarshipAmount}
              </p>
            </div>


          </div>

        </div>
      </div>
    </Link>
  );
};

export default Card;
