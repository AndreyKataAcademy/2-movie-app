import { message } from "antd";
import {
  createContext,
  useContext,
  useEffect,
  useReducer,
  useRef,
} from "react";

import { secondAPIKEY } from "../config/config";

const MainContext = createContext();
const initialState = {
  activeTab: 0,
  activePage: 1,
  searchQuery: "",
  moviesPage: 1,
  moviesData: [],
  moviesGenres: [],
  moviesRaitedData: [],
  totalPages: null,
  isLoadingData: false,
};
function reducer(state, action) {
  switch (action.type) {
    case "tab/active":
      return { ...state, activeTab: action.payload };
    case "search/set":
      return { ...state, searchQuery: action.payload };
    case "movie/add":
      return { ...state, moviesData: [...action.payload] };
    case "genre/set":
      return { ...state, moviesGenres: action.payload };
    case "search/status": {
      return { ...state, isLoadingData: action.payload };
    }
    case "movie/evaluate":
      return {
        ...state,
        moviesRaitedData: [...state.moviesRaitedData, action.payload],
      };
    case "movie/reevaluate":
      return {
        ...state,
        moviesRaitedData: [
          ...state.moviesRaitedData.map((movie) => {
            if (movie.moviePosterUrl === action.payload.moviePosterUrl)
              return action.payload;
            return movie;
          }),
        ],
      };
    case "pages/setTotal":
      return { ...state, totalPages: action.payload };
    case "pages/setActive":
      return { ...state, activePage: action.payload };
    default:
      throw new Error("Unknown type");
  }
}
function MainProvider({ children }) {
  const [
    {
      activeTab,
      searchQuery,
      moviesData,
      moviesRaitedData,
      moviesGenres,
      totalPages,
      activePage,
      isLoadingData,
    },
    dispatch,
    ,
  ] = useReducer(reducer, initialState);
  async function getMovies() {
    if (!navigator.onLine)
      message.error(
        "Internet is not available at this time. Please check your connection or come back later.",
      );
    if (searchQuery === "") return;
    try {
      setIsLoading(true);
      const response = await fetch(
        `https://api.themoviedb.org/3/search/movie?query=${searchQuery}&include_adult=true&language=en-US&page=${activePage}`,
        {
          method: "GET",
          headers: {
            accept: "application/json",
            Authorization: `Bearer ${secondAPIKEY}`,
          },
        },
      );
      const data = await response.json();
      if (data.results.length === 0) {
        throw new Error("Not found movies with this name");
      }
      setTotalPages(data.total_pages);

      addMovie(
        data.results.map((movie) => {
          return {
            movieRated: movie.vote_average,
            movieGenres: movie.genre_ids,
            moviePosterUrl: movie["poster_path"],
            movieTitle: movie.title,
            movieDateOfRelease: movie.release_date,
            movieDescription: movie.overview,
            movieUserRaiting: null,
            type: "fetched",
          };
        }),
      );
    } catch (error) {
      message.error(error.message);
    } finally {
      setIsLoading(false);
    }
  }
  const timer = useRef();
  useEffect(() => {
    timer.current = setTimeout(() => {
      getMovies();
    }, 700);

    return () => clearTimeout(timer.current);
  }, [searchQuery]);
  useEffect(() => {
    getMovies();
  }, [activePage]);
  useEffect(() => {
    async function getGenres() {
      try {
        const response = await fetch(
          "https://api.themoviedb.org/3/genre/movie/list?language=en",
          {
            method: "GET",
            headers: {
              accept: "application/json",
              Authorization: `Bearer ${secondAPIKEY}`,
            },
          },
        );
        const data = await response.json();
        addGenres(data.genres);
      } catch (error) {
        message.error(error.message);
      }
    }
    getGenres();
  }, []);
  function setActivePage(numberOfPage) {
    dispatch({ type: "pages/setActive", payload: numberOfPage });
  }
  function setTotalPages(totalPages) {
    dispatch({ type: "pages/setTotal", payload: totalPages * 10 });
  }
  function evaluateMovie(movieObj) {
    if (
      moviesRaitedData.some(
        (el) => el.moviePosterUrl === movieObj.moviePosterUrl,
      )
    ) {
      dispatch({ type: "movie/reevaluate", payload: movieObj });
    } else {
      dispatch({ type: "movie/evaluate", payload: movieObj });
    }
  }

  function setActiveTab(id) {
    if (!id) {
      throw new Error("Tab received an incorrect id");
    }
    dispatch({ type: "tab/active", payload: Number(id) });
  }
  function addMovie(movieArray) {
    dispatch({ type: "movie/add", payload: movieArray });
  }
  function addGenres(genresArray) {
    dispatch({ type: "genre/set", payload: genresArray });
  }
  function setSearchQuery(event) {
    dispatch({ type: "search/set", payload: event.target.value });
  }
  function setIsLoading(status) {
    dispatch({ type: "search/status", payload: status });
  }
  return (
    <MainContext.Provider
      value={{
        activeTab,
        setActiveTab,
        searchQuery,
        setSearchQuery,
        moviesData,
        evaluateMovie,
        moviesRaitedData,
        moviesGenres,
        totalPages,
        setActivePage,
        activePage,
        isLoadingData,
        getMovies,
        timer,
      }}
    >
      {children}
    </MainContext.Provider>
  );
}

function useMainContext() {
  const context = useContext(MainContext);
  if (!context)
    throw new Error("Attempts to use Main context outside of its scope");
  return context;
}
export { MainProvider, useMainContext };
