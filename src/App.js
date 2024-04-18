import { useState } from 'react';
import './App.css';
import Canvas from './components/Canvas';
import OptionsPanel from './components/OptionsPanel';
import { valuesContext } from './contexts';
import { useMemo } from 'react';
import { fontsList } from './definitions/fonts';
import { BuyWithShopify } from './components/BuyWithShopify';

function App() {
  const [selectedTemplate, setSelectedTemplate] = useState({ id: 0 });
  const [selectedWood, setSelectedWood] = useState({
    id: 0,
    url: 'https://th.bing.com/th/id/OIP.xCvGaX_HDOIVyGtBmUg44QHaFj?pid=ImgDet&rs=1',
  });
  const [selectedColor, setSelectedColor] = useState({ id: 100, value: '#ffffff' });
  const [size, setSize] = useState('48x48');
  const [fields, setFields] = useState([]);
  const [fonts, setFonts] = useState(fontsList);
  const [font, setFont] = useState(fonts[0]);
  const [shouldSave, setShouldSave] = useState(false);
  const [canvas, setCanvas] = useState(null);

  const values = useMemo(
    () => ({
      selectedTemplate,
      selectedWood,
      selectedColor,
      size,
      fields,
      fonts,
      font,
      setSelectedTemplate,
      setSelectedWood,
      setSelectedColor,
      setSize,
      setFields,
      setFont,
      shouldSave,
      canvas,
      setCanvas,
      setShouldSave,
    }),
    [selectedTemplate, selectedWood, selectedColor, size, fields, fonts, font, shouldSave]
  );

  const handleSaveSvg = async () => {
    setShouldSave(true);
  };

  return (
    <div className="App">
      <valuesContext.Provider value={values}>
        {/* add use context*/}
        <OptionsPanel />
        <Canvas />
        <button className="saveSvg" onClick={handleSaveSvg}>
          Save SVG
        </button>
        <BuyWithShopify />
      </valuesContext.Provider>
    </div>
  );
}

export default App;
