import React, { useContext, useEffect } from 'react';
import { valuesContext } from '../contexts';
import { sizes } from '../definitions/sizes';

export default function MobileSize() {
  const { setSize, size } = useContext(valuesContext);

  const handleSizeSelection = (size) => {
    setSize(`${size}`);
  };

  useEffect(() => {
    console.log(size);
  }, [size]);

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
          onClick={() => handleSizeSelection(size)}
        >
          {size}X{size}
        </button>
      ))}
    </div>
  );
}
