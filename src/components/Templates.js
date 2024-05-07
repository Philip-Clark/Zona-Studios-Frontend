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
                if (template.path === '') return;
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
          if (templateCount === templates.length) setTemplateCount(3);
          else setTemplateCount(templates.length);
        }}
      >
        {templateCount === templates.length ? 'Less Templates' : 'More Templates'}
      </button>
    </div>
  );
}
