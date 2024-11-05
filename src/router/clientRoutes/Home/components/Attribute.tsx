import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { IconDefinition } from "@fortawesome/fontawesome-svg-core";
import { motion } from "framer-motion";
import { useState } from "react";
import useMediaQuery from "@/hooks/useMediaQuery";

export type AttributeProps = {
  icon: IconDefinition;
  title: string;
  description: string;
  index?: number;
};

const Attribute = ({ icon, title, description, index = 0 }: AttributeProps) => {
  const isAboveMediumScreens = useMediaQuery("(min-width: 1060px)");
  const [hasAnimated, setHasAnimated] = useState(false);
  const [shouldTriggerNextAnimation, setShouldTriggerNextAnimation] = useState(false);
  const initialLiPosition = { translateX: -100, opacity: 0 }; 
  const [divPosition, setDivPosition] = useState({
    translateY: "-100%",
    opacity: 0,
  });
  return (
    <motion.li
      className="max-w-full flex flex-col items-center gap-4"
      initial={initialLiPosition}
      animate={hasAnimated ? { translateX: 0, opacity: 1 } : initialLiPosition}
      transition={{ duration: 0.4, delay: index * 0.2 }} 
      onViewportEnter={() => setHasAnimated(true)} 
    >
      <div className="flex justify-center items-center w-24 h-24 rounded-full bg-white drop-shadow-lg mt-10 mb-5">
        <FontAwesomeIcon
          icon={icon}
          className="lg:text-4xl text-xl"
          style={{ color: "#5559C7" }}
        />
      </div>

      
      <motion.div
        initial={{ translateY: "-100%", opacity: 0 }}
        animate={hasAnimated ? { translateY: 0, opacity: 1 } : { translateY: "-100%", opacity: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }} 
      >
        <p className="text-[28px] font-semibold text-center" style={{ color: "#5559C7" }}>
          {title}
        </p>
        <div className="px-5 mt-5">
          <small className="text-[18px] text-center">{description}</small>
        </div>
      </motion.div>
    </motion.li>
  );
};

export default Attribute;





