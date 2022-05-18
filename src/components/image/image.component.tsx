import { useEffect, useState } from "react";

import sunImage from "../../images/image-sun.svg";
import moonImage from "../../images/image-moon.svg";
import cloudImage from "../../images/image-cloud.svg";
import cloudsImage from "../../images/image-clouds.svg";
import partCloudDayImage from "../../images/image-part-cloud-day.svg";
import partCloudNightImage from "../../images/image-part-cloud-night.svg";
import rainImage from "../../images/image-rain.svg";
import lightningImage from "../../images/image-lightning.svg";
import snowImage from "../../images/image-snow.svg";
import mistyImage from "../../images/image-misty.svg";

import "./image.styles.scss";

type ImageComponentTypes = {
  imageCode: string;
  size: string;
};

type ImagesObject = {
  [key: string]: string;
};

const Image = ({ imageCode, size }: ImageComponentTypes) => {
  const [sizeClass, setSizeClass] = useState("image--big");

  useEffect(() => {
    if (size === "big") {
      setSizeClass("image--big");
    } else if (size === "medium") {
      setSizeClass("image--medium");
    } else if (size === "small") {
      setSizeClass("image--small");
    }
  }, []);

  if (!imageCode) return null;

  const images: ImagesObject = {
    "01d": sunImage,
    "01n": moonImage,
    "02d": partCloudDayImage,
    "02n": partCloudNightImage,
    "03d": cloudImage,
    "03n": cloudImage,
    "04d": cloudsImage,
    "04n": cloudsImage,
    "09d": rainImage,
    "09n": rainImage,
    "10d": rainImage,
    "10n": rainImage,
    "11d": lightningImage,
    "11n": lightningImage,
    "13d": snowImage,
    "13n": snowImage,
    "50d": mistyImage,
    "50n": mistyImage,
  };

  const image = images[imageCode];

  // const sizeClass = `${size === "big" ? "image--big" : "image--small"}`;

  return <img src={image} alt="" className={`shadow--b ${sizeClass}`} />;
};

export default Image;
