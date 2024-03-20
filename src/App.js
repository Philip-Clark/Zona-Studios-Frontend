import { useEffect, useState } from 'react';
import './App.css';
import './fonts.css';
import Canvas from './Canvas';
import OptionsPanel from './optionsPanel';

function App() {
  const [selectedTemplate, setSelectedTemplate] = useState({
    id: 0,
    name: 'Round Simple',
    path: 'template1.svg',
  });
  const [selectedWood, setSelectedWood] = useState({
    id: 0,
    url: 'https://th.bing.com/th/id/OIP.xCvGaX_HDOIVyGtBmUg44QHaFj?pid=ImgDet&rs=1',
  });
  const [selectedColor, setSelectedColor] = useState({
    id: 100,
    value: 'white',
  });
  const [size, setSize] = useState('16x16');
  const [fields, setFields] = useState([]);
  const [lastName, setLastName] = useState('Doe');
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
  useEffect(() => {
    console.log('font:', font);
  }, [font]);

  return (
    <div className="App">
      <OptionsPanel
        getters={{ selectedTemplate, selectedWood, selectedColor, size, fields, fonts }}
        setters={{
          setSelectedTemplate,
          setSelectedWood,
          setSelectedColor,
          setSize,
          setFields,
          setFont,
        }}
      />
      <Canvas
        template={selectedTemplate}
        wood={selectedWood}
        color={selectedColor}
        fields={fields}
        setFields={setFields}
        size={size}
        font={font}
        fonts={fonts}
        setSaveSvg={setSaveSvg}
      />
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
    </div>
  );
}

export default App;
