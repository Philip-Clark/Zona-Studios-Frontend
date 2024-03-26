import React, { useState } from 'react';
import { templates } from '../definitions/templates';
import { useContext } from 'react';
import { valuesContext } from '../contexts';

export default function Templates() {
  const context = useContext(valuesContext);
  const [templateCount, setTemplateCount] = useState(6);

  return (
    <div>
      <h2> Choose Template </h2>
      <div className="templates">
        {templates.slice(0, templateCount).map((template) => {
          return (
            <button
              key={template.id}
              data-selected={context.selectedTemplate.id === template.id ? true : false}
              onClick={() => {
                context.setSelectedTemplate(template);
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
    </div>
  );
}
