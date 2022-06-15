import { useEffect, useState } from "react";

import HourlyBox from "../hourly-box/hourly-box.component";
import DailyBox from "../daily-box/daily-box.component";

import "./tablist.styles.scss";

import { WeatherOneHour } from "../hourly-box/hourly-box.component";
import { WeatherOneDay } from "../daily-box/daily-box.component";

type TabListProps = {
  hourlyWeather: WeatherOneHour[];
  dailyWeather: WeatherOneDay[];
};

const TabList = ({ hourlyWeather, dailyWeather }: TabListProps) => {
  const [leftIsScrollable, setLeftIsScrollable] = useState(false);
  const [rightIsScrollable, setRightIsScrollable] = useState(true);

  const [dailyTabActive, setDailyTabActive] = useState(false);

  const HOUR_BOXES_NUMBER = 17;
  const shorterWeatherArray = hourlyWeather.slice(0, HOUR_BOXES_NUMBER);

  const [carouselIndex, setCarouselIndex] = useState(0);
  const carouselLenght = 5;

  const { width: windowWidth } = useWindowSize();

  const [widthForMediaHourly, setWidthForMediaHourly] = useState(57);
  const [widthForMediaDaily, setWidthForMediaDaily] = useState(44);

  const isInMediaQuerry = windowWidth < 450;

  useEffect(() => {
    if (windowWidth > 390) {
      setWidthForMediaHourly(60 - windowWidth / 30);
      setWidthForMediaDaily(45 - windowWidth / 30);
    } else if (windowWidth > 360 && windowWidth < 390) {
      setWidthForMediaHourly(67 - windowWidth / 30);
      setWidthForMediaDaily(52 - windowWidth / 30);
    } else if (windowWidth > 320 && windowWidth < 360) {
      setWidthForMediaHourly(78 - windowWidth / 30);
      setWidthForMediaDaily(60 - windowWidth / 30);
    } else if (windowWidth < 320 && windowWidth > 290) {
      setWidthForMediaHourly(85 - windowWidth / 30);
      setWidthForMediaDaily(68 - windowWidth / 30);
    } else if (windowWidth < 290) {
      setWidthForMediaHourly(89 - windowWidth / 30);
      setWidthForMediaDaily(72 - windowWidth / 30);
    }
  }, [windowWidth]);

  const translateValueForHourly = isInMediaQuerry ? widthForMediaHourly : 57;

  const translateValueForDaily = isInMediaQuerry ? widthForMediaDaily : 44;
  const translateValue = dailyTabActive
    ? translateValueForDaily
    : translateValueForHourly;

  const styles = {
    transform: `translateX(-${carouselIndex * translateValue}%)`,
  };
  // console.log("styles", styles);
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
    setCarouselIndex(0);
    setDailyTabActive(true);
  };
  const changePanelToHourly = () => {
    setCarouselIndex(0);
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
          className={`btn btn-clear-styles ${!dailyTabActive ? "active" : ""}`}
          role="tab"
          aria-controls="hourly-tab"
          aria-selected={!dailyTabActive}
          // tabIndex={0}
        >
          {dailyTabActive ? `<` : ""} Hourly
        </button>
        <button
          onClick={changePanelToDaily}
          className={`btn btn-clear-styles ${dailyTabActive ? "active" : ""}`}
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
                <DailyBox box={box} key={id} id={id} />
              ))
            : shorterWeatherArray.map((box, id) => (
                <HourlyBox box={box} key={id} id={id} />
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

function useWindowSize() {
  // Initialize state with undefined width/height so server and client renders match
  // Learn more here: https://joshwcomeau.com/react/the-perils-of-rehydration/
  const [windowSize, setWindowSize] = useState({
    width: 0,
    height: 0,
  });
  useEffect(() => {
    // Handler to call on window resize
    function handleResize() {
      // Set window width/height to state
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    }
    // Add event listener
    window.addEventListener("resize", handleResize);
    // Call handler right away so state gets updated with initial window size
    handleResize();
    // Remove event listener on cleanup
    return () => window.removeEventListener("resize", handleResize);
  }, []); // Empty array ensures that effect is only run on mount
  return windowSize;
}
