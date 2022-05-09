import { useState } from "react";

import searchTool from "../../images/image-search-tool.svg";

import "./search.styles.scss";

const Search = () => {
  const [textValue, setTextValue] = useState("");

  const handleChange = (e) => {
    const { value } = e.currentTarget;

    setTextValue(value);
  };

  console.log(textValue);
  return (
    <div className="search search--container">
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

      {/*TODO actual functionality */}
      <button className="search__btn">
        <span className="sr-only">Search</span>
        <img src={searchTool} alt="" className="search__image" />
      </button>
    </div>
  );
};

export default Search;
