import { Skeleton } from '@/components/ui/skeleton';

const ServiceSkeleton = ({ length: number = 4 }) => (
  <>
    {Array.from({ length: number }).map((_, index) => (
      <li key={index}>
        <Skeleton className="h-[22rem] w-[18rem] bg-gray-300 rounded-3xl" />
      </li>
    ))}
  </>
);

export default ServiceSkeleton;
