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
  {
    id: 1,
    url: 'https://th.bing.com/th/id/OIP.UrFG9yalDeGS5YKswDRIzAHaHa?pid=ImgDet&w=400&h=400&c=7',
  },
  {
    id: 2,
    url: 'https://th.bing.com/th/id/OIP.jvYRRcZqETNGMt5JV8EDZQHaHa?pid=ImgDet&w=400&h=400&c=7',
  },
  {
    id: 3,
    url: 'https://th.bing.com/th/id/OIP.Huc9cFLeA6B1x6GU1io-iAHaHa?pid=ImgDet&w=400&h=400&c=7',
  },
  {
    id: 4,
    url: 'https://th.bing.com/th/id/OIP.4g0Wkiu9ZwUAC_EqdjuK7gHaHa?pid=ImgDet&w=400&h=400&c=7',
  },
  {
    id: 5,
    url: 'https://th.bing.com/th/id/OIP.EeKGZY5j84saErX_IJTLSQHaHa?pid=ImgDet&w=400&h=400&c=7',
  },
];

const colors = [
  {
    id: 107,
    value: 'hsl(0, 0%, 100%)',
  },
  {
    id: 100,
    value: 'hsl(0, 0%, 12%)',
  },
  {
    id: 101,
    value: 'hsl(180, 100%, 18%)',
  },
  {
    id: 102,
    value: 'hsl(210, 0%, 34%)',
  },
  {
    id: 103,
    value: 'hsl(340, 13%, 32%)',
  },
  {
    id: 104,
    value: 'hsl(278, 25%, 69%)',
  },
  {
    id: 105,
    value: 'hsl(210, 15%, 61%)',
  },
  {
    id: 106,
    value: 'hsl(120, 25%, 62%)',
  },
  {
    id: 129,
    value: 'hsl(0, 0%, 75%)',
  },
  {
    id: 110,
    value: 'hsl(330, 100%, 64%)',
  },
  {
    id: 111,
    value: 'hsl(180, 100%, 50%)',
  },
  {
    id: 112,
    value: 'hsl(16, 100%, 50%)',
  },
  {
    id: 113,
    value: 'hsl(300, 100%, 25%)',
  },
  {
    id: 114,
    value: 'hsl(32, 100%, 50%)',
  },
  {
    id: 115,
    value: 'hsl(120, 100%, 50%)',
  },
  {
    id: 116,
    value: 'hsl(330, 100%, 54%)',
  },
  {
    id: 117,
    value: 'hsl(200, 100%, 50%)',
  },
  {
    id: 118,
    value: 'hsl(16, 100%, 63%)',
  },
  {
    id: 119,
    value: 'hsl(271, 53%, 47%)',
  },
  {
    id: 120,
    value: 'hsl(90, 100%, 50%)',
  },
  {
    id: 121,
    value: 'hsl(280, 61%, 41%)',
  },
  {
    id: 122,
    value: 'hsl(300, 100%, 50%)',
  },
  {
    id: 123,
    value: 'hsl(180, 60%, 43%)',
  },
  {
    id: 124,
    value: 'hsl(39, 100%, 50%)',
  },
  {
    id: 125,
    value: 'hsl(0, 100%, 27%)',
  },
  {
    id: 126,
    value: 'hsl(120, 100%, 50%)',
  },
  {
    id: 127,
    value: 'hsl(275, 100%, 20%)',
  },
  {
    id: 128,
    value: 'hsl(0, 100%, 50%)',
  },
  {
    id: 108,
    value: 'hsl(50, 100%, 50%)',
  },
  {
    id: 109,
    value: 'hsl(50, 100%, 50%)',
  },
  {
    id: 130,
    value: 'hsl(0, 79%, 72%)',
  },
  {
    id: 131,
    value: 'hsl(33, 100%, 86%)',
  },
  {
    id: 132,
    value: 'hsl(270, 67%, 93%)',
  },
  {
    id: 133,
    value: 'hsl(17, 100%, 71%)',
  },
  {
    id: 134,
    value: 'hsl(302, 47%, 80%)',
  },
  {
    id: 135,
    value: 'hsl(350, 100%, 88%)',
  },
  {
    id: 136,
    value: 'hsl(220, 28%, 78%)',
  },
  {
    id: 137,
    value: 'hsl(351, 100%, 76%)',
  },
  {
    id: 138,
    value: 'hsl(28, 100%, 86%)',
  },
  {
    id: 139,
    value: 'hsl(54, 77%, 75%)',
  },
];

const sizes = ['16x16', '24x24', '36x36', '48x48'];
const OptionsPanel = ({ getters, setters }) => {
  const [templateCount, setTemplateCount] = useState(6);

  return (
    <div className="optionsPanel">
      <div className="scrollBox">
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
            <section key={field.id}>
              <label>{field.id}</label>
              <input
                type="text"
                className="field"
                placeholder={''}
                onChange={(e) => {
                  field.text = e.target.value;
                  setters.setFields(getters.fields.map((f) => (f.id === field.id ? field : f)));
                }}
              />
            </section>
          ))}
        </div>

        <select
          className="fonts"
          title="Font"
          onChange={(e) => {
            setters.setFont(e.target.value);
            console.log(e.target.value);
          }}
        >
          {getters.fonts.map((font) => {
            return (
              <option style={{ fontFamily: font }} key={font} value={font}>
                {font}
              </option>
            );
          })}
        </select>

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
      </div>
    </div>
  );
};

export default OptionsPanel;
