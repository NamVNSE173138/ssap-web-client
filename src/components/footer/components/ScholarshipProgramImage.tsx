import ScholarshipProgramImage from '../../../assets/awrapper.webp';

const ScholarshipProgramBackground = () => {
    return (
        <section>
            <img src={ScholarshipProgramImage} alt="bg_footer" className="h-[200px] lg:h-[55vh] object-cover w-full " />
        </section>
    );
};

export default ScholarshipProgramBackground;