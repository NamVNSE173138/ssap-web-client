import { ScholarshipProgramType } from "../../router/clientRoutes/ScholarshipProgram/data";
import { Separator } from "../ui/separator";
import { Link } from "react-router-dom";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { FaBook, FaSchool, FaGraduationCap, FaTrophy } from "react-icons/fa";
import ScholarshipBanner from "../../assets/scholarship_banner.png";

const Card = (scholarshipProgram: ScholarshipProgramType) => {
  return (
    <Link to={`/scholarship-program/${scholarshipProgram.id}`}>
      <div className="relative h-[450px] flex flex-col justify-between rounded-3xl shadow shadow-gray-400 cursor-pointer hover:bg-gray-100 hover:shadow-xl transition-all">
        <div
          className="absolute top-0 left-0 w-full text-m p-2 rounded-t-3xl pl-6 z-10 font-bold"
          style={{
            backgroundColor:
              scholarshipProgram.status === "Open"
                ? "#1eb2a6"
                : scholarshipProgram.status === "Reviewing"
                ? "orange"
                : "lightgray",
            color:
              scholarshipProgram.status === "Open"
                ? "white"
                : scholarshipProgram.status === "Reviewing"
                ? "black"
                : "black",
          }}
        >
          {scholarshipProgram.status}
        </div>

        <div
          className="h-[150px] bg-cover bg-center flex items-center justify-center text-white text-2xl font-bold rounded-t-3xl pt-10"
          style={{
            backgroundImage: `url(${ScholarshipBanner})`,
          }}
        >
          <div className="flex flex-col items-center">
            <span className="text-sm" style={{ lineHeight: "1.2em" }}>
              Award per winner
            </span>
            <span className="text-4xl" style={{ lineHeight: "1.2em" }}>
              ${scholarshipProgram.scholarshipAmount.toLocaleString()}
            </span>
          </div>
        </div>

        <div className="flex flex-col flex-grow p-4">
          <div>
            <p
              className="text-lg md:text-xl lg:text-xl mt-4 font-bold text-black"
              style={{ height: "60px", lineHeight: "1.2em" }}
            >
              {scholarshipProgram?.name}
            </p>
          </div>

          <div className="flex-grow mb-5" style={{ height: "40px" }}>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <p>
                    {scholarshipProgram.university.description.length > 80
                      ? scholarshipProgram.university.description.substring(
                          0,
                          80
                        ) + "..."
                      : scholarshipProgram.university.description}
                  </p>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{scholarshipProgram?.description}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>

          <div className="flex justify-around mt-2">
            <p className="text-gray-700 text-sm">
              Opens:{" "}
              <span className="font-semibold">
                {new Date(scholarshipProgram?.createdAt).toLocaleDateString(
                  "en-US"
                )}
              </span>
            </p>
            <p className="text-gray-700 text-sm text-right">
              Closes:{" "}
              <span className="font-semibold">
                {new Date(scholarshipProgram?.deadline).toLocaleDateString(
                  "en-US"
                )}
              </span>
            </p>
          </div>
        </div>

        <Separator className="my-2" />

        <div className="grid grid-cols-2 gap-4 p-4 ml-2 mb-2">
          {scholarshipProgram.university && (
            <div className="flex items-center gap-2 text-gray-700">
              <FaSchool color="#1eb2a6" size={24} />
              <p className="text-sm truncate">
                {scholarshipProgram.university.name.length > 20
                  ? scholarshipProgram.university.name.substring(0, 20) + "..."
                  : scholarshipProgram.university.name}
              </p>
            </div>
          )}

          {scholarshipProgram.major && (
            <div className="flex items-center gap-2 text-gray-700">
              <FaBook color="#1eb2a6" size={24} />
              <p className="text-sm truncate">
                {scholarshipProgram.major.name.length > 15
                  ? scholarshipProgram.major.name.substring(0, 15) + "..."
                  : scholarshipProgram.major.name}
              </p>
            </div>
          )}

          <div className="flex items-center gap-2 text-gray-700">
            <FaTrophy color="#1eb2a6" size={24} />
            <p className="text-sm truncate">
              {scholarshipProgram?.numberOfScholarships} scholarships
            </p>
          </div>

          <div className="flex items-center gap-2 text-gray-700">
            <FaGraduationCap color="#1eb2a6" size={24} />
            <p className="text-sm truncate">
              {scholarshipProgram.educationLevel}
            </p>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default Card;
