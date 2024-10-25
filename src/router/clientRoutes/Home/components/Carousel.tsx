import React from 'react';
import { Carousel } from 'antd';
import LandingImage from "../../../../assets/bg.webp"
import CarouselImage1 from "../../../../assets/landing1.jpg"
import CarouselImage2 from "../../../../assets/landing2.jpg"
import CarouselImage3 from "../../../../assets/landing3.jpg"

const contentStyle: React.CSSProperties = {
  height: '580px',
  lineHeight: '160px',
  textAlign: 'center',
  padding: '10px',
  // position: 'relative'
};

const BackgroundImage: React.FC = () => (
  // <Carousel dots={false} autoplay>
  //   <div>
  //     <img style={contentStyle} src={CarouselImage1}/>
  //   </div>
  //   <div>
  //     <img style={contentStyle} src={CarouselImage2}/>
  //   </div>
  //   <div>
  //     <img style={contentStyle} src={CarouselImage3}/>
  //   </div>
  // </Carousel>
  <section className="bg-cover bg-fixed bg-top w-full h-[100vh]"
  style={{ backgroundImage: `url(${LandingImage})` }}>
    {/* <img src={LandingImage} className=''/> */}
  </section>
);

export default BackgroundImage;



