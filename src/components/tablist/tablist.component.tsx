import { useEffect, useState } from "react";

import HourlyBox from "../hourly-box/hourly-box.component";
import DailyBox from "../daily-box/daily-box.component";

import "./tablist.styles.scss";

import { WeatherOneHour } from "../hourly-box/hourly-box.component";
import { WeatherOneDay } from "../../App";

type TabListProps = {
  hourlyWeather: WeatherOneHour[];
  dailyWeather: WeatherOneDay[];
  timeZone: string;
};

const TabList = ({ hourlyWeather, dailyWeather, timeZone }: TabListProps) => {
  const [leftIsScrollable, setLeftIsScrollable] = useState(false);
  const [rightIsScrollable, setRightIsScrollable] = useState(true);

  const [dailyTabActive, setDailyTabActive] = useState(false);

  const HOUR_BOXES_NUMBER = 17;
  const shorterWeatherArray = hourlyWeather.slice(0, HOUR_BOXES_NUMBER);

  const [carouselIndex, setCarouselIndex] = useState(0);
  const carouselLenght = 5;

  const translateValueForHourly = -68;
  const translateValueForDaily = -46;
  const translateValue = dailyTabActive
    ? translateValueForDaily
    : translateValueForHourly;

  const styles = {
    transform: `translateX(${carouselIndex * translateValue}%)`,
  };

  const scrollHanlderLeft = () => {
    if (carouselIndex === 0) {
      // do nothing
      // setCarouselIndex(carouselLenght);
    } else if (carouselIndex > 0) {
      setCarouselIndex(carouselIndex - 1);
    }
  };
  const scrollHanlderRight = () => {
    if (carouselIndex === carouselLenght) {
      // do nothing
      // setCarouselIndex(0);
    } else if (carouselIndex >= 0) {
      setCarouselIndex(carouselIndex + 1);
    }
  };

  const changePanelToDaily = () => {
    setDailyTabActive(true);
  };
  const changePanelToHourly = () => {
    setDailyTabActive(false);
  };

  useEffect(() => {
    if (carouselIndex > 0) {
      setLeftIsScrollable(true);
    } else {
      setLeftIsScrollable(false);
    }

    if (carouselIndex === carouselLenght) {
      setRightIsScrollable(false);
    } else {
      setRightIsScrollable(true);
    }
  }, [carouselIndex]);

  return (
    <div className="tablist--container">
      <div
        className="tab-buttons"
        role="tablist"
        aria-label="Weather sorted by time list"
      >
        {/* HOUR/DAILY BUTTONS */}
        <button
          onClick={changePanelToHourly}
          className={`btn ${!dailyTabActive ? "active" : ""}`}
          role="tab"
          aria-controls="hourly-tab"
          aria-selected={!dailyTabActive}
          // tabIndex={0}
        >
          {dailyTabActive ? `<` : ""} Hourly
        </button>
        <button
          onClick={changePanelToDaily}
          className={`btn ${dailyTabActive ? "active" : ""}`}
          role="tab"
          aria-controls="daily-tab"
          aria-selected={dailyTabActive}
          // tabIndex={-1}
        >
          Daily {!dailyTabActive ? `>` : ""}
        </button>
      </div>

      {/* --- TAB PANEL --- */}
      <div className="tab-panel" id="hourly-tab" role="tabpanel">
        {/* BOXES  */}
        <div className={`tab-trail`} style={styles}>
          {dailyTabActive
            ? dailyWeather.map((box, id) => (
                <DailyBox box={box} key={id} id={id} timeZone={timeZone} />
              ))
            : shorterWeatherArray.map((box, id) => (
                <HourlyBox box={box} key={id} id={id} timeZone={timeZone} />
              ))}
        </div>

        {/* --- BUTTONS --- */}
        <button
          onClick={scrollHanlderLeft}
          className={`tab-panel__scroll tab-panel__scroll--left glass ${
            leftIsScrollable ? "active" : ""
          }`}
        >
          &#60;
          <div className="sr-only">Scroll weather boxes left</div>
        </button>
        <button
          onClick={scrollHanlderRight}
          className={`tab-panel__scroll tab-panel__scroll--right glass ${
            rightIsScrollable ? "active" : ""
          }`}
        >
          <div className="sr-only">Scroll weather boxes right</div>
          &#62;
        </button>
      </div>
    </div>
  );
};

export default TabList;

// <div
//   key={box}
//   className={`tab-panel__box ${box === selectedBox ? "active" : ""}`}
//   onClick={() => onBoxClickHandler(box)}
// >
//   <div className="time">09:00</div>
//   <div className="img">image</div>
//   <div className="temp">
//     2°<sup>C</sup>
//   </div>
// </div>
