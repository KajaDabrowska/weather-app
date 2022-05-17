import { useEffect, useState } from "react";

import TabListBox from "../tab-list-box/tab-list-box.component";

import "./tablist.styles.scss";

const TabList = ({ weatherArray, timeZone }) => {
  const [leftIsScrollable, setLeftIsScrollable] = useState(false);
  const [rightIsScrollable, setRightIsScrollable] = useState(true);

  const HOUR_BOXES_NUMBER = 17;
  const shorterWeatherArray = weatherArray.slice(0, HOUR_BOXES_NUMBER);

  const [carouselIndex, setCarouselIndex] = useState(0);
  const carouselLenght = 5;

  const styles = { transform: `translateX(${carouselIndex * -68}%)` };
  // console.log("carouselIndex ", carouselIndex);
  // console.log("styles ", styles);

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
        <button
          className="btn active"
          role="tab"
          aria-controls="hourly-tab"
          aria-selected={true}
          // @ts-ignore
          tabIndex="0"
        >
          Hourly
        </button>
        <button
          className="btn"
          role="tab"
          aria-controls="daily-tab"
          aria-selected={false}
          // @ts-ignore
          tabIndex="-1"
        >
          Daily &#62;
        </button>
      </div>

      <div className="tab-panel" id="hourly-tab" role="tabpanel">
        {/* BOXES  */}
        <div className={`tab-trail`} style={styles}>
          {shorterWeatherArray.map((box, id) => (
            <TabListBox box={box} key={id} id={id} timeZone={timeZone} />
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
        </button>
        <button
          onClick={scrollHanlderRight}
          className={`tab-panel__scroll tab-panel__scroll--right glass ${
            rightIsScrollable ? "active" : ""
          }`}
        >
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
