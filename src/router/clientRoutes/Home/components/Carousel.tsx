import React from 'react';
import LandingImage from "../../../../assets/bg.webp"


const BackgroundImage: React.FC = () => (
  
  <section className="bg-cover bg-center md:bg-top md:bg-fixed w-full h-[100vh] sm:h-[70vh] md:h-[80vh] lg:h-[100vh]"
  style={{ backgroundImage: `url(${LandingImage})` }}>
  </section>
);

export default BackgroundImage;



