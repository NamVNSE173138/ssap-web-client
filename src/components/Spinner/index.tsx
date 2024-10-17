import { cn } from '../../lib/utils';

interface SpinnerProps {
    size?: 'large' | 'medium' | 'small' | 'xsmall';
    className?: string;
    color?: string;
}

const Spinner = ({size = 'medium', className, color = 'border-blue-300/80'}: SpinnerProps) => {
    let sizeClasses;
    switch (size) {
        case 'large':
            sizeClasses = 'h-16 w-16 border-[12px]';
            break;
        case 'medium':
            sizeClasses = 'h-12 w-12 border-[8px]';
            break;
        case 'small':
            sizeClasses = 'h-8 w-8 border-[4px]';
            break;
        case 'xsmall':
            sizeClasses = 'h-4 w-4 border-[2px]';
            break;
        default:
            sizeClasses = 'h-12 w-12 border-[8px]';
            break;
    }
    return (
        <div className="w-full h-full flex justify-center items-center">
            <div className={cn('rounded-full animate-spin', sizeClasses, className, color, 'border-t-gray-300/80')} role="status" />
        </div>
    );
};

export default Spinner;
