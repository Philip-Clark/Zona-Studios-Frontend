import { resolve } from 'path-browserify';
import { loadAndUseFont } from './fontLoader';
import { convertTextToPath } from './textToSvg';
import { fabric } from 'fabric';

function applyPattern(url, shape, patternArea, canvas) {
  fabric.Image.fromURL(
    url,
    function (img) {
      const pattern = new fabric.Pattern(
        {
          source: img._element,
          repeat: 'repeat',
        },
        (pattern) => {
          shape.set(patternArea, pattern);
          canvas.renderAll();
        }
      );
    },
    {
      crossOrigin: 'anonymous',
    }
  );
}

const applyFont = async (fontFamily, canvas, object) => {
  object.set('fontFamily', fontFamily);
  canvas?.requestRenderAll();
};

const handleColorChange = (color, canvas) => {
  console.log(color);
  const objectsActive =
    canvas?.getActiveObjects() === undefined || canvas?.getActiveObjects().length > 0;
  console.log(objectsActive);

  const objectsToPaint = objectsActive ? canvas?.getActiveObjects() : canvas?._objects;
  console.log(objectsToPaint);

  objectsToPaint?.forEach((object) => {
    if (object.id.includes('background')) return;
    object.set('fill', color.value);
  });
};

const handleTextChange = (text, id, canvas) => {
  canvas?._objects.forEach(async (object) => {
    console.log(object.id);
    if (!object.id.includes(id)) return;
    object.set({ text: text });
    canvas?.renderAll();
    if (object.width * object.scaleX > canvas?.width / 4) object.scaleToWidth(canvas?.width);
    canvas?.renderAll();
  });
};

const handleFontChange = (font, canvas) => {
  canvas?.getActiveObjects().map(async (object) => {
    object.set({ fontFamily: font });
  });
};

const handleSizeChange = (size, canvas) => {
  canvas?.set('centeredScaling', true);
  const intSize = parseInt(size.split('x')[0]);
  const scaleRatio = intSize / 48;
  document.querySelector('.editor').style.transform = `scale(${scaleRatio / 4})`;
};

const handleWoodChange = (wood, canvas) => {
  canvas?._objects.forEach((object) => {
    if (!object.id.includes('background')) return;
    applyPattern(wood.url, object, 'fill', canvas);
  });
};

export {
  applyFont,
  handleColorChange,
  handleTextChange,
  handleFontChange,
  handleSizeChange,
  handleWoodChange,
};
