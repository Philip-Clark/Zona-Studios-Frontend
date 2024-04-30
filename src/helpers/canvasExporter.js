import ImageTracer from 'imagetracerjs';
import { smoothImage } from './pathTools';
import { potrace, init } from 'esm-potrace-wasm';

const exportCurrentCanvas = async (fileName, canvas) => {
  await init();

  canvas.renderAll();
  const context = canvas.getContext('2d');
  const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
  const svgString = await potrace(imageData, {
    turdsize: 10,
    turnpolicy: 'majority',
    optcurve: true,
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
  canvas.setHeight(`${400 * 2}`);
  canvas.setWidth(`${400 * 2}`);
  canvas.setZoom(1);
  canvas.renderAll();
  const backgroundString = await saveBackground(canvas);
  const foregroundString = await saveForeground(canvas);
  canvas.clear();
  return { foregroundString, backgroundString };
};

export { exportCurrentCanvas, saveCanvas };
