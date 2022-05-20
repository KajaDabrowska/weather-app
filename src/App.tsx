import { Fragment } from "react";
import { useState, useEffect } from "react";

import Image from "./components/image/image.component";
import TabList from "./components/tablist/tablist.component";
import Search from "./components/search/search.component";
import LoadingSpinner from "./components/loadingSpinner/loading-spinner.component";

import dropImage from "./images/image-drop.svg";
import windImage from "./images/image-wind.svg";
import cloudImage from "./images/image-cloud.svg";

import { WeatherOneHour } from "./components/hourly-box/hourly-box.component";

import "./App.scss";

//{ latitude: lat, longitude: lng }
export type Coords = {
  lat: number | null;
  lng: number | null;
};

export type WeatherOneDay = {
  temp: { max: number };
  weather: [{ main: string; icon: string }];
  // weather: [{ description: string; icon: string }];
};

type Data = {
  hourly: WeatherOneHour[];
  daily: WeatherOneDay[];
  timezone: string;
  current: {
    temp: number;
    weather: [
      {
        description: string;
        icon: string;
      }
    ];
    wind_speed: number;
    humidity: number;
    clouds: number;
  };
};

// const API_KEY = "47ecb06584efcd3a09d06d7e70fd2cb8";
const API_KEY = "3585e187fe2dcd51bd3ecd35186e4637";
// units for API call
const UNITS = "metric";
// what to exclude from API call, divided by ","
const EXCLUDE = "minutely,alerts";

