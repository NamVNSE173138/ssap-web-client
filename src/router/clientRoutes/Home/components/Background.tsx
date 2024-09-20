import BackgroundImage from '../../../../assets/bg2.png';

const Background = () => {
    return (
        <section>
            <img src={BackgroundImage} alt="hero" className="h-[200px] lg:h-[450px] object-cover w-full " />
        </section>
    );
};

export default Background;
