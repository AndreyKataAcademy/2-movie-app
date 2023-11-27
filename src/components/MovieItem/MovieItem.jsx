import { Rate, Tag } from "antd";
import { format } from "date-fns";

import MovieStars from "../../UI/MovieStars/MovieStars";
import ResponsiveImage from "../../UI/ResponsiveImage/ResponsiveImage";
import { useMainContext } from "../../contexts/MainContext";
import styles from "./MovieItem.module.css";

function MovieItem({
  movieRated,
  movieGenres,
  moviePosterUrl,
  movieTitle,
  movieDateOfRelease,
  movieDescription,
  type,
  movieUserRaiting,
}) {
  const { moviesGenres, evaluateMovie, moviesRaitedData } = useMainContext();

  const genresRender = [];
  if (Array.isArray(movieGenres)) {
    moviesGenres.forEach((element) => {
      if (movieGenres.includes(element.id)) genresRender.push(element.name);
    });
  } else {
    genresRender.push(movieGenres.name);
  }

  return (
    <div className={styles.movieItem}>
      <div className={styles.moviePoster}>
        <ResponsiveImage
          imageSrc={moviePosterUrl}
          imageAlt={`Poster of movie ${movieTitle}`}
        />
      </div>
      <div className={styles.movieInfo}>
        <p className={styles.title}>{movieTitle}</p>
        <p className={styles.dateOfRelease}>
          {movieDateOfRelease === ""
            ? "Release date is unknown"
            : format(new Date(movieDateOfRelease), "MMMM dd, Y")}
        </p>
        <p>
          {genresRender.length
            ? genresRender.map((genre) => (
                <Tag key={Math.random()}>{genre}</Tag>
              ))
            : "The genres of the movie are not specified"}
        </p>
        <MovieStars movieRated={movieRated} />
      </div>
      <div className={styles.movieDescription}>
        {movieDescription
          ? decorateText(movieDescription)
          : "No description of the movie is given."}
        <div className={styles.rateContainer}>
          {type ? (
            <Rate
              value={movieUserRaiting ? movieUserRaiting : 0}
              count={10}
              allowHalf={true}
              onChange={(movieUserRaiting) => {
                evaluateMovie({
                  movieUserRaiting,
                  movieRated,
                  movieGenres,
                  moviePosterUrl,
                  movieTitle,
                  movieDateOfRelease,
                  movieDescription,
                  type: "rated",
                });
              }}
            />
          ) : (
            <Rate
              value={
                moviesRaitedData.some(
                  (movie) => movie["moviePosterUrl"] === moviePosterUrl,
                )
                  ? moviesRaitedData[
                      moviesRaitedData.findIndex(
                        (movie) => movie["moviePosterUrl"] === moviePosterUrl,
                      )
                    ]["movieUserRaiting"]
                  : 0
              }
              count={10}
              allowHalf={true}
              onChange={(movieUserRaiting) =>
                evaluateMovie({
                  movieUserRaiting,
                  movieRated,
                  movieGenres,
                  moviePosterUrl,
                  movieTitle,
                  movieDateOfRelease,
                  movieDescription,
                  type: "rated",
                })
              }
            />
          )}
        </div>
      </div>
    </div>
  );
}
function decorateText(text) {
  const result = text.split(" ");
  if (result.length < 20) return result.join(" ");
  return result.splice(0, 19).join(" ") + "...";
}
export default MovieItem;
