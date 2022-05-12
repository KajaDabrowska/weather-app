import { useState } from "react";

import TabListBox from "../tab-list-box/tab-list-box.component";

import "./tablist.styles.scss";

const TabList = ({ weatherArray }) => {
  const [scrollRight, setScrollRight] = useState(false);

  const boxesNumber2 = 19;
  const shorterWeatherArray = weatherArray.slice(0, boxesNumber2);

  const scrollHanlderLeft = () => {
    if (scrollRight) setScrollRight(!scrollRight);
  };
  const scrollHanlderRight = () => {
    setScrollRight(!scrollRight);
  };

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
        <div
          //${scrollLeft ? "scroll--left" : ""}
          className={`tab-trail  ${scrollRight ? "scroll--right" : ""}`}
        >
          {/* map not forEach lol  */}
          {shorterWeatherArray.map((box, id) => (
            <TabListBox box={box} key={id} id={id} />
          ))}
        </div>
        <button
          onClick={scrollHanlderLeft}
          className="tab-panel__scroll tab-panel__scroll--left glass"
        >
          &#60;
        </button>
        <button
          onClick={scrollHanlderRight}
          className="tab-panel__scroll tab-panel__scroll--right glass"
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
