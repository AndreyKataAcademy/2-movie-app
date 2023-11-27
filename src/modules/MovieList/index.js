import MovieItem from "../../components/MovieItem/MovieItem";
import classes from "./styles/styles.module.css";

function MovieList({ moviesData, type }) {
  return (
    <div className={classes.movieContainer}>
      {moviesData.map((movie) => (
        <MovieItem
          movieRated={movie.movieRated}
          movieGenres={movie.movieGenres}
          moviePosterUrl={movie.moviePosterUrl}
          movieTitle={movie.movieTitle}
          movieDateOfRelease={movie.movieDateOfRelease}
          movieDescription={movie.movieDescription}
          movieUserRaiting={movie.movieUserRaiting}
          type={type}
          key={movie.moviePosterUrl + movie.type}
        />
      ))}
    </div>
  );
}

export default MovieList;
