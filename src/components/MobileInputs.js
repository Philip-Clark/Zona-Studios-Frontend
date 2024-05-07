import React, { useContext, useState } from 'react';
import { valuesContext } from '../contexts';

export default function MobileInputs() {
  const context = useContext(valuesContext);
  const [subStep, setSubStep] = useState(0);
  return (
    <div className="MobileStep">
      {context.fields.map((field, index) => (
        <div key={field.id} className="substep" id={subStep === index ? 'active' : 'stale'}>
          <label>{field.id}</label>
          <input
            type="text"
            value={field.text}
            onChange={(e) => {
              field.text = e.target.value;
              context.setFields(context.fields.map((f) => (f.id === field.id ? field : f)));
            }}
          />
        </div>
      ))}

      <div className="substepper">
        {context.fields.map((field, index) => (
          <button id={index === subStep ? 'active' : 'stale'} onClick={() => setSubStep(index)}>
            {index + 1}
            <svg
              width="79"
              height="38"
              viewBox="0 0 79 38"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M59 38C59 16.5 79 16 79 16H59V38Z" fill="white" />
              <path d="M20 38C20 16.5 0 16 0 16H20V38Z" fill="white" />
              <path d="M59 38V16H20V38L59 38Z" fill="white" />
              <path d="M59 16H79V1.5L0 0.5V16H20H59Z" fill="white" />
            </svg>
          </button>
        ))}
      </div>
    </div>
  );
}
