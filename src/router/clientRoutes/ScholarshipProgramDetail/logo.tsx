// import SchoolImage from "../../../assets/FPT_logo.jpg"
// import { ScholarshipProgramType } from "../ScholarshipProgram/data";
const SchoolLogo = ({ imageUrl }: { imageUrl: string }) => {
  return (
    <section>
            <img src={imageUrl} alt="bg_footer" className="h-[120px] rounded-full object-cover w-[120px] " />
        </section>
  )
}

export default SchoolLogo;