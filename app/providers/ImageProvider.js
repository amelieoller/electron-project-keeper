import React, { createContext, useState, useEffect } from 'react';

export const ImageContext = createContext();

const ImageProvider = ({ children }) => {
  const [images, setImages] = useState([]);

  useEffect(() => {
    const importAll = r => {
      let images = {};
      r.keys().map((item, index) => {
        images[item.replace('./', '')] = r(item).default;
      });
      
      return images;
    };

    const importedImages = importAll(
      require.context('../assets/unDraw', false, /\.(png|svg)$/)
    );

    setImages(importedImages);
  }, []);

  return (
    <ImageContext.Provider
      value={{
        images
      }}
    >
      {children}
    </ImageContext.Provider>
  );
};

export default ImageProvider;
