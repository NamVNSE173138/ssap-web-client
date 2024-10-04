import { motion } from 'framer-motion';
import './style.css';

const ScreenSpinner = () => {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, dur: 0.5 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[999] flex flex-col items-center justify-center gap-4 w-full h-full bg-white/50"
        >
            <div>
                <div className="w-24 aspect-square border-l-4 border-t-4 border-r-4 border-b-4 border-blue-400 border-t-transparent rounded-full animate-spin flex justify-center items-center">
                    <div className="w-16 aspect-square border-l-4 border-t-4 border-r-4 border-b-4 border-blue-200 border-b-transparent rounded-full animate-reverse-spin"></div>
                </div>
            </div>
            <span className="text-2xl font-semibold text-blue-600">Please wait a second...</span>
        </motion.div>
    );
};

export default ScreenSpinner;
