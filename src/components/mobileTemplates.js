import React, { useContext } from 'react';
import { valuesContext } from '../contexts';
import { templates } from '../definitions/templates';

export default function MobileTemplates() {
  const context = useContext(valuesContext);

  const handleTemplateSelection = (template) => {
    context.setSelectedTemplate(template);
  };

  return (
    <div style={{ overflowX: 'scroll', whiteSpace: 'nowrap' }}>
      {templates.map((template) => (
        <button
          key={template.id}
          style={{
            width: '100px',
            height: '100px',
            margin: '10px',
            backgroundColor: template.color,
          }}
          onClick={() => handleTemplateSelection(template)}
          id={context.selectedTemplate.id === template.id ? 'active' : 'stale'}
        >
          {template.name}
        </button>
      ))}
    </div>
  );
}
