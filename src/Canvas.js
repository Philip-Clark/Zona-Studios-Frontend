import { fabric } from 'fabric';
import { FabricJSCanvas, useFabricJSEditor } from 'fabricjs-react';
import { imagedataToSVG } from 'imagetracerjs';
import { useEffect, useState } from 'react';
import FontFaceObserver from 'fontfaceobserver';
import googleFonts from 'google-fonts';

const addSVGStringToCanvas = (svgString, canvas) => {
  fabric.loadSVGFromString(svgString, (objects, options) => {
    const group = new fabric.Group(objects);
    group.set('center', true);
    objects.forEach((object) => {
      object.set({ fill: 'transparent', stroke: 'black' });
    });
    canvas.add(group);
  });
};

function convertURIToImageData(URI) {
  return new Promise(function (resolve, reject) {
    if (URI == null) return reject();
    var canvas = document.createElement('canvas'),
      context = canvas.getContext('2d'),
      image = new Image();
    image.addEventListener(
      'load',
      function () {
        canvas.width = image.width;
        canvas.height = image.height;
        context.drawImage(image, 0, 0, canvas.width, canvas.height);
        resolve(context.getImageData(0, 0, canvas.width, canvas.height));
      },
      false
    );
    image.src = URI;
  });
}

function applyPattern(url, shape, patternArea, canvas) {
  fabric.Image.fromURL(
    url,
    function (img) {
      const pattern = new fabric.Pattern({
        source: img._element,
        repeat: 'repeat',
        scaleWithObject: false,
      });
      pattern.scaleX = 100;
      pattern.scaleY = 100;
      shape.set(patternArea, pattern);
      canvas.renderAll();
    },
    {
      crossOrigin: 'anonymous',
    }
  );
}

const loadAndUse = (font, canvas, object) => {
  const myFont = new FontFaceObserver(font);
  myFont
    .load()
    .then(function () {
      // when font is loaded, use it.
      object.set('fontFamily', font);
      canvas.requestRenderAll();
      return true;
    })
    .catch(function (e) {
      console.log(e);
      alert('font loading failed ' + font);
      return false;
    });
};

const loadGoogleFont = (fontName) => {
  googleFonts.add({ [fontName]: true }); // or some other options if you need
  const fontObserver = new FontFaceObserver(fontName);
  return fontObserver.load().catch((err) => alert(`Can't load Font: ${fontName}`, err));
};

const loadFontFromURL = async (fontFamily, canvas, object) => {
  await loadGoogleFont(fontFamily);
  object.set('fontFamily', fontFamily);
  canvas?.requestRenderAll();
};

const handleColorChange = (color, canvas) => {
  canvas?._objects.forEach((object) => {
    const main = object._objects.find((child) => child.id === 'main');
    if (!main?.isType('text')) return;
    if (color.url === undefined) return main.set('fill', color.value);
    applyPattern(color.url, main, 'fill', canvas);
  });
  canvas?._objects.forEach((object) => {
    const main = object._objects.find((child) => child.id === 'cutout');

    if (!main?.isType('text')) return;
    console.log({ main });
    if (color.url === undefined) return main.set('fill', color.value);
    applyPattern(color.url, main, 'fill', canvas);
  });
};

const handleTextChange = (text, id, canvas) => {
  canvas?._objects.forEach((object) => {
    if (!object.isType('group')) return;
    if (!object.id.includes(id)) return;
    object._objects.forEach((child) => {
      child.set('text', text);
      canvas?.renderAll();

      child.scaleToWidth(object.width - child.get('strokeWidth') * 2);
    });

    canvas?.renderAll();
    object.setCoords();
  });
};

const handleSizeChange = (size, canvas) => {
  canvas?.set('centeredScaling', true);
  const intSize = parseInt(size.split('x')[0]);
  const scaleRatio = intSize / 48;
  const canvasEdgeLength = 400 * scaleRatio;
  document.querySelector('.editor').style.transform = `scale(${scaleRatio})`;
  // canvas?.setDimensions({ width: canvasEdgeLength, height: canvasEdgeLength });
  // canvas?.setZoom(scaleRatio);
};

const textShadow = new fabric.Shadow({
  offsetX: 12,
  offsetY: 12,
  blur: 0,
  color: '#000000f8',
});

const handleWoodChange = (wood, canvas) => {
  canvas?._objects.forEach((object) => {
    const main = object._objects.find((child) => child.id === 'main');
    if (main.isType('text')) return applyPattern(wood.url, main, 'stroke', canvas);
    applyPattern(wood.url, main, 'fill', canvas);
  });
};

fabric.Object.prototype.set({
  snapAngle: 10,
  originX: 'center',
  originY: 'center',
  objectCaching: false,
  cornerStyle: 'circle',
  cornerColor: '#38373f',
  cornerSize: 12,
  transparentCorners: false,
  borderColor: '#38373f',
  borderScaleFactor: 2.5,
});

