# Weather App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## About

- Gets weather data based on users location( if not avaiable has mock data), searched city.

- Has hourly and daily weather.

- Dates and hours change according to time zone.

- Bookmark city functionality

- Built with accessibility in mind

### Live site

https://weather-app-kaja.netlify.app

### What I've learned

- How to implement a focus traping element

```jsx
<FocusTrap isActive={bookmarkBinderVisible}>{/* ... */}</FocusTrap>
```

- Got a little better with TS

```tsx
type ReturnType<T> = [T, React.Dispatch<React.SetStateAction<T>>];

export const useLocalStorage = <T,>(
  key: string,
  defaultValue: T
): ReturnType<T> => {
  const [value, setValue] = useState<T>(() => {
    return getStorageValue(key, defaultValue);
  });

  //...
};
```

- Learned a bit about working with dates (for creating hourly and daily weather displays)

```tsx
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
```
