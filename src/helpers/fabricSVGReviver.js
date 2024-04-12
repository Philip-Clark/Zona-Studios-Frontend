import { fabric } from 'fabric';
import { convertTextToPath } from './textToSvg';
import pathExpand from './pathExpand';
import { handleWoodChange } from './canvasHandlers';

const reviveNonText = (object, canvas) => {
  object.set({ id: object.id + ' background', selectable: false, shadow: 'none' });
  canvas.add(object);
};

const reviveText = async (object, canvas, fonts, setFont) => {
  if (!fonts.includes(object.fontFamily)) object.fontFamily = 'Roboto Regular';

  if (object.id.includes('cutout')) {
    object.clone((clone) => {
      canvas.add(clone);
      canvas.on('after:render', function () {
        clone.set({
          left: object.left,
          top: object.top,
          scaleX: object.scaleX,
          scaleY: object.scaleY,
          angle: object.angle,
          skewX: object.skewX,
          skewY: object.skewY,
        });
        clone.sendToBack();
      });
      clone.set({
        id: object.id + ' background',
        stroke: 'red',
        fill: '#ff0000',
        shadow: 'none',
        paintFirst: 'stroke',
        selectable: false,
      });
    });
  }
  object.set({
    id: object.id + ' foreground',
    stroke: 'transparent',
    strokeWidth: 0,
    fill: '#ffffff',
    paintFirst: 'stroke',
    selectable: true,
  });
  canvas.add(object);
};

const fabricSVGReviver = (object, canvas, fonts) => {
  if (object.isType('text')) {
    reviveText(object, canvas, fonts);
  } else {
    reviveNonText(object, canvas);
  }
};

export default fabricSVGReviver;
