import ImageTracer from 'imagetracerjs';
import { smoothImage } from './pathTools';

const exportCurrentCanvas = async (fileName, canvas) => {
  canvas.renderAll();
  const canvasDataUrl = canvas.toDataURL({ format: 'png', quality: 1 });

  return new Promise((resolve, reject) => {
    ImageTracer.imageToSVG(
      canvasDataUrl,
      (svgString) => {
        // const a = document.createElement('a');
        // a.href = `data:image/svg+xml,${encodeURIComponent(svgString)}`;
        // a.download = `${fileName}.svg`;
        // a.click();
        resolve(svgString);
      },
      {
        ltres: 1,
        qtres: 3,
        rightangleenhance: true,
        numberofcolors: 2,
        scale: 1,
        strokewidth: 0,
      }
    );
  });
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
  const foregroundString = await saveForeground(canvas);
  const backgroundString = await saveBackground(canvas);
  canvas.clear();
  return { foregroundString, backgroundString };
};

export { exportCurrentCanvas, saveCanvas };
