import { useState } from 'react';
import './App.css';
import './fonts.css';
import Canvas from './components/Canvas';
import OptionsPanel from './components/OptionsPanel';
import { valuesContext } from './contexts';
import { useMemo } from 'react';

function App() {
  const [selectedTemplate, setSelectedTemplate] = useState({ id: 0 });
  const [selectedWood, setSelectedWood] = useState({
    id: 0,
    url: 'https://th.bing.com/th/id/OIP.xCvGaX_HDOIVyGtBmUg44QHaFj?pid=ImgDet&rs=1',
  });
  const [selectedColor, setSelectedColor] = useState({ id: 100, value: 'white' });
  const [size, setSize] = useState('48x48');
  const [fields, setFields] = useState([]);
  const [fonts, setFonts] = useState([
    'Roboto',
    'Open Sans',
    'Montserrat',
    'Lato',
    'Raleway',
    'Poppins',
    'Nunito',
    'Source Sans Pro',
    'Oswald',
    'Ubuntu',
    'Helvetica',
    'Times New Roman',
    'Courier New',
    'Verdana',
    'Georgia',
    'Comic Sans MS',
    'Trebuchet MS',
    'Arial Black',
    'Impact',
    'Pacifico',
    'Caveat',
    'Amatic SC',
    'Indie Flower',
    'Great Vibes',
    'Dancing Script',
    'Permanent Marker',
    'Josefin Sans',
    'Playfair Display',
    'Quicksand',
    'Exo',
    'Baloo',
    'Comfortaa',
    'Orbitron',
    'Press Start 2P',
    'Chewy',
    'Faster One',
    'Luckiest Guy',
    'Roboto Mono',
    'Inconsolata',
  ]);
  const [font, setFont] = useState(fonts[0]);
  const [saveSvg, setSaveSvg] = useState();

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
    }),
    [selectedTemplate, selectedWood, selectedColor, size, fields, fonts, font]
  );

  return (
    <div className="App">
      <valuesContext.Provider value={values}>
        {/* add use context*/}
        <OptionsPanel />
        <Canvas setSaveSvg={setSaveSvg} />
        <button
          className="saveSvg"
          onClick={() => {
            saveSvg();
            setSelectedTemplate({
              id: 0,
              name: 'Round Simple',
              path: 'template1.svg',
            });
          }}
        >
          Save SVG
        </button>
      </valuesContext.Provider>
    </div>
  );
}

export default App;
