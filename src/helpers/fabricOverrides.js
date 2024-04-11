import { fabric } from 'fabric';

fabric.Object.prototype.set({
  snapAngle: 10,
  originX: 'center',
  originY: 'center',
  objectCaching: false,
  cornerStyle: 'circle',
  cornerColor: '#38373f',
  cornerSize: 46,
  shadow: 'rgba(0, 0, 0, 0.706) -2px 2px 5px',
  transparentCorners: false,
  borderColor: '#38373f',
  borderScaleFactor: 6,
  perPixelTargetFind: true,
  strokeWidth: 0,
  padding: 20,
});

fabric.Text.prototype.set({
  shadow: `rgba(0, 0, 0, 1) -2px 2px 5px`,
});

export default fabric;
