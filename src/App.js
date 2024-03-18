import { useState } from 'react';
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

  return (
    <div className="App">
      <OptionsPanel
        getters={{ selectedTemplate, selectedWood, selectedColor, size, fields }}
        setters={{
          setSelectedTemplate,
          setSelectedWood,
          setSelectedColor,
          setSize,
          setFields,
        }}
      />
      <Canvas
        template={selectedTemplate}
        wood={selectedWood}
        color={selectedColor}
        fields={fields}
        setFields={setFields}
        size={size}
      />
    </div>
  );
}

export default App;
