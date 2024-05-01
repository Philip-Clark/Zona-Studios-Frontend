import React, { useContext } from 'react';
import { valuesContext } from '../contexts';
import { woods } from '../definitions/woods';

const MobileWood = () => {
  return (
    <div style={{ overflowX: 'scroll', whiteSpace: 'nowrap' }}>
      {woods.map((wood) => (
        <button
          key={wood.id}
          style={{
            width: '100px',
            height: '100px',
            margin: '10px',
            background: `url(${wood.url})`,
          }}
        ></button>
      ))}
    </div>
  );
};

export default MobileWood;
