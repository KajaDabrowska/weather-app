import { useState } from "react";

import { ReactComponent as BookBinderSvg } from "../../images/image-book-binder.svg";
import { ReactComponent as BookmarkEmptySvg } from "../../images/image-bookmark-empty.svg";

import "./header.styles.scss";

export type HeaderProps = {
  cityName: string;
  searchCityName: string | null;
  date: string;
  addBookmard: () => void;
  cityIsBookmarked: boolean;
};

const Header = ({
  searchCityName,
  cityName,
  date,
  addBookmard,
  cityIsBookmarked,
}: HeaderProps) => {
  const [bookmarkActive, setBookmarkActive] = useState(false);

  const addBookmardHandler = () => {
    setBookmarkActive(!bookmarkActive);

    addBookmard();
  };

  const activeClass = cityIsBookmarked ? "active" : null;

  return (
    <header className="header--container header">
      <BookBinderSvg className="header__icon header__icon--bookbinder" />

      <div className="city-and-date">
        <h1 className="header__city">
          {searchCityName ? searchCityName : cityName}
        </h1>
        <p className="header__date">{date}</p>
      </div>

      <BookmarkEmptySvg
        onClick={addBookmardHandler}
        className={`header__icon header__icon--bookmark ${activeClass} `}
      />
    </header>
  );
};

export default Header;

// Icon by <a href="https://freeicons.io/profile/2257">www.wishforge.games</a> on <a href="https://freeicons.io">freeicons.io</a>

// Icon by <a href="https://freeicons.io/profile/714">Raj Dev</a> on <a href="https://freeicons.io">freeicons.io</a>

// Icon by <a href="https://freeicons.io/profile/714">Raj Dev</a> on <a href="https://freeicons.io">freeicons.io</a>
