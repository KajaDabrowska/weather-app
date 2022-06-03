import { v4 as uuidv4 } from "uuid";
// i could not make this library work for me:
// import FocusTrap from "focus-trap-react";
// so I've found this, more info in the component
import FocusTrap from "../focus-trap/focus-trap.component";

import { ReactComponent as CloseIcon } from "../../images/image-close.svg";

import { BookmarkType } from "../../App";

import "./bookmark-binder.styles.scss";

type Props = {
  toggleBookmarkBinderVisHanlder: () => void;
  bookmarks: BookmarkType[] | undefined;
  setSearchCityName: React.Dispatch<React.SetStateAction<string | null>>;
  bookmarkBinderVisible: boolean;
};

const BookmarkBinder = ({
  toggleBookmarkBinderVisHanlder,
  bookmarks,
  setSearchCityName,
  bookmarkBinderVisible,
}: Props) => {
  const loadBookmark = (e: React.MouseEvent<HTMLButtonElement>) => {
    const cityName = e.currentTarget.textContent;

    setSearchCityName(cityName);
    toggleBookmarkBinderVisHanlder();
  };

  return (
    <FocusTrap isActive={bookmarkBinderVisible}>
      <div className="book-binder glass">
        <div className="book-binder__title-and-close-btn">
          <h2 className="book-binder__title shadow">Bookmarks</h2>

          <button
            onClick={toggleBookmarkBinderVisHanlder}
            className="book-binder__close-btn btn-clear-styles"
            autoFocus
          >
            <CloseIcon className="book-binder__close-icon " />
          </button>
        </div>

        {bookmarks?.length ? (
          <ul className="book-binder__list">
            {bookmarks.map((bookmark) => (
              <li className="book-binder__bookmark" key={uuidv4()}>
                <button
                  onClick={loadBookmark}
                  className="book-binder__bookmark-btn btn-clear-styles shadow"
                >
                  {bookmark.cityName}
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <p className="book-binder__empty-msg shadow">No bookmarks saved</p>
        )}
      </div>
    </FocusTrap>
  );
};

export default BookmarkBinder;

//  Icon by <a href="https://freeicons.io/profile/3">icon king1</a> on <a href="https://freeicons.io">freeicons.io</a>

/* <li className="book-binder__bookmark">
<button className="book-binder__bookmark-btn shadow">Krakow</button>
</li>
<li className="book-binder__bookmark">
<button className="book-binder__bookmark-btn shadow">Krakow</button>
</li>
<li className="book-binder__bookmark">
<button className="book-binder__bookmark-btn shadow">Krakow</button>
</li> */
