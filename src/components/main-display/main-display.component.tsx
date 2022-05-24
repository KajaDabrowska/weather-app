import Image from "../image/image.component";

import "./main-display.styles.scss";

import dropImage from "../../images/image-drop.svg";
import windImage from "../../images/image-wind.svg";
import cloudImage from "../../images/image-cloud.svg";

export type NowWeather = {
  nowTemp: number;
  nowDesc: string;
  nowIcon: string;

  nowHumid: number;
  nowWind: number;
  nowClouds: number;
};

type MainDisplayProps = {
  nowWeather: NowWeather;
};

const MainDisplay = ({ nowWeather }: MainDisplayProps) => {
  const { nowTemp, nowDesc, nowIcon, nowHumid, nowWind, nowClouds } =
    nowWeather;

  const capitalizeFirstLetter = (string: string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  };

  return (
    <div className="main--container glass">
      <div className="big--container ">
        <div className="tempDesc">
          <p className="temp shadow">
            {Math.trunc(nowTemp)}
            <sup className="celcius">
              <span className="celcius__degree">°</span>
              <span className="celcius__c">c</span>
            </sup>
          </p>

          <p className="desc">{capitalizeFirstLetter(nowDesc)}</p>
        </div>

        <Image imageCode={nowIcon} size={"big"} />
      </div>

      <div className="small--container">
        <div className="details">
          <img src={windImage} alt="" className="image shadow" />

          <p>{Math.trunc(nowWind)} km/h</p>
        </div>

        <div className="details details__humid">
          <img src={dropImage} alt="" className="image shadow" />
          <p>{nowHumid}%</p>
        </div>

        <div className="details">
          <img src={cloudImage} alt="" className="image shadow" />
          <p>{nowClouds}%</p>
        </div>
      </div>
    </div>
  );
};

export default MainDisplay;
