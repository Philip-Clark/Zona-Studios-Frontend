import ImageTracer from 'imagetracerjs';
import { smoothImage } from './pathTools';
import { potrace, init } from 'esm-potrace-wasm';
import { colorizeSVG } from './colorizeSVG';

const exportCurrentCanvas = async (fileName, canvas) => {
  await init();

  canvas.renderAll();
  const context = canvas.getContext('2d');
  const imageData = context.getImageData(0, 0, canvas.width, canvas.height);

  const svgString = await potrace(imageData, {
    turdsize: 10,
    turnpolicy: 'majority',
    opticurve: 1,
    alphamax: 1,
    opttolerance: 1,
    svg: true,
  });
  const cleanedSVG = svgString.match(/<svg.*<\/svg>/s)[0];
  return cleanedSVG;
};

const saveForeground = (canvas) => {
  const objects = [...canvas.getObjects()];
  objects.forEach((object) => {
    object.set({ selectable: false });
    if (object.id.includes('background'))
      return object.set({ fill: 'transparent', stroke: 'transparent' });
    object.set({ shadow: 'none', stroke: 'transparent', fill: 'red' });
    canvas.renderAll();
  });
  return exportCurrentCanvas(`foreground`, canvas);
};

const saveBackground = (canvas) => {
  const objects = [...canvas.getObjects()];
  objects.forEach((object) => {
    object.set({ selectable: false });
    object.set({ shadow: 'none', stroke: 'blue', fill: 'blue' });
    canvas.renderAll();
  });
  return exportCurrentCanvas(`background`, canvas);
};

const saveCanvas = async (canvas) => {
  const zoom = 4;
  canvas.setHeight(`${400 * zoom}`);
  canvas.setWidth(`${400 * zoom}`);
  canvas.setZoom(zoom);
  canvas.discardActiveObject().renderAll();
  const backgroundString = await saveBackground(canvas);
  const foregroundString = await saveForeground(canvas);

  const colorizedForeground = colorizeSVG(foregroundString, 'red');
  const colorizedBackground = colorizeSVG(backgroundString, 'blue');

  canvas.clear();
  return { foregroundString: colorizedForeground, backgroundString: colorizedBackground };
};

export { exportCurrentCanvas, saveCanvas };
