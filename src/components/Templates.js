import React, { useEffect, useState } from 'react';
import { templates as defaultTempalates } from '../definitions/templates';
import { useContext } from 'react';
import { valuesContext } from '../contexts';

export default function Templates() {
  const context = useContext(valuesContext);
  const [templateCount, setTemplateCount] = useState(3);

  return (
    <div>
      <h2> Choose Template </h2>
      <div className="templates">
        {context.templates.slice(0, templateCount).map((template) => {
          return (
            <button
              key={template.id}
              data-selected={context.selectedTemplate.id === template.id ? true : false}
              onClick={() => {
                if (template.path === '') return;
                context.setSelectedTemplate(template);
              }}
              style={{
                backgroundImage: `url(${template.image})`,
              }}
              className="templateButton"
            ></button>
          );
        })}
      </div>
      <button
        className="moreTemplatesButton"
        onClick={() => {
          if (templateCount === context.templates.length) setTemplateCount(3);
          else setTemplateCount(context.templates.length);
        }}
      >
        {templateCount === context.templates.length ? 'Less Templates' : 'More Templates'}
      </button>
    </div>
  );
}
