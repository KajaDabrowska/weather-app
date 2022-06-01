import { useState } from "react";

import searchTool from "../../images/image-search-tool.svg";

import "./search.styles.scss";

type SearchProps = {
  handleSearch: (
    e: React.FormEvent<HTMLFormElement>,
    textValue: string
  ) => void;
};

const Search = ({ handleSearch }: SearchProps) => {
  const [textValue, setTextValue] = useState("");

  const handleChange = (e: React.FormEvent<HTMLInputElement>) => {
    const { value } = e.currentTarget;

    setTextValue(value);
  };

  return (
    <form
      className="search search--container"
      onSubmit={(e) => handleSearch(e, textValue)}
    >
      <input
        type="search"
        id="search-by-city"
        className="search__input glass"
        onChange={handleChange}
      />
      <label
        htmlFor="search-by-city"
        className={`search__label shadow ${textValue ? "shrink" : ""}`}
      >
        Search by city
      </label>

      <button type="submit" className="search__btn btn-clear-styles">
        <span className="sr-only">Search</span>
        <img src={searchTool} alt="" className="search__image" />
      </button>
    </form>
  );
};

export default Search;
