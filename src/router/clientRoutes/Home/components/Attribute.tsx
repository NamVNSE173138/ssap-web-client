import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { IconDefinition } from "@fortawesome/fontawesome-svg-core";

export type AttributeProps = {
  icon: IconDefinition;
  title: string;
  description: string;
  index?: number;
};

const Attribute = ({ icon, title, description, index }: AttributeProps) => {
  return (
    <li className="max-w-full flex flex-col items-center gap-4">
      <div className="flex justify-center items-center w-24 h-24 rounded-full bg-white drop-shadow-lg mt-10 mb-5">
        <FontAwesomeIcon
          icon={icon}
          className="lg:text-4xl text-xl"
          style={{color: "#5559C7"}}
        />
      </div>
      {/* <div className="absolute left-1/2 top-full w-px h-20 bg-gray-300"></div> */}
      <div>
        <p className="text-[28px] font-semibold text-center" style={{color:"#5559C7"}}>
          {title}
        </p>
        <div className="px-5 mt-5">
          <small className="text-[18px] text-center">{description}</small>
        </div>
      </div>
    </li>
  );
};
export default Attribute;
