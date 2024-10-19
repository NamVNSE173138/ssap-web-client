import ScholarshipProgramImage from '../../../assets/ScholarshipProgram.jpg';

const ScholarshipProgramBackground = () => {
    return (
        <section>
            <img src={ScholarshipProgramImage} alt="bg_footer" className="h-[200px] lg:h-[500px] object-center w-full " />
        </section>
    );
};

export default ScholarshipProgramBackground;