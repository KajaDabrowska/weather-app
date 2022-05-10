import "./tablist.styles.scss";

const TabList = () => {
  return (
    <div className="tablist--container">
      <div
        className="tab-buttons"
        role="tablist"
        aria-label="Weather sorted by time list"
      >
        <button
          className="btn active"
          role="tab"
          aria-controls="hourly-tab"
          aria-selected={true}
          // @ts-ignore
          tabIndex="0"
        >
          Hourly
        </button>
        <button
          className="btn"
          role="tab"
          aria-controls="daily-tab"
          aria-selected={false}
          // @ts-ignore
          tabIndex="-1"
        >
          Daily &#62;
        </button>
      </div>

      <div className="tab-panel" id="hourly-tab" role="tabpanel">
        <div className="tab-panel--box ">
          <div className="time  shadow">09:00</div>
          <div className="img shadow">image</div>
          <div className="temp shadow">
            2°<sup>C</sup>
          </div>
        </div>

        {/* if active glass? or current hour is the second one and it's active */}
        <div className="tab-panel--box glass">
          <div className="time">09:00</div>
          <div className="img">image</div>
          <div className="temp">
            2°<sup>C</sup>
          </div>
        </div>

        <div className="tab-panel--box ">
          <div className="time">09:00</div>
          <div className="img">image</div>
          <div className="temp">
            2°<sup>C</sup>
          </div>
        </div>

        <div className="tab-panel--box ">
          <div className="time">09:00</div>
          <div className="img">image</div>
          <div className="temp">
            2°<sup>C</sup>
          </div>
        </div>

        <div className="tab-panel--box ">
          <div className="time">09:00</div>
          <div className="img">image</div>
          <div className="temp">
            2°<sup>C</sup>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TabList;
