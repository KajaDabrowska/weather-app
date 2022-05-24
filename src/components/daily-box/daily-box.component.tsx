import { useEffect, useState, useContext } from "react";

import { TimeZoneContext } from "../../contexts/timeZone-context";

import Image from "../image/image.component";

import "./daily-box.styles.scss";

export type WeatherOneDay = {
  temp: { max: number };
  weather: [{ main: string; icon: string }];
};

type HourlyBoxProps = {
  box: WeatherOneDay;
  id: number;
};

const DailyBox = ({ box, id }: HourlyBoxProps) => {
  const [dayNum, setDayNum] = useState(0);
  const [dayString, setDayString] = useState("Sun");

  const { timeZone } = useContext(TimeZoneContext);

  const temp = box.temp.max;
  const desc = box.weather[0].main;
  const iconCode = box.weather[0].icon;

  const getDaysInMonth = (month: number, year: number) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getDisplayDayNum = (dayNum: number, daysInMonth: number) => {
    // console.log("day today", dayNum);
    if (dayNum + id < daysInMonth) {
      // console.log("AAA day with id", dayNum + id);
      return dayNum + id;
    } else {
      // console.log("BBB day with id", daysInMonth - (dayNum + id));
      return daysInMonth - (dayNum + id);
    }
  };

  const getDisplayDayString = (weekday: string) => {
    const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const numberOfDay = daysOfWeek.indexOf(weekday);

    if (numberOfDay + id <= 6) {
      return daysOfWeek[numberOfDay + id];
    } else {
      return daysOfWeek[numberOfDay + id - 7];
    }
  };

  useEffect(() => {
    const getDate = () => {
      const now = new Date();
      const day = parseInt(
        now.toLocaleString("default", {
          day: "numeric",
          timeZone: timeZone,
        })
      );
      const weekday = now.toLocaleString("default", {
        weekday: "short",
        timeZone: timeZone,
      });

      const month = parseInt(
        now.toLocaleString("default", {
          year: "numeric",
          timeZone: timeZone,
        })
      );
      const year = parseInt(
        now.toLocaleString("default", {
          month: "numeric",
          timeZone: timeZone,
        })
      );
      const daysInMonth = getDaysInMonth(month, year);

      setDayNum(getDisplayDayNum(day, daysInMonth));
      setDayString(getDisplayDayString(weekday));
    };
    getDate();
  }, []);

  return (
    <div className={`tab-box-day ${id === 0 ? "active" : ""}`}>
      <p className="tab-box-day__date">
        {dayString} {dayNum}
      </p>

      <div className={`tab-box-day__img`}>
        <Image imageCode={iconCode} size={"medium"} />
      </div>

      <p className="tab-box-day__temp temp">
        {Math.trunc(temp)}
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
