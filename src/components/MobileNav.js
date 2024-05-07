import React, { useState } from 'react';
import '../mobileNav.css';
import MobileTemplates from './MobileTemplates';
import MobileWood from './MobileWood';
import MobileSize from './MobileSize';
import MobileInputs from './MobileInputs';
import MobileCustomizer from './MobileCustomizer';
import MobilePurchase from './MobilePurchase';

import { FaImage } from 'react-icons/fa';
import { FaRulerCombined } from 'react-icons/fa';
import { FaSwatchbook } from 'react-icons/fa';
import { FaKeyboard } from 'react-icons/fa';
import { FaSliders } from 'react-icons/fa6';
import { FaShoppingCart } from 'react-icons/fa';

const stepIcons = [
  <FaImage />,
  <FaRulerCombined />,
  <FaKeyboard />,
  <FaSwatchbook />,
  // <FaSliders />,
  <FaShoppingCart />,
];

const stepComponentDictionary = {
  0: <MobileTemplates />,
  1: <MobileSize />,
  2: <MobileInputs />,
  3: <MobileWood />,
  // 4: <MobileCustomizer />,
  4: <MobilePurchase />,
};
const MobileNav = () => {
  const steps = 5;
  const [step, setStep] = useState(0);

  const handleNextStep = () => {
    setStep(step + 1);
  };
  const handlePrevStep = () => {
    setStep(step - 1);
  };

  return (
    <div className="mobileNav">
      <div className="steps">{stepComponentDictionary[step]}</div>
      <div className="stepButtons">
        {Array.from({ length: steps }, (_, index) => (
          <button
            key={index}
            onClick={() => setStep(index)}
            id={step === index ? 'active' : 'stale'}
          >
            {stepIcons[index]}
          </button>
        ))}
      </div>

      <div className="stepper">
        <button onClick={handlePrevStep} disabled={step === 0}>
          Previous
        </button>
        <span>
          Step {step + 1}/{steps}
        </span>
        <button onClick={handleNextStep} disabled={step === 5}>
          Next
        </button>
      </div>
    </div>
  );
};

export default MobileNav;
