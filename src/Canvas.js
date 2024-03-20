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
      const pattern = new fabric.Pattern(
        {
          source: img._element,
          repeat: 'repeat',
        },
        (pattern) => {
          shape.set(patternArea, pattern);
          canvas.renderAll();
        }
      );
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

const loadGoogleFont = async (fontName) => {
  await googleFonts.add({ [fontName]: true }); // or some other options if you need
  const fontObserver = new FontFaceObserver(fontName);
  return fontObserver.load().catch((err) => console.log(`Can't load Font: ${fontName}\n${err}`));
};

const loadFontFromURL = async (fontFamily, canvas, object) => {
  await loadGoogleFont(fontFamily);
  object.set('fontFamily', fontFamily);
  canvas?.requestRenderAll();
};

const handleColorChange = (color, canvas) => {
  const objectsActive =
    canvas?.getActiveObjects() === undefined || canvas?.getActiveObjects().length > 0;
  const objectsToPaint = objectsActive ? canvas?.getActiveObjects() : canvas?._objects;
  objectsToPaint?.forEach((object) => {
    const main = object._objects.find((child) => child.id === 'main');
    const cutout = object._objects.find((child) => child.id === 'cutout');

    if (!main?.isType('text')) return;
    if (color.url === undefined) {
      main.set('fill', color.value);
      cutout?.set('fill', color.value);
      return;
    }
    applyPattern(color.url, main, 'fill', canvas);
    applyPattern(color.url, cutout, 'fill', canvas);
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

const handleFontChange = (font, canvas) => {
  canvas?.getActiveObjects().forEach((object) => {
    object._objects.forEach((child) => {
      canvas?.renderAll();
      console.log({ font: font });
      loadAndUse(font, canvas, child);
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

const Canvas = ({ template, wood, size, color, setFields, fields, font, fonts, setSaveSvg }) => {
  const { editor, onReady } = useFabricJSEditor();

  const loadSVGCallback = (objects, options) => {};

  useEffect(() => {
    fonts.forEach(async (font) => {
      await loadGoogleFont(font);
    });
  }, [fonts]);

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

  const loadSVGReviver = async (img, object) => {
    //? LOAD FONT
    const fontFace = img.attributes['font-family']?.value;
    if (fontFace) await loadFontFromURL(fontFace, editor?.canvas, object);

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
      objectGrouped.add(cutout, ...getLightingElements(object));
      cutout.set('id', 'cutout');
      cutout.bringToFront();
    }

    objectGrouped.addWithUpdate();

    objectGrouped.setObjectsCoords();

    handleColorChange(color, editor?.canvas);
    handleSizeChange(size, editor?.canvas);
    handleWoodChange(wood, editor?.canvas);

    objectGrouped.on('modified', function () {
      objectGrouped.bringToFront();
    });
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
    fields.forEach((field) => handleTextChange(field.text, field.id, editor?.canvas));
    editor?.canvas.renderAll();
  }, [fields, editor?.canvas]);

  useEffect(() => {
    handleSizeChange(size, editor?.canvas);
    editor?.canvas.renderAll();
  }, [size, editor?.canvas]);

  useEffect(() => {
    handleFontChange(font, editor?.canvas);
    editor?.canvas.renderAll();
  }, [font, editor?.canvas]);

  useEffect(() => {
    const toPng = () => {
      console.log('attempting to save');
      if (!editor?.canvas) return;
      const a = document.createElement('a');

      a.href = editor?.canvas.toDataURL('image/png');
      a.download = `preview-${fields.map((field) => field.text).join('-')}-${template.name}.png`;
      a.click();

      const saved = editor?.canvas.toJSON();

      editor?.canvas.getObjects().forEach((object) => {
        if (!object.isType('group')) return;
        object._objects.forEach((child) => {
          if (child.id !== 'main') return child.set('opacity', '0');

          if (child.isType('text')) {
            child.set('fill', 'black');
            child.set('stroke', 'black');
          } else {
            child.set('fill', 'black');
            child.set('stroke', 'black');
          }
        });
      });

      a.href = editor?.canvas.toDataURL('image/png');
      a.download = `layer1-${fields.map((field) => field.text).join('-')}-${template.name}.png`;
      a.click();

      editor?.canvas.getObjects().forEach((object) => {
        if (!object.isType('group')) return;
        object._objects.forEach((child) => {
          if (child.id !== 'main') return child.set('opacity', '0');

          if (child.isType('text')) {
            child.set('fill', 'black');
            child.set('stroke', 'transparent');
          } else {
            child.set('fill', 'transparent');
            child.set('stroke', 'transparent');
          }
        });
      });

      a.href = editor?.canvas.toDataURL('image/png');
      a.download = `layer2-${fields.map((field) => field.text).join('-')}-${template.name}.png`;
      a.click();

      editor?.canvas.clear();
    };

    setSaveSvg(() => toPng);
  }, [editor?.canvas, setSaveSvg]);

  return (
    <div className="fabricHolder">
      <FabricJSCanvas className="editor" onReady={onReady} />
    </div>
  );
};

export default Canvas;
