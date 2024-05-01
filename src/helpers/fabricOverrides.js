import { fabric } from 'fabric';

fabric.Object.prototype.set({
  snapAngle: 10,
  originX: 'center',
  originY: 'center',
  objectCaching: false,
  cornerStyle: 'circle',
  cornerColor: '#373e3f',
  cornerSize: 12,
  shadow: 'rgba(0, 0, 0, 0.706) -2px 2px 5px',
  transparentCorners: false,
  borderColor: '#373e3f',
  borderScaleFactor: 2,
  perPixelTargetFind: true,
  strokeWidth: 0,
  padding: 1,
});

fabric.Text.prototype.set({
  shadow: `rgba(0, 0, 0, 1) -2px 2px 5px`,
});

fabric.Canvas.prototype.set({
  selectable: false,
});

export default fabric;
