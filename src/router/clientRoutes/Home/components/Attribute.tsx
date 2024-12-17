import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { IconDefinition } from "@fortawesome/fontawesome-svg-core";
import { motion } from "framer-motion";
import { useState } from "react";


export type AttributeProps = {
  icon: IconDefinition;
  title: string;
  description: string;
  index?: number;
};

const Attribute = ({ icon, title, description, index = 0 }: AttributeProps) => {
 
  const [hasAnimated, setHasAnimated] = useState(false);
  
  const initialLiPosition = { translateX: -100, opacity: 0 }; 
  
  return (
    <motion.li
      className="max-w-[80%] md:max-w-[90%] lg:max-w-full flex flex-col items-center gap-2 lg:gap-4"
      initial={initialLiPosition}
      animate={hasAnimated ? { translateX: 0, opacity: 1 } : initialLiPosition}
      transition={{ duration: 0.4, delay: index * 0.2 }} 
      onViewportEnter={() => setHasAnimated(true)} 
    >
      <div className="flex justify-center items-center w-18 md:w-20 lg:w-24 h-18 md:h-20 lg:h-24 rounded-full bg-white drop-shadow-lg mt-10 mb-5">
        <FontAwesomeIcon
          icon={icon}
          className="lg:text-4xl text-xl"
          style={{ color: "#1eb2a6" }}
        />
      </div>

      
      <motion.div
        initial={{ translateY: "-100%", opacity: 0 }}
        animate={hasAnimated ? { translateY: 0, opacity: 1 } : { translateY: "-100%", opacity: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }} 
      >
        <p className="text-[20px] md:text-[24px] lg:text-[28px] font-semibold text-center" style={{ color: "#000" }}>
          {title}
        </p>
        <div className="md:px-3 lg:px-5 mt-2 lg:mt-5">
          <small className=" text-[12px] md:text-[16px] lg:text-[18px] text-center">{description}</small>
        </div>
      </motion.div>
    </motion.li>
  );
};

export default Attribute;





