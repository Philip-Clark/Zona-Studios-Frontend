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
  const [selectedWood, setSelectedWood] = useState({});
  const [selectedColor, setSelectedColor] = useState({ id: 100, value: '#ffffff' });
  const [size, setSize] = useState('1x1');
  const [variant, setVariant] = useState({});
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
  const [templates, setTemplates] = useState([1, 2, 3, 4, 5, 6]);
  const [colors, setColors] = useState([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15]);
  const [woods, setWoods] = useState([1, 2, 3, 4, 5]);
  const [variants, setVariants] = useState([]);

  useEffect(() => {
    async function fetchData() {
      const response = await fetch(process.env.REACT_APP_BACKEND_URL + '/api/data').then((res) =>
        res.json()
      );
      try {
        if (response.data.templates) setTemplates(response.data.templates);
        if (response.data.colors) setColors(response.data.colors);
        if (response.data.woods) setWoods(response.data.woods);
        if (response.data.variants) setVariants(response.data.variants);
      } catch (e) {
        console.log(e);
      }

      setSize(response.data.variants[0].size.split(' ')[0]);
      setVariant(response.data.variants[0]);
      setSelectedTemplate(response.data.templates[0]);
      setSelectedWood(response.data.woods[0]);
      setSelectedColor(response.data.colors[0]);
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
    setFilename(fileNameIdentifiers.join('_').replaceAll(',', '-').replaceAll(' ', '-'));
  }, [fields, selectedTemplate]);

  const values = useMemo(
    () => ({
      selectedTemplate,
      selectedWood,
      selectedColor,
      colors,
      size,
      woods,
      fields,
      setVariant,
      variant,
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
      variants,
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
      variants,
      variant,
      woods,
      colors,
      templates,
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
