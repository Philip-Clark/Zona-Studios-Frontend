import React, { useContext, useEffect } from 'react';
import { valuesContext } from '../contexts';
import { templates } from '../definitions/templates';

export default function MobileTemplates() {
  const context = useContext(valuesContext);

  const handleTemplateSelection = (e, template) => {
    context.setSelectedTemplate(template);
    e.target.parentNode.scrollLeft = e.target.offsetLeft - window.innerWidth / 2.5;
  };

  useEffect(() => {
    const active = document.querySelector('.horizontal-scroll.mobileTemplate #active');
    if (!active) return;

    active.parentNode.style.scrollBehavior = 'auto';
    const scroll = active.offsetLeft;
    active.parentNode.scrollLeft = scroll - window.innerWidth / 2.5;
    active.parentNode.style.scrollBehavior = 'smooth';
  }, []);

  return (
    <div className="horizontal-scroll mobileTemplate">
      {templates.map((template) => (
        <button
          className="horizontal-scroll-item"
          key={template.id}
          style={{
            backgroundImage: `url(${process.env.PUBLIC_URL}/templates/templateImages/${template.image})`,
          }}
          onClick={(e) => handleTemplateSelection(e, template)}
          id={context.selectedTemplate.id === template.id ? 'active' : 'stale'}
        ></button>
      ))}
    </div>
  );
}
