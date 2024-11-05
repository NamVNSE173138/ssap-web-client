import React from 'react';
import LandingImage from "../../../../assets/bg.webp"


const BackgroundImage: React.FC = () => (
  
  <section className="  bg-cover bg-fixed bg-top w-full h-[100vh]   "
  style={{ backgroundImage: `url(${LandingImage})` }}>
  </section>
);

export default BackgroundImage;



