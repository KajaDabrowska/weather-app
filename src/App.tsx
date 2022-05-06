import React, { Fragment } from "react";
import { useState, useEffect } from "react";

import Image from "./components/image/image.component";

import dropImage from "./images/image-drop.svg";
import windImage from "./images/image-wind.svg";
import cloudImage from "./images/image-cloud.svg";

import "./App.scss";

//{ latitude: lat, longitude: lng }
export type Coords = {
  lat: number | null;
  lng: number | null;
};

// const API_KEY = "47ecb06584efcd3a09d06d7e70fd2cb8";
const API_KEY = "3585e187fe2dcd51bd3ecd35186e4637";

const App = () => {
  const [coords, setCoords] = useState<Coords>({ lat: null, lng: null });
  const [cityName, setCityName] = useState<string | null>(null);
  const [date, setDate] = useState("null");
  const [nowTemp, setNowTemp] = useState("null");
  const [nowDesc, setNowDesc] = useState("null");
  const [nowIcon, setNowIcon] = useState("null");

  const [nowHumid, setNowHumid] = useState("null");
  const [nowWind, setNowWind] = useState("null");
  const [nowClouds, setNowClouds] = useState("null");

  //TODO error msg if geolocation not available
  useEffect(() => {
    if ("geolocation" in navigator) {
      // console.log("Geolocation available");

      getPosition();
    } else {
      console.log("Not Available");
    }
  }, []);

  useEffect(() => {
    getDate();
  }, []);

  useEffect(() => {
    getCity();
  }, [coords]);

  useEffect(() => {
    // console.log("coords changed so i can fetch weather data");

    getWeatherNow();
  }, [coords]);

  const getPosition = async () => {
    try {
      await navigator.geolocation.getCurrentPosition((position) =>
        setCoords({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        })
      );
    } catch (err) {
      console.log(err, "could not get location");
    }
  };

  const getDate = () => {
    const now = new Date();

    // const day = now.toLocaleString("default", { weekday: "short" });
    // const dayNum = now.toLocaleString("default", { day: "numeric" });
    // const month = now.toLocaleString("default", { month: "short" });
    const all = now.toLocaleString("default", {
      weekday: "short",
      day: "numeric",
      month: "short",
    });

    // console.log("now:", now);
    // console.log("day:", day);
    // console.log("day numb:", dayNum);
    // console.log("month:", month);
    // console.log("all: ", all);
    // console.log(all);
    setDate(all);
  };

  const capitalizeFirstLetter = (string: string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  };

  const getWeatherNow = async () => {
    try {
      const { lat, lng } = coords;

      if (lat === null) return;

      const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lng}&units=metric&appid=${API_KEY}`;
      // console.log(url);

      const res = await fetch(url);
      const data = await res.json();

      console.log("Weather data: ", data);
      setNowTemp(data.main.temp);
      setNowDesc(data.weather[0].description);
      setNowIcon(data.weather[0].icon);

      setNowWind(data.wind.speed);
      setNowHumid(data.main.humidity);
      setNowClouds(data.clouds.all);
    } catch (err) {
      //TODO error msg
      console.log(err, "error fetching WEATHER data");
    }
  };

  const getCity = async () => {
    try {
      const { lat, lng } = coords;
      const url = `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lng}&localityLanguage=en`;

      const res = await fetch(url);
      const data = await res.json();

      // console.log("City data: ", data);

      setCityName(data.city);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <Fragment>
      <header className="header--container container">
        <h1 className="city">{cityName}</h1>
        <p className="date">{date}</p>
      </header>

      <main className="container">
        <div className="main--container glass">
          <div className="big--container ">
            <div className="tempDesc">
              <div className="temp">
                {nowTemp}° <sup>C</sup>
              </div>
              <div className="desc">{capitalizeFirstLetter(nowDesc)}</div>
            </div>

            {/*@ts-ignore  */}
            <Image imageCode={nowIcon ? nowIcon : null} />
          </div>
          <div className="small--container">
            <div className="details">
              <img src={windImage} alt="" className="image" />
              {/*@ts-ignore  */}
              <p>{Math.trunc(nowWind)} km/h</p>
            </div>

            <div className="details">
              <img src={dropImage} alt="" className="image" />
              <p>{nowHumid}%</p>
            </div>

            <div className="details">
              <img src={cloudImage} alt="" className="image" />
              <p>{nowClouds}%</p>
            </div>
          </div>
        </div>
      </main>

      {/* <main>
      <h1>Hi</h1>

      <p>
        coords: {coords.lat}, {coords.lng}
      </p>

      <p>City name: {cityName}</p>

      <p>data: {date}</p>

      <p>
        now weather: {nowTemp}, {nowDesc}, {nowIcon}
      </p>

      <Image imageCode={nowIcon} />
    </main> */}
    </Fragment>
  );
};

export default App;

// get city
//https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=52.1391643&longitude=21.0426115&localityLanguage=en
// "city": "Warsaw",
//  "countryName": "Poland",

// get day

// get 7 days