const Canvas = ({ template, wood, size, color, setFields, fields }) => {
  const { editor, onReady } = useFabricJSEditor();
  const loadSVGCallback = (objects, options) => {
    handleColorChange(color, editor?.canvas);
    handleSizeChange(size, editor?.canvas);
    handleWoodChange(wood, editor?.canvas);
  };

  const getLightingElements = (object, stroke = false) => {
    const shadowObject = fabric.util.object.clone(object);
    shadowObject.set('fill', '#000000');
    shadowObject.set('stroke', stroke ? '#000000' : 'transparent');
    shadowObject.set('selectable', false);
    shadowObject.set('id', 'shadow');
    shadowObject.set('top', object.top + 1);
    shadowObject.set('left', object.left + 1);

    const highlightObject = fabric.util.object.clone(object);
    highlightObject.set('fill', '#ffffffff');
    highlightObject.set('stroke', stroke ? '#ffffff' : 'transparent');
    highlightObject.set('selectable', false);
    highlightObject.set('id', 'highlight');
    highlightObject.set('top', object.top - 1);
    highlightObject.set('left', object.left - 1);

    return [shadowObject, highlightObject];
  };

  const loadSVGReviver = (img, object) => {
    //? LOAD FONT
    const fontFace = img.attributes['font-family']?.value;
    if (fontFace) loadFontFromURL(fontFace, editor?.canvas, object);

    // ? Set object properties
    if (object.isType('text')) {
      if (object.id.includes('editable')) {
        const id = object.id.replace('editable ', '');
        setFields((field) => [...field, { id, text: object.text }]);
      }
      object.set({ paintFirst: 'stroke', strokeLineJoin: 'round', strokeLineCap: 'round' });
    } else {
      object.set('selectable', false);
    }

    // //? Create shadows and highlights for each object
    const isCutout = object.get('strokeWidth') > 0 && object.get('stroke') !== '#00000000';
    const [shadowObject, highlightObject] = getLightingElements(object, true);

    const objectGrouped = new fabric.Group([highlightObject, shadowObject, object]);
    const cutout = fabric.util.object.clone(object);
    cutout.set('stroke', '#00000000');

    objectGrouped.set('selectable', object.isType('text'));

    objectGrouped.set('id', object.id);
    editor?.canvas.add(objectGrouped);

    object.set('id', 'main');

    if (isCutout) {
      console.log({ isCutout });
      objectGrouped.add(cutout, ...getLightingElements(object));
      cutout.set('id', 'cutout');
      cutout.bringToFront();
    }

    objectGrouped.addWithUpdate();
  };

  //Load template
  useEffect(() => {
    setFields([]);
    editor?.canvas.setHeight('400');
    editor?.canvas.setWidth('400');
    editor?.canvas.clear();
    fabric.loadSVGFromURL(
      process.env.PUBLIC_URL + `/templates/${template.path}`,
      loadSVGCallback,
      loadSVGReviver
    );
  }, [editor?.canvas, template]);

  useEffect(() => {
    handleWoodChange(wood, editor?.canvas);
    editor?.canvas.renderAll();
  }, [wood, editor?.canvas]);

  useEffect(() => {
    handleColorChange(color, editor?.canvas);
    editor?.canvas.renderAll();
  }, [color, editor?.canvas]);

  useEffect(() => {
    editor?.canvas.renderAll();
    console.log({ fields });
    fields.forEach((field) => handleTextChange(field.text, field.id, editor?.canvas));
    editor?.canvas.renderAll();
  }, [fields, editor?.canvas]);

  useEffect(() => {
    handleSizeChange(size, editor?.canvas);
    editor?.canvas.renderAll();
  }, [size, editor?.canvas]);

  const rasterize = () => {
    let cutout = undefined;
    editor?.canvas.clone((clone) => {
      cutout = clone;

      cutout._objects.forEach((object) => {
        object.set('fill', 'black');
        object.set('stroke', 'black');
      });
      cutout.set('backgroundColor', 'transparent');
      cutout.renderAll();
      const dataUrl = cutout.toDataURL({ format: 'png' });
      convertURIToImageData(dataUrl).then(function (imageData) {
        const svgString = imagedataToSVG(imageData, {
          ltres: 1,
          qtres: 1,
          pathomit: 70,
          rightangleenhance: false,
          blurradius: 0.2,
          blurdelta: 2,
          linefilter: true,
          scale: 1,
        });
        console.log({ svgString });

        addSVGStringToCanvas(svgString, editor?.canvas);
      });
    });
  };

  return <FabricJSCanvas className="editor" onReady={onReady} />;
};

export default Canvas;
