import React, { useContext, useEffect } from 'react';
import { valuesContext } from '../contexts';

export default function MobileSize() {
  const { setSize, size, variants, setVariant } = useContext(valuesContext);
  const sizes = variants.map((variant) => {
    return variant.size.split(' ')[0];
  });

  const handleSizeSelection = (e, size) => {
    setSize(`${size}`);
    setVariant(variants.find((v) => v.size.includes(size)));
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
          onClick={(e) => handleSizeSelection(e, _size)}
          id={_size === size ? 'active' : 'stale'}
        >
          {_size}"
        </button>
      ))}
    </div>
  );
}
