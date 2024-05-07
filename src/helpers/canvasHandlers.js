import { resolve } from 'path-browserify';
import { loadAndUseFont } from './fontLoader';
import { convertTextToPath } from './textToSvg';
import { fabric } from 'fabric';

function applyPattern(url, shape, canvas) {
  fabric.Image.fromURL(
    url,
    function (img) {
      const pattern = new fabric.Pattern(
        {
          source: img._element,
          repeat: 'repeat',
        },
        (pattern) => {
          shape.set('stroke', pattern);
          shape.set('fill', pattern);
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
  const children = object._objects;
  children.forEach((child) => {
    child.set('fontFamily', fontFamily);
  });
  canvas?.requestRenderAll();
};

const handleColorChange = (color, canvas) => {
  const objectsActive =
    canvas?.getActiveObjects() === undefined || canvas?.getActiveObjects().length > 0;

  const objectsToPaint = objectsActive ? canvas?.getActiveObjects() : canvas?._objects;
  console.log({ objectsToPaint });
  objectsToPaint?.forEach((object) => {
    if (object.id.includes('background')) return;

    object.set('fill', color.value);
  });
};

const handleTextChange = (text, id, canvas) => {
  canvas?._objects.forEach(async (object) => {
    const pureId = id.replace('foreground', '').replaceAll('  ', '');
    if (!object.id.includes(pureId)) return;
    object.set({ text: text });
    canvas?.renderAll();
    if (object.width * object.scaleX > canvas?.width / 4) object.scaleToWidth(canvas?.width);
    canvas?.renderAll();
  });
};

const handleFontChange = (font, canvas) => {
  const object = canvas?.getActiveObject();
  if (!object) return;
  object.set('fontFamily', font);
  canvas?._objects.forEach((obj) => {
    if (obj.id.includes(object.id.replace('foreground', ''))) {
      obj.set('fontFamily', font);
    }
  });
};

const handleSizeChange = (size, canvas) => {
  console.log({ size });
  canvas?.set('centeredScaling', true);
  const intSize = parseInt(size.split('x')[0]);
  const scaleRatio = intSize / 48;
  document.querySelector('.editor').style.transform = `scale(${scaleRatio / 4})`;
};

const handleWoodChange = (wood, canvas) => {
  canvas?._objects.forEach((object) => {
    if (object.id.includes('background')) applyPattern(wood.url, object, canvas);
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
