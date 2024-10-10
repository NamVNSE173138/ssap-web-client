import { ScholarshipProgramType } from "../../router/clientRoutes/ScholarshipProgram/data";
import { Separator } from "../ui/separator";
import { Link } from "react-router-dom";
// import formatCurrency from "../../lib/currency-formatter";
import { FaStar } from "react-icons/fa";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const truncateString = (str: string, num: number) => {
    if (str.length <= num) {
        return str;
    }
    return str.slice(0, num) + '...';
};

const Card = (sholarshipProgram: ScholarshipProgramType) => {
    const truncatedDescription = truncateString(sholarshipProgram.description, 40);
  return (
    <Link to={`/sholarship-program/${sholarshipProgram.id}`}>
      <div className="columns-1 flex flex-col justify-between gap-8 p-4 rounded-3xl shadow shadow-gray-400 cursor-pointer hover:bg-gray-200 hover:scale-105 hover:shadow-xl transition-all">
        {/* <img src={service.serviceImages} alt="service image" className='rounded-3xl' /> */}
        {/* {service.serviceImages.length > 0 && (
                    <div className='h-[210px] sm:h-[220px] md:h-[230px] lg:h-[250px] overflow-hidden rounded-3xl'>
                        <img src={service.serviceImages[0].imageUrl} alt="service image" className='w-full h-full object-cover' />
                    </div>
                )} */}
        <div className="flex flex-col justify-between gap-2">
          <p className='text-lg md:text-xl lg:text-xl mt-4 font-bold'>{sholarshipProgram?.name}</p>
          <div className=" mb-5">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger  asChild>
                <p>{truncatedDescription}</p>
              </TooltipTrigger>
              <TooltipContent>
                <p>{sholarshipProgram?.description}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          </div>
          
          {/* <p className="text-lg md:text-xl lg:text-sm">
            {sholarshipProgram.description}
          </p> */}
          <Separator orientation="horizontal" />
          <div className=" flex-row justify-between mt-5 ml-5">
            <div className="flex justify-start items-center gap-2 mb-4">
              <FaStar color="#FFB142" size={24} />
              <p>{sholarshipProgram?.providerId}</p>
            </div>
            <div className="flex justify-start items-center gap-2 mb-4">
              <FaStar color="#FFB142" size={24} />
              <p>{sholarshipProgram?.providerId}</p>
            </div>
            <div className="flex justify-start items-center gap-2 mb-4">
              <FaStar color="#FFB142" size={24} />
              <p>28 Oct 2025</p>
            </div>
            <div className="flex justify-start items-center gap-2 mb-4">
              <FaStar color="#FFB142" size={24} />
              <p>{sholarshipProgram?.providerId}</p>
            </div>
            
            {/* <div className='w-[1px] bg-gray-400'></div>
                        <p>{sholarshipProgram.numberOfRenewals} Đã đặt</p>
                        <div className='w-[1px] bg-gray-400'></div>
                        <p>{sholarshipProgram.numberOfScholarships} Đánh giá</p> */}
          </div>
          {/* <p className="text-2xl text-[#0049FF]">
            {formatCurrency(sholarshipProgram.scholarshipAmount, "VND")} VND
          </p> */}
        </div>
      </div>
    </Link>
  );
};

export default Card;
