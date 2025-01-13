import { useLocation } from "react-router-dom";
import ScholarshipProgramImage from "../../../assets/banner.png";
import ServicesImage from "../../../assets/awrapper.webp";

const ScholarshipProgramBackground = () => {
  const location = useLocation();
  return (
    <section>
      <img
        src={
          location.pathname === "/services"
            ? ServicesImage
            : ScholarshipProgramImage
        }
        alt="bg_footer"
        className="h-[300px] lg:h-[55vh] object-cover w-full"
      />
    </section>
  );
};

export default ScholarshipProgramBackground;
