import { fabric } from 'fabric';

fabric.Object.prototype.set({
  snapAngle: 10,
  originX: 'center',
  originY: 'center',
  objectCaching: false,
  cornerStyle: 'circle',
  cornerColor: '#38373f',
  cornerSize: 20,
  touchCornerSize: 40,
  shadow: 'rgba(0, 0, 0, 0.706) -2px 2px 5px',
  transparentCorners: false,
  borderColor: '#38373f',
  borderScaleFactor: 1.5,
  perPixelTargetFind: true,
  centeredScaling: false,
  targetFindTolerance: 4,
  strokeWidth: 0,
  padding: 20,
});
fabric.Object.prototype.setControlsVisibility({
  mt: false,
  mb: false,
  ml: false,
  mr: false,
  bl: true,
  br: true,
  tl: true,
  tr: true,
});

fabric.Object.prototype.render = function (ctx, noTransform) {
  // do not render if width/height are zeros or object is not visible
  if ((this.width === 0 && this.height === 0) || !this.visible) {
    return;
  }
  ctx.save();
  //setup fill rule for current object
  this._setupCompositeOperation(ctx);
  this.drawSelectionBackground(ctx);
  if (!noTransform) {
    this.transform(ctx);
  }
  this._setOpacity(ctx);
  this._setShadow(ctx);
  if (this.transformMatrix) {
    ctx.transform.apply(ctx, this.transformMatrix);
  }
  //this.clipTo && fabric.util.clipContext(this, ctx);
  if (this.objectCaching && !this.group) {
    if (this.isCacheDirty(noTransform)) {
      this.statefullCache && this.saveState({ propertySet: 'cacheProperties' });
      this.drawObject(this._cacheContext, noTransform);
      this.dirty = false;
    }
    this.drawCacheOnCanvas(ctx);
  } else {
    this.drawObject(ctx, noTransform);
    if (noTransform && this.objectCaching && this.statefullCache) {
      this.saveState({ propertySet: 'cacheProperties' });
    }
  }
  this.clipTo && ctx.restore();
  ctx.restore();
};

fabric.Text.prototype.set({
  shadow: `rgba(0, 0, 0, 1) -2px 2px 5px`,
  centeredScaling: false,
});

fabric.Canvas.prototype.set({
  // selectable: false,
  centeredScaling: false,
});

export default fabric;
