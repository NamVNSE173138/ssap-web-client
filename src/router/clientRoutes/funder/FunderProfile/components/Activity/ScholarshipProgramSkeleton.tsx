import { Skeleton } from '@/components/ui/skeleton';

const ScholarshipProgramSkeleton = ({ length: number = 4 }) => {
    return (
        <>
            {Array.from({ length: number }).map((_, index) => (
                <li key={index}>
                    <Skeleton className=" h-[22rem] w-[18rem] aspect-square bg-gray-300 rounded-3xl" />
                </li>
            ))}
        </>
    );
};

export default ScholarshipProgramSkeleton;
