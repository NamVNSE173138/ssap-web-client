import BackgroundImage from '../../../assets/bg_footer.png';

const Background = () => {
    return (
        <section>
            <img src={BackgroundImage} alt="bg_footer" className="h-[200px] lg:h-[350px] object-center w-full " />
        </section>
    );
};

export default Background;
