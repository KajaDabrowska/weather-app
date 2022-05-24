import "./header.styles.scss";

export type HeaderProps = {
  cityName: string;
  searchCityName: string | null;
  date: string;
};

const Header = ({ searchCityName, cityName, date }: HeaderProps) => {
  return (
    <header className="header--container ">
      <h1 className="city">{searchCityName ? searchCityName : cityName}</h1>
      <p className="date">{date}</p>
    </header>
  );
};

export default Header;
