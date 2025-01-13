import { Skeleton } from "@/components/ui/skeleton";

const ServiceSkeleton = ({ length = 6 }) => (
  <>
    {Array.from({ length }).map((_, index) => (
      <li key={index}>
        <Skeleton className="h-[400px] w-full sm:w-[29rem] bg-gray-300 rounded-3xl" />
      </li>
    ))}
  </>
);

export default ServiceSkeleton;
