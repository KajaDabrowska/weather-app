import React, { createContext, useState } from "react";

export const TimeZoneContext = createContext({
  timeZone: "Europe/Warsaw",
  setTimezone: (value: string) => {},
});

type Props = {
  children: React.ReactNode;
};

export const TimeZoneContextProvider = ({ children }: Props) => {
  const [timeZone, setTimezone] = useState("Europe/Warsaw");

  const value = { timeZone, setTimezone };

  return (
    <TimeZoneContext.Provider value={value}>
      {children}
    </TimeZoneContext.Provider>
  );
};
