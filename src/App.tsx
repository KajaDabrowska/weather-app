import { Fragment, useState, useEffect, useContext, useCallback } from "react";
import { useErrorHandler } from "react-error-boundary";

// Components
import TabList from "./components/tablist/tablist.component";
import Search from "./components/search/search.component";
import LoadingSpinner from "./components/loadingSpinner/loading-spinner.component";
import Header from "./components/header/header.component";
import MainDisplay, {
  NowWeather,
} from "./components/main-display/main-display.component";
import BookmarkBinder from "./components/bookmark-binder/bookmark-binder.component";

// Types
import { WeatherOneHour } from "./components/hourly-box/hourly-box.component";
import { WeatherOneDay } from "./components/daily-box/daily-box.component";

// Context
import { TimeZoneContext } from "./contexts/timeZone-context";

// Utilities
import { useLocalStorage } from "./useLocalStorage";

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

export type BookmarkType = {
  cityName: string;
  coords: Coords;
};

// type BookmarksArray = {
//   bookmarks: Bookmark[];
// };

const API_KEY = "3585e187fe2dcd51bd3ecd35186e4637";
// units for API call
const UNITS = "metric";
// what to exclude from API call, divided by ","
const EXCLUDE = "minutely,alerts";

//TODO make use of useCallback and useMemo wherever u can
const App = () => {
  //TODO can i memoize this? do i?
  const handleError = useErrorHandler();
  // const handleError = useCallback(useErrorHandler(), []);

  const [loading, setLoading] = useState(true);

  const [coords, setCoords] = useState<Coords>({
    lat: 52.229,
    lng: 21.012,
  });

  const [cityCoords, setCityCoords] = useState<Coords>({
    lat: null,
    lng: null,
  });
  // console.log("coords", coords);

  const [cityName, setCityName] = useState("");
  const [searchCityName, setSearchCityName] = useState<string | null>(null);

  //TIMEZONE for searched cities
  const { timeZone, setTimezone } = useContext(TimeZoneContext);

  const [date, setDate] = useState("");

  // NOW
  const [nowTemp, setNowTemp] = useState<number | null>(null);
  const [nowDesc, setNowDesc] = useState("");
  const [nowIcon, setNowIcon] = useState("");

  const [nowHumid, setNowHumid] = useState<number | null>(null);
  const [nowWind, setNowWind] = useState<number | null>(null);
  const [nowClouds, setNowClouds] = useState<number | null>(null);

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

  const [bookmarks, setBookmarks] = useLocalStorage<BookmarkType[]>(
    "bookmarks",
    []
  );

  const [cityIsBookmarked, setCityIsBookmarked] = useState(false);

  const getPosition = useCallback(async () => {
    // console.log("getPos goes off");
    try {
      await navigator.geolocation.getCurrentPosition((position) =>
        setCoords({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        })
      );

      // If I ever decided to do something in case someone doesn't let geolocate themselves
      // const { state: geolocationPermission } =
      //   await navigator.permissions.query({
      //     name: "geolocation",
      //   });

      // if (geolocationPermission === "denied") {
      //   //
      // }
    } catch (err) {
      handleError(err);
    }
  }, []);

  useEffect(() => {
    if ("geolocation" in navigator) {
      // console.log("Geolocation available");

      getPosition();
    } else {
      console.log("Geolocation Not Available");
    }
  }, [getPosition]);

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
    const getCity = async () => {
      // console.log("getCity");
      try {
        const { lat, lng } = coords;
        const url = `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lng}&localityLanguage=en`;

        const res = await fetch(url);
        const data = await res.json();

        setCityName(data.city);
        // console.log("cityName: ", data.city);
      } catch (err) {
        handleError(err);
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
    getCoordsFromSearchedCity();
  }, [searchCityName]);

  useEffect(() => {
    getWeather(forSearchedCity.forCity);
  }, [cityCoords]);

  const setWeatherVariables = useCallback((data: Data) => {
    // console.log("i SET weather");
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

    setLoading(false);
  }, []);

  const getWeather = useCallback(
    async (fromSearch: boolean) => {
      // console.log("i get weather");
      // console.log("weather, coords", coords);
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
        handleError(err);
      }
    },
    [coords, cityCoords]
  );

  useEffect(() => {
    // console.log("coords changed so i can fetch weather data");

    getWeather(forSearchedCity.notForCity);
  }, [coords]);

  const getCoordsFromSearchedCity = useCallback(async () => {
    try {
      if (!searchCityName) return;

      const url = `https://api.openweathermap.org/geo/1.0/direct?q=${searchCityName}&limit=1&appid=${API_KEY}`;

      const res = await fetch(url);
      const data = await res.json();

      // console.log("City data: ", data);

      setCityCoords({ lat: data[0].lat, lng: data[0].lon });
    } catch (err) {
      handleError(err);
    }
  }, [searchCityName]);

  const handleSearch = useCallback(
    (e: React.FormEvent<HTMLFormElement>, textValue: string) => {
      e.preventDefault();

      if (textValue) setSearchCityName(textValue);
    },
    []
  );

  /* -------------------- */
  /* ---- BOOKMARKS ----- */
  /* -------------------- */
  // this is for adding an active class on the bookmark icon
  const checkIfCityIsBookmarked = useCallback(() => {
    const cityToCheck = searchCityName ? searchCityName : cityName;
    // console.log("city to check", cityToCheck);

    // i know this is redundant(it's also in addBookmark func)
    // but making a seperate func just for this is maybe a bit too much?
    const alreadyBookmarked = bookmarks?.find(
      (bookmark) => bookmark.cityName === cityToCheck
    );
    // if city is bookmarked add class
    if (alreadyBookmarked) {
      setCityIsBookmarked(true);
    } else {
      setCityIsBookmarked(false);
    }
  }, [cityName, searchCityName, bookmarks]);

  useEffect(() => {
    // console.log("checkIfCityIsBookmarked");
    checkIfCityIsBookmarked();
  });

  const addBookmard = useCallback(() => {
    const cityNameForBookmark = searchCityName ? searchCityName : cityName;
    const coordsForBookmark = cityCoords.lat ? cityCoords : coords;

    // check if not already in bookmarks
    const alreadyBookmarked = bookmarks?.find(
      (bookmark) => bookmark.cityName === cityNameForBookmark
    );

    if (alreadyBookmarked) {
      // if it is then delete
      setBookmarks((previousBookmarks) => [
        ...previousBookmarks.filter(
          (bookmark) => bookmark !== alreadyBookmarked
        ),
      ]);
    } else {
      // if not then add
      setBookmarks((previousBookmarks) => [
        ...previousBookmarks,
        { cityName: cityNameForBookmark, coords: coordsForBookmark },
      ]);
    }
  }, [bookmarks, cityCoords, cityName, searchCityName, coords]);

  const [bookmarkBinderVisible, toggleBookmarkBinderVisible] = useState(false);
  // console.log(bookmarkBinderVisible);

  const toggleBookmarkBinderVisHanlder = () => {
    toggleBookmarkBinderVisible((prevValue) => !prevValue);
  };

  return (
    <Fragment>
      {loading === false ? (
        <div className="border">
          <div className="container ">
            <Header
              cityName={cityName}
              searchCityName={searchCityName}
              date={date}
              addBookmard={addBookmard}
              cityIsBookmarked={cityIsBookmarked}
              toggleBookmarkBinderVisHanlder={toggleBookmarkBinderVisHanlder}
            />

            <main>
              {bookmarkBinderVisible ? (
                <BookmarkBinder
                  toggleBookmarkBinderVisHanlder={
                    toggleBookmarkBinderVisHanlder
                  }
                  bookmarks={bookmarks}
                  setSearchCityName={setSearchCityName}
                  bookmarkBinderVisible={bookmarkBinderVisible}
                />
              ) : (
                ""
              )}

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
        </div>
      ) : (
        <LoadingSpinner />
      )}
    </Fragment>
  );
};

export default App;
