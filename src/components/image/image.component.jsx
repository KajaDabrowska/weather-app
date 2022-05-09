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

const Image = (imageCode) => {
  if (!imageCode) return;

  const images = {
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

  const image = images[Object.values(imageCode)];

  return <img src={image} alt="" className="image--main shadow--b" />;
};

export default Image;
