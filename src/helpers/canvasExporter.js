import removeIntersections from './removeIntersections';
import TextToSVG, { loadTextToSVG } from './textToSvg';
import { fabric } from 'fabric';
import { resolve } from 'path-browserify';

const exportCurrentCanvas = (fileName, canvas) => {
  canvas.renderAll();
  const a = document.createElement('a');
  const svg = canvas.toSVG({ suppressPreamble: true, encoding: 'utf-8' });

  a.download = `${fileName}.svg`;
  a.href = `data:image/svg+xml,${encodeURIComponent(svg)}`;
  a.click();
};

const saveCanvas = async (canvas) => {
  const objects = [...canvas.getObjects()];

  objects.forEach((object) => {
    if (object.id.includes('background')) return object.set({ fill: 'blue', stroke: 'blue' });
    object.set({ shadow: 'none', stroke: 'none', fill: 'red' });
    canvas.renderAll();
  });

  exportCurrentCanvas(`text`, canvas);
};

export { exportCurrentCanvas, saveCanvas };
