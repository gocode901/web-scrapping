"use client";

import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Carousel } from "react-responsive-carousel";
import Image from "next/image";
const Heroimages = [
  { imgurl: "/assets/images/hero-1.svg", alt: "watch" },
  { imgurl: "/assets/images/hero-2.svg", alt: "bag" },
  { imgurl: "/assets/images/hero-3.svg", alt: "lamp" },
  { imgurl: "/assets/images/hero-4.svg", alt: "air fryer" },
  { imgurl: "/assets/images/hero-5.svg", alt: "chair" },
];
const HeroCarousel = () => {
  return (
    <div className="hero-carousel">
      <Carousel
        showArrows={false}
        showThumbs={false}
        showStatus={false}
        // autoPlay
        // infiniteLoop
        interval={2000}
      >
        {Heroimages.map((image) => (
          <Image
            src={image.imgurl}
            key={image.alt}
            alt={image.alt}
            height={480}
            width={480}
            className="object-contain"
          />
        ))}
      </Carousel>
      <Image
        src="/assets/icons/hand-drawn-arrow.svg"
        alt="arrow"
        height={175}
        width={175}
        className="max-xl:hidden absolute -left-[15%] bottom-0 z-0"
      ></Image>
    </div>
  );
};
export default HeroCarousel;
