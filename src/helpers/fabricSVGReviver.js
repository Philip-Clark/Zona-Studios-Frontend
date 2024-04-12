import { fabric } from 'fabric';
import { convertTextToPath } from './textToSvg';
import pathExpand from './pathExpand';

const reviveNonText = (object, canvas) => {
  object.set({ id: object.id + ' background', selectable: false });
  canvas.add(object);
};

const reviveText = async (object, canvas, fonts, setFont) => {
  if (!fonts.includes(object.fontFamily)) object.fontFamily = 'Roboto Regular';
  object.set({ id: object.id + ' text', selectable: true, fill: '#ffffff', paintFirst: 'stroke' });
  canvas.remove(object);
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
