import React from "react";

import styles from "./ResponsiveImage.module.css";

function ResponsiveImage({ imageSrc, imageAlt }) {
  return (
    <img
      src={
        imageSrc
          ? `https://image.tmdb.org/t/p/w500/${imageSrc}`
          : `${process.env.PUBLIC_URL}/movie_not_found.png`
      }
      alt={imageAlt}
      className={styles.adaptiveImage}
    />
  );
}

export default ResponsiveImage;
