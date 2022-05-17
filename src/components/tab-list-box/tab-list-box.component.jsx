import { useEffect, useState } from "react";

import Image from "../image/image.component";

import "./tab-list-box.styles.scss";

// , selectedBox, onBoxClickHandler
//FIXME don't prop drill timeZone
const TabListBox = ({ box, id, timeZone }) => {
  const { temp } = box;
  const iconCode = box.weather[0].icon;

  const [displayHour, setDisplayHour] = useState(null);

  const addHourById = (number, id) => {
    //24 is 0 in js
    if (number < 24) {
      const theNumber = number + id;

      if (theNumber < 24) {
        return theNumber;
      } else if (theNumber >= 24) {
        return theNumber - 24;
      }
    } else return id - 10;
  };

  useEffect(() => {
    const getHour = () => {
      const now = new Date();
      const hour = parseInt(
        now.toLocaleTimeString([], {
          hour: "2-digit",

          timeZone: timeZone,
          hour12: false,
        })
      );

      const hourById = addHourById(hour, id);
      const timeById = hourById + ":00";

      setDisplayHour(timeById);
    };

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
