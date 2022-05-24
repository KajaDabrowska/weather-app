import { useEffect, useState, useContext } from "react";

import { TimeZoneContext } from "../../contexts/timeZone-context";

import Image from "../image/image.component";

import "./hourly-box.styles.scss";

export type WeatherOneHour = {
  temp: number;
  weather: [{ icon: string }];
};

type HourlyBoxProps = {
  box: WeatherOneHour;
  id: number;
};

const HourlyBox = ({ box, id }: HourlyBoxProps) => {
  const { temp } = box;
  const iconCode = box.weather[0].icon;

  const [displayHour, setDisplayHour] = useState<null | string>(null);

  const { timeZone } = useContext(TimeZoneContext);

  const addHourById = (hour: number) => {
    //24 is 24 in js (not 0)
    const theNumber = hour + id;

    if (theNumber < 24) {
      return theNumber;
    } else if (theNumber >= 24) {
      return theNumber - 24;
    }
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

      const hourById = addHourById(hour);
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
        {Math.trunc(temp)}
        <sup className="celcius">
          <span className="celcius__degree">°</span>
          <span className="celcius__c">c</span>
        </sup>
      </div>
    </div>
  );
};

export default HourlyBox;

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
