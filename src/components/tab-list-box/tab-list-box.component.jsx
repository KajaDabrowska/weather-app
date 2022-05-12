import { useEffect, useState } from "react";

import Image from "../image/image.component";

import "./tab-list-box.styles.scss";

// , selectedBox, onBoxClickHandler
const TabListBox = ({ box, id }) => {
  const { temp } = box;
  const iconCode = box.weather[0].icon;

  const [currentHour, setCurrentHour] = useState(null);
  const [displayHour, setDisplayHour] = useState(null);

  // console.log()

  //TODO time
  const addZeroToHours = (number) => {
    if (number < 10) {
      number = "0" + number;
      return number;
    } else return number;
  };

  const addHourById = (number, id) => {
    if (number < 24) {
      const theNumber = number + id;

      if (theNumber < 24) {
        return theNumber;
      } else if (theNumber >= 24) {
        return id - 10;
      }
    } else return id - 10;
  };

  const getHour = () => {
    const now = new Date();

    const hour = addZeroToHours(now.getHours());
    const time = hour + ":00";
    //24 is 0 in js
    const hourById = addHourById(now.getHours(), id);
    const timeById = addZeroToHours(hourById) + ":00";
    // console.log("hourById: ", hourById);
    // console.log("timeById: ", timeById);

    setCurrentHour(time);
    setDisplayHour(timeById);
  };

  useEffect(() => {
    getHour();
  }, []);

  return (
    <div className={`tab-panel__box ${id === 0 && "active"}`}>
      <div className="time  shadow">{displayHour}</div>

      <Image imageCode={iconCode} size={"small"} />

      <div className="temp shadow">
        {/*@ts-ignore  */}
        {temp !== "null" ? Math.trunc(temp) : temp}
        <sup className="celcius">
          <span className="celcius__degree">°</span>
          <span className="celcius__c">c</span>
        </sup>
      </div>
    </div>
  );
};

export default TabListBox;

// there can be only one active,
// it's either the current hour
// or the one user clicks on
//onClick={onBoxClickHandler}

//maybe don't let select them?
//TODO make current hour active by default
/*
 <div
      key={box}
      className={`tab-panel__box ${box === selectedBox ? "active" : ""}`}
      //   onClick={() => onBoxClickHandler(box)}
    >
      <div className="time  shadow">09:00</div>
      <div className="img shadow">image</div>
      <div className="temp shadow">
        2°<sup>C</sup>
      </div>
    </div>
*/
