import React, { useContext, useEffect } from 'react';
import { valuesContext } from '../contexts';
import { woods } from '../definitions/woods';
import { colors } from '../definitions/colors';

export default function MobileWood() {
  const { setSelectedWood, selectedWood, setSelectedColor, selectedColor } =
    useContext(valuesContext);

  const handleWoodSelection = (e, wood) => {
    setSelectedWood(wood);
    e.target.parentNode.scrollLeft = e.target.offsetLeft - window.innerWidth / 2.5;
  };

  const handleColorSelection = (e, color) => {
    setSelectedColor(color);
    e.target.parentNode.scrollLeft = e.target.offsetLeft - window.innerWidth / 2.5;
  };

  useEffect(() => {
    const active = document.querySelector('.horizontal-scroll.mobileWood #active');
    if (!active) return;

    active.parentNode.style.scrollBehavior = 'auto';
    const scroll = active.offsetLeft;
    active.parentNode.scrollLeft = scroll - window.innerWidth / 2.5;
    active.parentNode.style.scrollBehavior = 'smooth';
  }, []);

  return (
    <div className="MobileStep woodAndColor">
      <div className="horizontal-scroll mobileWood">
        {woods.map((wood) => (
          <button
            key={wood.id}
            className="horizontal-scroll-item wood"
            style={{
              backgroundImage: `url(${wood.url})`,
            }}
            onClick={(e) => handleWoodSelection(e, wood)}
            id={selectedWood.id === wood.id ? 'active' : 'stale'}
          ></button>
        ))}
      </div>

      <div className="horizontal-scroll mobileColor">
        {colors.map((color) => (
          <button
            key={color.id}
            className="horizontal-scroll-item color"
            style={{
              backgroundColor: color.value,
            }}
            onClick={(e) => handleColorSelection(e, color)}
            id={selectedColor.id === color.id ? 'active' : 'stale'}
          ></button>
        ))}
      </div>
    </div>
  );
}
