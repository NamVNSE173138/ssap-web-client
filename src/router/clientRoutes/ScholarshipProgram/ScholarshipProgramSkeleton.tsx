import { Skeleton } from "@/components/ui/skeleton";

const ScholarshipProgramSkeleton = ({ length: number = 9 }) => {
  return (
    <>
      {Array.from({ length: number }).map((_, index) => (
        <li key={index}>
          <Skeleton className=" h-[28rem] w-[23rem] aspect-square bg-gray-300 rounded-3xl" />
        </li>
      ))}
    </>
  );
};

export default ScholarshipProgramSkeleton;
