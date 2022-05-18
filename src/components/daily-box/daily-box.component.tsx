import { useEffect, useState } from "react";

import Image from "../image/image.component";

import "./daily-box.styles.scss";

import { WeatherOneDay } from "../../App";

// , selectedBox, onBoxClickHandler
//FIXME don't prop drill timeZone

type HourlyBoxProps = {
  box: WeatherOneDay;
  id: number;
  timeZone: string;
};

//{ box, id, timeZone }: HourlyBoxProps
const DailyBox = ({ box, id, timeZone }: HourlyBoxProps) => {
  const [dayNum, setDayNum] = useState(0);
  const [dayString, setDayString] = useState("Sun");

  const temp = box.temp.max;
  const desc = box.weather[0].main;
  const iconCode = box.weather[0].icon;

  const addidtionalIconStyle = iconCode === "01d" ? "sun-make-smaller" : "";

  useEffect(() => {
    const getHour = () => {
      const now = new Date();
      const date = now.toLocaleTimeString([], {
        day: "numeric",
        month: "numeric",
        year: "numeric",
        timeZone: timeZone,
      });
      console.log("timeZone", timeZone);
      console.log("date", date);
      // const hourById = addHourById(hour, id);
      // const timeById = hourById + ":00";

      // setDisplayHour(timeById);
    };

    getHour();
  }, [timeZone]);

  return (
    <div className={`tab-box-day ${id === 0 ? "active" : ""}`}>
      <p className="tab-box-day__date">Sun 30</p>
      <div className={`tab-box-day__img ${addidtionalIconStyle}`}>
        {/*@ts-ignore */}
        <Image imageCode={iconCode} size={"medium"} />
      </div>
      <p className="tab-box-day__temp temp">
        {temp}
        <sup className="celcius">
          <span className="celcius__degree">°</span>
          <span className="celcius__c">c</span>
        </sup>
      </p>
      <p className="tab-box-day__desc">{desc}</p>
    </div>
  );
};

export default DailyBox;

/*
<div className={`tab-panel__box ${id === 0 && "active"}`}>
      <div className="time  shadow">{}</div>

      
      <Image imageCode={iconCode} size={"small"} />

      <div className="temp shadow">
        {Math.trunc(temp)}
        <sup className="celcius">
          <span className="celcius__degree">°</span>
          <span className="celcius__c">c</span>
        </sup>
      </div>
    </div>
*/
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
