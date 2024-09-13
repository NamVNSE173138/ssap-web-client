import Background from "./components/Background";
import ImageCarousel from "./components/Carousel";
import attributes from "./data";
import Attribute from "./components/Attribute";

const Home = () => {
  return (
    <>
      <div
        className="max-h-full max-w-full mt-[2px]"
        style={{ backgroundColor: "#BBD4EA" }}
      >
        {/** LANDING PAGE */}
        <section className="flex justify-around flex-row mx-32">
          <section className="p-14">
            <p className="w-[65%] text-3xl text-center text-white font-semibold drop-shadow-lg my-10">
              THE FUTURE BELONGS TO THOSE WHO BELIEVE IN THE BEAUTY OF THEIR
              DREAMS
            </p>
            <p className="w-[65%] text-2xl text-center font-semibold drop-shadow-lg">
              Create Your Own Tomorrow
            </p>
            <p className="w-[65%] text-lg text-center font-semibold drop-shadow-lg">
              Discover thousands of Master's degrees worldwide!
            </p>
            <div className="flex items-center pt-10">
              <input className="h-14" type="text" placeholder="What to study" />
              <input
                className="h-14"
                type="text"
                placeholder="Where to study"
              />
              <button
                className="h-14 w-[20%] text-white"
                style={{ backgroundColor: "#5559C7" }}
              >
                Find scholarship
              </button>
            </div>
          </section>
          <section className="w-[30%] h-[30%] mt-1">
            <ImageCarousel />
          </section>
        </section>
      </div>

      {/** HOW TO APPLY */}
      <div className="">
        <section className="relative ">
          <div className="absolute ">
            <ul className=" grid grid-cols-4 gap-20 px-12 py-10 text-center">
              {attributes.map((attribute, idx) => (
                <Attribute
                  key={attribute.title}
                  icon={attribute.icon}
                  title={attribute.title}
                  description={attribute.description}
                  index={idx}
                />
              ))}
            </ul>
          </div>
          <Background />
        </section>
      </div>
    </>
  );
};

export default Home;
