import React, { useContext } from 'react';
import { valuesContext } from '../contexts';
import { sizes } from '../definitions/sizes';

const MobileSize = () => {
  return (
    <div style={{ overflowX: 'scroll', whiteSpace: 'nowrap' }}>
      {sizes.map((size, id) => (
        <button
          key={id}
          style={{
            width: '100px',
            height: '100px',
            margin: '10px',
          }}
        >
          {size}X{size}
        </button>
      ))}
    </div>
  );
};

export default MobileSize;
