import { fabric } from 'fabric';
import { FabricJSCanvas, useFabricJSEditor } from 'fabricjs-react';
import { imagedataToSVG } from 'imagetracerjs';
import { useEffect, useState } from 'react';
import FontFaceObserver from 'fontfaceobserver';
import googleFonts from 'google-fonts';

const addSVGStringToCanvas = (svgString, canvas) => {
  fabric.loadSVGFromString(svgString, (objects, options) => {
    const group = new fabric.Group(objects);
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

const loadFontFromURL = async (url, fontFamily, canvas, object) => {
  await loadGoogleFont(fontFamily);
  object.set('fontFamily', fontFamily);
  canvas?.requestRenderAll();
};

const handleColorChange = (color, canvas) => {
  canvas?._objects.forEach((object) => {
    if (!object.isType('text')) return;
    if (color.url === undefined) object.set('fill', color.value);
    else applyPattern(color.url, object, 'fill', canvas);
  });
};
const handleTextChange = (text, id, canvas) => {
  canvas?._objects.forEach((object) => {
    if (object.id !== id) return;
    object.set('text', text);
    if (object.getScaledWidth() + object.left + object.get('strokeWidth') * 2 >= canvas.width) {
      object.scaleToWidth(canvas.width - object.left - object.get('strokeWidth') * 2);
    }
  });
};

const handleSizeChange = (size, canvas) => {
  canvas?.set('centeredScaling', true);
  const intSize = parseInt(size.split('x')[0]);
  const scaleRatio = intSize / 48;
  const canvasEdgeLength = 400 * scaleRatio;
  canvas?.setDimensions({ width: canvasEdgeLength, height: canvasEdgeLength });
  canvas?.setZoom(scaleRatio);
};

const textShadow = new fabric.Shadow({
  offsetX: 0.5,
  offsetY: 0.5,
  blur: 1,
  color: '#000000d8',
});

const handleWoodChange = (wood, canvas) => {
  canvas?._objects.forEach((object) => {
    if (object.isType('text')) applyPattern(wood.url, object, 'stroke', canvas);
    else applyPattern(wood.url, object, 'fill', canvas);
  });
};

const Canvas = ({ template, wood, size, color, setFields, fields }) => {
  const { editor, onReady } = useFabricJSEditor();

  const loadSVGCallback = (objects, options) => {
    objects.forEach((object) => {
      if (object.isType('text')) {
        if (object.id.includes('editable')) {
          setFields((field) => [...field, object]);
        }
        object.set('shadow', textShadow);

        object.set({ paintFirst: 'stroke', strokeLineJoin: 'round', strokeLineCap: 'round' });
      } else object.set('selectable', false);

      editor?.canvas.add(object);

      handleColorChange(color, editor?.canvas);
      handleSizeChange(size, editor?.canvas);

      handleWoodChange(wood, editor?.canvas);
    });
  };

  const loadSVGReviver = (img, object) => {
    const fontFace = img.attributes['font-family']?.value;
    if (!fontFace) return;
    const googleFontsUrl = `https://fonts.googleapis.com/css2?family=${fontFace.replace(
      / /g,
      '+'
    )}`;
    loadFontFromURL(googleFontsUrl, fontFace, editor?.canvas, object);
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

  const setFont = (font) => {
    loadAndUse(font, editor?.canvas);
  };

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
    console.log({ fields });
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
