import { Input, Pagination, Spin, Tabs } from "antd";

import { useMainContext } from "../contexts/MainContext";
import MovieList from "../modules/MovieList";

function App() {
  const {
    activeTab,
    setActiveTab,
    setSearchQuery,
    searchQuery,
    moviesData,
    totalPages,
    moviesRaitedData,
    setActivePage,
    activePage,
    isLoadingData,
    getMovies,
    timer,
  } = useMainContext();
  const tabs = [
    {
      label: "Search",
      key: "0",
      children: (
        <>
          <Input
            placeholder="Type to search"
            onChange={setSearchQuery}
            value={searchQuery}
            onPressEnter={() => {
              clearTimeout(timer.current);
              getMovies();
            }}
          />
          {isLoadingData ? (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "100px 0",
              }}
            >
              <Spin size={"large"} />
            </div>
          ) : (
            <MovieList moviesData={moviesData} />
          )}

          <div style={{ display: "flex", justifyContent: "center" }}>
            <Pagination
              showSizeChanger={false}
              total={totalPages}
              onChange={setActivePage}
              current={activePage}
              hideOnSinglePage={true}
            />
          </div>
        </>
      ),
    },
    {
      label: "Rated",
      key: "1",
      children: <MovieList moviesData={moviesRaitedData} type="rated" />,
    },
  ];
  return (
    <div className="App">
      <div style={{ width: "100%" }}>
        <Tabs
          defaultActiveKey={activeTab}
          onChange={setActiveTab}
          items={tabs}
          centered={true}
          tabBarGutter={16}
        />
      </div>
    </div>
  );
}

export default App;
