import React from 'react';
import { ImageContext } from '../providers/ImageProvider';

const getDisplayName = WrappedComponent => {
  return WrappedComponent.displayName || WrappedComponent.name || 'Component';
};

const withImages = Component => {
  const WrappedComponent = props => {
    return (
      <ImageContext.Consumer>
        {({ images }) => <Component images={images} {...props} />}
      </ImageContext.Consumer>
    );
  };

  WrappedComponent.displayName = `WithImages(${getDisplayName(WrappedComponent)})`;

  return WrappedComponent;
};

export default withImages;
