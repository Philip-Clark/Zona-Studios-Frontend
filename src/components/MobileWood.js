import React, { useContext } from 'react';
import { valuesContext } from '../contexts';
import { woods } from '../definitions/woods';

export default function MobileWood() {
  const { setSelectedWood, selectedWood } = useContext(valuesContext);

  const handleWoodSelection = (wood) => {
    setSelectedWood(wood);
  };
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
          onClick={() => handleWoodSelection(wood)}
          id={selectedWood.id === wood.id ? 'active' : 'stale'}
        ></button>
      ))}
    </div>
  );
}
