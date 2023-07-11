import { useState } from 'react';
import './App.css';
import Canvas from './Canvas';
import OptionsPanel from './optionsPanel';

function App() {
  const [selectedTemplate, setSelectedTemplate] = useState(0);
  const [selectedWood, setSelectedWood] = useState(0);
  const [selectedColor, setSelectedColor] = useState(0);
  const [size, setSize] = useState('16x16');
  const [firstName, setFirstName] = useState('John');
  const [lastName, setLastName] = useState('Doe');

  return (
    <div className="App">
      <OptionsPanel
        getters={{ selectedTemplate, selectedWood, selectedColor, size, firstName, lastName }}
        setters={{
          setSelectedTemplate,
          setSelectedWood,
          setSelectedColor,
          setSize,
          setFirstName,
          setLastName,
        }}
      />
      <Canvas
        template={selectedTemplate}
        wood={selectedWood}
        color={selectedColor}
        firstName={firstName}
        lastName={lastName}
        size={size}
      />
    </div>
  );
}

export default App;
