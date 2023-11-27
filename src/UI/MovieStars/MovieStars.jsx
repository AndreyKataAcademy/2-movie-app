import classes from "./MovieStars.module.css";

const MovieStars = ({ movieRated = 0 }) => {
  return (
    <span
      className={`${classes.raitingContainer} ${
        movieRated > 0 && movieRated < 3
          ? classes.lowRaiting
          : movieRated > 3 && movieRated < 5
            ? classes.mediumRating
            : movieRated > 5 && movieRated < 7
              ? classes.hightRating
              : classes.perfectRating
      }`}
    >
      {movieRated.toFixed(1)}
    </span>
  );
};

export default MovieStars;