//TODO initial city if someone doesn't let geolocate themselves?
//TODO loading message?
const App = () => {
  const [loading, setLoading] = useState(true);

  const [coords, setCoords] = useState<Coords>({ lat: null, lng: null });
  const [cityCoords, setCityCoords] = useState<Coords>({
    lat: null,
    lng: null,
  });
  // console.log(cityCoords);

  //TODO only one cityName variable?
  const [cityName, setCityName] = useState<string | null>(null);
  const [searchCityName, setSearchCityName] = useState<string | null>(null);

  //TIMEZONE for searched cities
  const [timeZone, setTimezone] = useState("UTC");
  const [date, setDate] = useState("null");
  // NOW
  const [nowTemp, setNowTemp] = useState<string | number>("null");
  const [nowDesc, setNowDesc] = useState<string | number>("null");
  const [nowIcon, setNowIcon] = useState<string | null>(null);

  const [nowHumid, setNowHumid] = useState<string | number>("null");
  const [nowWind, setNowWind] = useState<string | number>("null");
  const [nowClouds, setNowClouds] = useState<string | number>("null");
  // HOURLY
  const [hourlyWeather, setHourlyWeather] = useState<null | WeatherOneHour[]>(
    null
  );
  // HOURLY
  const [dailyWeather, setDailyWeather] = useState<null | WeatherOneDay[]>(
    null
  );
  // console.log("COORDS: ==>", coords);

  //TODO error msg if geolocation not available
  useEffect(() => {
    if ("geolocation" in navigator) {
      // console.log("Geolocation available");

      getPosition();
    } else {
      console.log("Not Available");
    }
  }, []);

  /* ---------------------------- */
  /* -- SET TIMEZONE AND DATE -- */
  /* -------------------------- */
  useEffect(() => {
    // console.log("timeZone APP JS -------------", timeZone);
    const getDateAndTimeZone = () => {
      setTimezone(Intl.DateTimeFormat().resolvedOptions().timeZone);

      const now = new Date();

      const all = now.toLocaleString("default", {
        weekday: "short",
        day: "numeric",
        month: "short",
        timeZone: timeZone,
      });

      setDate(all);
    };

    getDateAndTimeZone();
  }, []);
  /* ---------------------------- */
  /* -----  SET DATE  ------ */
  /* -------------------------- */
  useEffect(() => {
    // console.log("i set time after timeZone changes -------------", timeZone);
    const getDate = () => {
      const now = new Date();
      const all = now.toLocaleString("default", {
        weekday: "short",
        day: "numeric",
        month: "short",
        timeZone: timeZone,
      });

      setDate(all);
    };

    getDate();
  }, [timeZone]);

  /* -------------------------- */
  /* ------  GET CITY   ------- */
  /* -------------------------- */
  useEffect(() => {
    // console.log("i get city cuz coords changed");
    //TODO bookmark cities?
    const getCity = async () => {
      try {
        const { lat, lng } = coords;
        const url = `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lng}&localityLanguage=en`;

        const res = await fetch(url);
        const data = await res.json();

        setCityName(data.city);
      } catch (err) {
        console.log(err);
      }
    };

    getCity();
  }, [coords]);

  const forSearchedCity = {
    forCity: true,
    notForCity: false,
  };

  /* --------------------------- */
  /* ------  GET WEATHER ------- */
  /* --------------------------- */
  //FIXME isn't this an issue
  useEffect(() => {
    // console.log("coords changed so i can fetch weather data");

    getWeather(forSearchedCity.notForCity);
  }, [coords]);

  useEffect(() => {
    getCoordsFromSearchedCity();
  }, [searchCityName]);

  useEffect(() => {
    getWeather(forSearchedCity.forCity);
  }, [cityCoords]);

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

  const capitalizeFirstLetter = (string: string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  };

  const setWeatherVariables = (data: Data) => {
    // console.log(data);
    setNowTemp(data.current.temp);
    setNowDesc(data.current.weather[0].description);
    setNowIcon(data.current.weather[0].icon);
    setNowWind(data.current.wind_speed);
    setNowHumid(data.current.humidity);
    setNowClouds(data.current.clouds);
    setTimezone(data.timezone); //TIMEZONE //FIXME

    // array
    setHourlyWeather(data.hourly);
    setDailyWeather(data.daily);

    //FIXME thats bad if u think for more than one nanosecond
    setLoading(false);
  };

  const getWeather = async (fromSearch: boolean) => {
    setLoading(true);

    try {
      const { lat, lng } = fromSearch ? cityCoords : coords;

      if (lat === null) return;

      const url = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lng}&units=${UNITS}&exclude=${EXCLUDE}&appid=${API_KEY}`;
      // console.log(url);

      const res = await fetch(url);
      const data = await res.json();
      // console.log("Weather data: ", data);

      setWeatherVariables(data);
    } catch (err) {
      //TODO error msg
      console.log(err, "error fetching WEATHER data");
    }
  };

  const getCoordsFromSearchedCity = async () => {
    try {
      if (!searchCityName) return;

      const url = `http://api.openweathermap.org/geo/1.0/direct?q=${searchCityName}&limit=1&appid=${API_KEY}`;

      const res = await fetch(url);
      const data = await res.json();

      // console.log("City data: ", data);

      setCityCoords({ lat: data[0].lat, lng: data[0].lon });
    } catch (err) {
      console.log(err);
    }
  };

  const handleSearch = (
    e: React.FormEvent<HTMLFormElement>,
    textValue: string
  ) => {
    e.preventDefault();

    setSearchCityName(textValue);
  };

  return (
    <Fragment>
      {/*TODO add LOADING COMPONENT */}
      {loading === false ? (
        <div className="container">
          <header className="header--container ">
            <h1 className="city">
              {searchCityName ? searchCityName : cityName}
            </h1>
            <p className="date">{date}</p>
          </header>

          <main className="">
            <div className="main--container glass">
              <div className="big--container ">
                <div className="tempDesc">
                  <div className="temp shadow">
                    {/*TODO Math.trunc  */}
                    {/*@ts-ignore  */}
                    {nowTemp !== "null" ? Math.trunc(nowTemp) : nowTemp}
                    <sup className="celcius">
                      <span className="celcius__degree">°</span>
                      <span className="celcius__c">c</span>
                    </sup>
                  </div>
                  {/*@ts-ignore  */}
                  <div className="desc">{capitalizeFirstLetter(nowDesc)}</div>
                </div>

                {/*@ts-ignore  */}
                <Image imageCode={nowIcon ? nowIcon : null} size={"big"} />
              </div>
              <div className="small--container">
                <div className="details">
                  <img src={windImage} alt="" className="image shadow" />
                  {/*@ts-ignore  */}
                  <p>{Math.trunc(nowWind)} km/h</p>
                </div>

                <div className="details details__humid">
                  <img src={dropImage} alt="" className="image shadow" />
                  <p>{nowHumid}%</p>
                </div>

                <div className="details">
                  <img src={cloudImage} alt="" className="image shadow" />
                  <p>{nowClouds}%</p>
                </div>
              </div>
            </div>
            {/* ------------------------ */}
            {/* ------------------------ */}
            {/* ------------------------ */}
            {hourlyWeather && dailyWeather && (
              <TabList
                hourlyWeather={hourlyWeather}
                dailyWeather={dailyWeather}
                timeZone={timeZone}
              />
            )}

            <Search handleSearch={handleSearch} />
          </main>
        </div>
      ) : (
        <LoadingSpinner />
      )}
    </Fragment>
  );
};

export default App;
