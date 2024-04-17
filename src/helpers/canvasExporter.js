import ImageTracer from 'imagetracerjs';
import { smoothImage } from './pathTools';

const exportCurrentCanvas = async (fileName, canvas) => {
  canvas.renderAll();
  const canvasDataUrl = canvas.toDataURL({ format: 'png', quality: 0.1 });

  ImageTracer.imageToSVG(
    canvasDataUrl,
    (svgString) => {
      const a = document.createElement('a');
      a.href = `data:image/svg+xml,${encodeURIComponent(svgString)}`;
      console.log(a.href);
      a.download = `${fileName}.svg`;
      a.click();
    },
    {
      ltres: 1.5,
      qtres: 1.5,
      rightangleenhance: true,
      numberofcolors: 2,
      scale: 1,
      strokewidth: 0,
    }
  );
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
  exportCurrentCanvas(`foreground`, canvas);
};

const saveBackground = (canvas) => {
  const objects = [...canvas.getObjects()];
  objects.forEach((object) => {
    object.set({ selectable: false });
    object.set({ shadow: 'none', stroke: 'blue', fill: 'blue' });
    canvas.renderAll();
  });
  exportCurrentCanvas(`background`, canvas);
};

const saveCanvas = async (canvas) => {
  saveForeground(canvas);
  saveBackground(canvas);
  canvas.clear();
};

export { exportCurrentCanvas, saveCanvas };
