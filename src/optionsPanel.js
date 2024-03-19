import { useState } from 'react';
import './optionsPanel.css';
import { PhotoSizeSelectActual } from '@mui/icons-material';

const templates = [
  { id: 0, name: 'Round Simple', path: 'template1.svg' },
  { id: 1, name: 'Rectangle simple', path: 'template2.svg' },
  { id: 2, name: 'Cutout simple', path: 'svg (10).svg' },
  { id: 3, name: 'TEST', path: 'Frame 24.svg' },
  { id: 4, name: '---', path: '' },
  { id: 5, name: '---', path: '' },
  { id: 6, name: '---', path: '' },
  { id: 7, name: '---', path: '' },
];

const woods = [
  { id: 0, url: 'https://th.bing.com/th/id/OIP.xCvGaX_HDOIVyGtBmUg44QHaFj?pid=ImgDet&rs=1' },
  { id: 1, url: 'https://th.bing.com/th/id/OP.ViaeowvgrZgMGg474C474?o=5&pid=21.1&w=160&h=161' },
  { id: 2, url: 'https://th.bing.com/th/id/OP.lkwMxDJEHlH6lw474C474?o=5&pid=21.1&w=160&h=161' },
  {
    id: 3,
    url: 'https://th.bing.com/th/id/OIP.Huc9cFLeA6B1x6GU1io-iAHaHa?pid=ImgDet&w=196&h=196&c=7',
  },
  {
    id: 4,
    url: 'https://th.bing.com/th/id/OIP.4g0Wkiu9ZwUAC_EqdjuK7gHaHa?pid=ImgDet&w=196&h=196&c=7',
  },
  {
    id: 5,
    url: 'https://th.bing.com/th/id/OIP.EeKGZY5j84saErX_IJTLSQHaHa?pid=ImgDet&w=196&h=196&c=7',
  },
];

const colors = [
  {
    id: 100,
    value: 'white',
  },
  {
    id: 101,
    value: 'pink',
  },
  {
    id: 102,
    value: '#8caf83',
  },
  {
    id: 103,
    value: '#8499ae',
  },
  {
    id: 104,
    value: '#A47FB0',
  },
  {
    id: 105,
    value: '#4D3440',
  },
  {
    id: 106,
    value: '#0D3032',
  },
  {
    id: 107,
    value: '#565656',
  },
  {
    id: 108,
    value: '#1E1E1E',
  },
];

const sizes = ['16x16', '24x24', '36x36', '48x48'];
const OptionsPanel = ({ getters, setters }) => {
  const [templateCount, setTemplateCount] = useState(6);
  return (
    <div className="optionsPanel">
      <h2> Choose Template </h2>
      <div className="templates">
        {templates.slice(0, templateCount).map((template) => {
          return (
            <button
              key={template.id}
              data-selected={getters.selectedTemplate.id === template.id ? true : false}
              onClick={() => {
                setters.setSelectedTemplate(template);
              }}
              className="templateButton"
            >
              {template.name}
            </button>
          );
        })}
      </div>
      <button
        className="moreTemplatesButton"
        onClick={() => {
          if (templateCount === -1) setTemplateCount(6);
          else setTemplateCount(-1);
        }}
      >
        {templateCount === -1 ? 'Less Templates' : 'More Templates'}
      </button>

      <h2> Size </h2>
      <select
        className="sizeSelect"
        title="Sign size"
        onChange={(e) => {
          setters.setSize(e.target.value);
        }}
      >
        {sizes.map((size) => {
          return <option value={size}> {size} </option>;
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
              data-selected={getters.selectedWood.id === wood.id ? true : false}
              style={{ background: `url(${wood.url})` }}
              onClick={() => {
                setters.setSelectedWood(wood);
              }}
            />
          );
        })}
      </div>
      <h3> Text </h3>
      <div className="names">
        {getters.fields.map((field) => (
          <input
            key={field.id}
            type="text"
            className="field"
            placeholder={''}
            onChange={(e) => {
              field.text = e.target.value;
              console.log(field);
              setters.setFields(getters.fields.map((f) => (f.id === field.id ? field : f)));
            }}
          />
        ))}
      </div>
      <div className="colors">
        {colors.map((color) => {
          return (
            <button
              key={color.id}
              className="color"
              data-selected={getters.selectedColor.id === color.id ? true : false}
              onClick={() => {
                setters.setSelectedColor(color);
              }}
              style={{ background: color.value }}
              value={color}
            />
          );
        })}
      </div>
      <div className="colors">
        {woods.map((wood) => {
          return (
            <button
              key={wood.id}
              className="color"
              data-selected={getters.selectedColor.id === wood.id ? true : false}
              onClick={() => {
                setters.setSelectedColor(wood);
              }}
              style={{ background: `url(${wood.url})` }}
              value={wood}
            />
          );
        })}
      </div>
    </div>
  );
};

export default OptionsPanel;
