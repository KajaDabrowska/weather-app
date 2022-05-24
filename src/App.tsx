import { Fragment } from "react";
import { useState, useEffect, useContext } from "react";

import TabList from "./components/tablist/tablist.component";
import Search from "./components/search/search.component";
import LoadingSpinner from "./components/loadingSpinner/loading-spinner.component";
import Header from "./components/header/header.component";
import MainDisplay, {
  NowWeather,
} from "./components/main-display/main-display.component";

import { WeatherOneHour } from "./components/hourly-box/hourly-box.component";
import { WeatherOneDay } from "./components/daily-box/daily-box.component";

import { TimeZoneContext } from "./contexts/timeZone-context";

// import "./App.scss";

//{ latitude: lat, longitude: lng }
export type Coords = {
  lat: number | null;
  lng: number | null;
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

const API_KEY = "3585e187fe2dcd51bd3ecd35186e4637";
// units for API call
const UNITS = "metric";
// what to exclude from API call, divided by ","
const EXCLUDE = "minutely,alerts";

//TODO loading message?
const App = () => {
  const [loading, setLoading] = useState(true);

  const [coords, setCoords] = useState<Coords>({ lat: 52.2297, lng: 21.0122 });
  const [cityCoords, setCityCoords] = useState<Coords>({
    lat: null,
    lng: null,
  });

  const [cityName, setCityName] = useState("Warsaw");
  const [searchCityName, setSearchCityName] = useState<string | null>(null);

  //TIMEZONE for searched cities
  const { timeZone, setTimezone } = useContext(TimeZoneContext);

  const [date, setDate] = useState("Tue, May 24");

  // NOW
  const [nowTemp, setNowTemp] = useState(17.45);
  const [nowDesc, setNowDesc] = useState("clear sky");
  const [nowIcon, setNowIcon] = useState("01d");

  const [nowHumid, setNowHumid] = useState(57);
  const [nowWind, setNowWind] = useState(6);
  const [nowClouds, setNowClouds] = useState(0);

  const nowWeather: NowWeather = {
    nowTemp: nowTemp,
    nowDesc: nowDesc,
    nowIcon: nowIcon,

    nowHumid: nowHumid,
    nowWind: nowWind,
    nowClouds: nowClouds,
  };

  // HOURLY
  const [hourlyWeather, setHourlyWeather] = useState<null | WeatherOneHour[]>(
    null
  );

  // DAILY
  const [dailyWeather, setDailyWeather] = useState<null | WeatherOneDay[]>(
    null
  );

  //TODO error msg if geolocation not available
  useEffect(() => {
    if ("geolocation" in navigator) {
      // console.log("Geolocation available");

      getPosition();
    } else {
      console.log("Geolocation Not Available");
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

  const setWeatherVariables = (data: Data) => {
    // console.log(data);
    setNowTemp(data.current.temp);
    setNowDesc(data.current.weather[0].description);
    setNowIcon(data.current.weather[0].icon);
    setNowWind(data.current.wind_speed);
    setNowHumid(data.current.humidity);
    setNowClouds(data.current.clouds);
    setTimezone(data.timezone);

    // array
    setHourlyWeather(data.hourly);
    setDailyWeather(data.daily);

    //FIXME thats bad?
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
          <Header
            cityName={cityName}
            searchCityName={searchCityName}
            date={date}
          />

          <main>
            <MainDisplay nowWeather={nowWeather} />

            {hourlyWeather && dailyWeather && (
              <TabList
                hourlyWeather={hourlyWeather}
                dailyWeather={dailyWeather}
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
