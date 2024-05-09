import React, { useContext, useEffect } from 'react';
import { valuesContext } from '../contexts';

export default function MobileSize() {
  const { setSize, size, sizes } = useContext(valuesContext);

  const handleSizeSelection = (e, size) => {
    setSize(`${size}`);
    e.target.parentNode.scrollLeft = e.target.offsetLeft - window.innerWidth / 2.5;
  };

  useEffect(() => {
    const active = document.querySelector('.horizontal-scroll.mobileSize #active');
    if (!active) return;

    active.parentNode.style.scrollBehavior = 'auto';
    const scroll = active.offsetLeft;
    active.parentNode.scrollLeft = scroll - window.innerWidth / 2.5;
    active.parentNode.style.scrollBehavior = 'smooth';
  }, []);

  return (
    <div className="horizontal-scroll mobileSize MobileStep">
      {sizes.map((_size, id) => (
        <button
          key={id}
          className="horizontal-scroll-item size-button"
          onClick={(e) => handleSizeSelection(e, _size.id)}
          id={_size.id === size ? 'active' : 'stale'}
        >
          {_size.size}"
        </button>
      ))}
    </div>
  );
}
