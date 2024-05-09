import { useEffect, useState } from 'react';
import './App.css';
import Canvas from './components/Canvas';
import OptionsPanel from './components/OptionsPanel';
import { valuesContext } from './contexts';
import { useMemo } from 'react';
import { fontsList } from './definitions/fonts';
import { BuyWithShopify } from './components/BuyWithShopify';
import MobileNav from './components/MobileNav';

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
  const [filename, setFilename] = useState('CustomSign');
  const [isMobile, setIsMobile] = useState(false);
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });
  const [preparingCart, setPreparingCart] = useState(false);
  const [templates, setTemplates] = useState([]);
  const [colors, setColors] = useState([]);

  useEffect(() => {
    async function fetchData() {
      const response = await fetch(process.env.REACT_APP_BACKEND_URL + '/api/data').then((res) =>
        res.json()
      );

      if (response.data.templates) setTemplates(response.data.templates);
      if (response.data.colors) setColors(response.data.colors);
    }
    fetchData();
  }, []);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 800);
      setWindowSize({ width: window.innerWidth, height: window.innerHeight });
    };
    window.addEventListener('resize', handleResize);
    handleResize();
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    let fileNameIdentifiers = [fields.map((field) => field.text)];
    fileNameIdentifiers.push(selectedTemplate.name);
    setFilename(fileNameIdentifiers.join('_'));
  }, [fields, selectedTemplate]);

  const values = useMemo(
    () => ({
      selectedTemplate,
      selectedWood,
      selectedColor,
      colors,
      size,
      fields,
      fonts,
      font,
      setSelectedTemplate,
      templates,
      setSelectedWood,
      setSelectedColor,
      setSize,
      setFields,
      setFont,
      shouldSave,
      canvas,
      setCanvas,
      setShouldSave,
      filename,
      setFilename,
      windowSize,
      preparingCart,
      setPreparingCart,
    }),
    [
      selectedTemplate,
      selectedWood,
      selectedColor,
      size,
      fields,
      fonts,
      font,
      shouldSave,
      preparingCart,
      canvas,
      filename,
      windowSize,
    ]
  );

  const handleSaveSvg = async () => {
    setShouldSave(true);
  };

  return (
    <div className="App">
      <valuesContext.Provider value={values}>
        <div className="container">
          {!isMobile && <OptionsPanel />}
          <Canvas />
          {!isMobile && <BuyWithShopify />}
          {isMobile && <MobileNav />}
        </div>
      </valuesContext.Provider>
    </div>
  );
}

export default App;
