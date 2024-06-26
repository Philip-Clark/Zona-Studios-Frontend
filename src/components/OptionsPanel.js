import { useContext, useState } from 'react';
import '../optionsPanel.css';

//? DEFINITIONS
import { valuesContext } from '../contexts';
import Templates from './Templates';
import { BarLoader, GridLoader, SyncLoader } from 'react-spinners';

const OptionsPanel = () => {
  const {
    setSize,
    size,
    setSelectedWood,
    selectedWood,
    setSelectedColor,
    fields,
    setFields,
    setFont,
    colors,
    fonts,
    font,
    templates,
    variants,
    woods,
    setVariant,
    selectedColor,
    variant,
  } = useContext(valuesContext);

  const sizes = variants.map((variant) => {
    return variant.size.split(' ')[0];
  });

  return (
    <div className="optionsPanel">
      <div className="scrollBox">
        <Templates />

        <h2> Size </h2>
        <select
          className="sizeSelect"
          title="Sign size"
          value={size}
          defaultValue={size}
          onChange={(e) => {
            setSize(e.target.value);
            setVariant(variants.find((v) => v.size.includes(e.target.value)));
            console.log(variant);
          }}
        >
          {sizes.map((size) => {
            return (
              <option value={size}>
                {size}x{size} in
              </option>
            );
          })}
        </select>
        <h2> Customization </h2>
        <h3> Wood Type </h3>
        <div className="woods">
          {woods.map((wood) => {
            return (
              <button
                key={wood.id}
                className="wood"
                value={wood.id}
                data-selected={selectedWood.id === wood.id ? true : false}
                style={{ background: `url(${wood.url})` }}
                onClick={() => {
                  setSelectedWood(wood);
                }}
              />
            );
          })}
        </div>
        <h3> Text </h3>
        <div className="names">
          {fields.map((field) => (
            <section key={field.id}>
              <label>{field.id}</label>
              <input
                type="text"
                className="field"
                placeholder={''}
                onChange={(e) => {
                  field.text = e.target.value;
                  setFields(fields.map((f) => (f.id === field.id ? field : f)));
                }}
              />
            </section>
          ))}
        </div>

        {/* <select
          className="fonts"
          title="Font"
          value={font}
          onChange={(e) => {
            setFont(e.target.value);
          }}
        >
          {fonts.map((font) => {
            return (
              <option style={{ fontFamily: font }} key={font} value={font}>
                {font}
              </option>
            );
          })}
        </select> */}

        <div className="colors">
          {colors.map((color) => {
            return (
              <button
                key={color.id}
                className="color"
                data-selected={selectedColor?.id === color.id ? true : false}
                onClick={() => {
                  setSelectedColor(color);
                }}
                style={{ background: color.value }}
                value={color}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default OptionsPanel;
