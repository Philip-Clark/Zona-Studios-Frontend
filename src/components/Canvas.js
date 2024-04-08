import { fabric } from 'fabric';
import { FabricJSCanvas, useFabricJSEditor } from 'fabricjs-react';
import { useContext, useEffect, useState } from 'react';
import FontFaceObserver from 'fontfaceobserver';
import { valuesContext } from '../contexts';
import TextToSVG from '../textToSvg';
import { resolve } from 'path-browserify';
import removeIntersections from '../removeIntersections';
import useOpenTypeJsForText from 'canvas-text-opentypejs-shim';

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
      console.log({ e });
      alert('font loading failed ' + font);
      return false;
    });
};

const loadFonts = async (fonts) => {
  fonts.forEach(async (font) => {
    const fontObserver = new FontFaceObserver(font);
    console.log({ fontObserver });
    return fontObserver.load().catch((err) => console.log(`Can't load Font: ${font}\n${err}`));
  });
};

const applyFont = async (fontFamily, canvas, object) => {
  object.set('fontFamily', fontFamily);
  canvas?.requestRenderAll();
};

const handleColorChange = (color, canvas) => {
  const objectsActive =
    canvas?.getActiveObjects() === undefined || canvas?.getActiveObjects().length > 0;

  const objectsToPaint = objectsActive ? canvas?.getActiveObjects() : canvas?._objects;

  objectsToPaint?.forEach((object) => {
    if (!object?.isType('text')) return;
    if (color.url === undefined) {
      object.set('fill', color.value);
      return;
    }
    applyPattern(color.url, object, 'fill', canvas);
  });
};

const handleTextChange = (text, id, canvas) => {
  canvas?._objects.forEach((object) => {
    if (!object.id.includes(id)) return;
    object.set('text', text);
    canvas?.renderAll();
    if (object.width * object.scaleX > canvas?.width / 4) object.scaleToWidth(canvas?.width);
    canvas?.renderAll();
  });
};

const handleFontChange = (font, canvas) => {
  canvas?.getActiveObjects().forEach((object) => {
    canvas?.renderAll();
    console.log({ font: font });
    loadAndUse(font, canvas, object);
    if (object.width * object.scaleX > canvas?.width / 4) object.scaleToWidth(canvas?.width);
    canvas?.renderAll();
  });
};

const handleSizeChange = (size, canvas) => {
  canvas?.set('centeredScaling', true);
  const intSize = parseInt(size.split('x')[0]);
  const scaleRatio = intSize / 48;
  const canvasEdgeLength = 400 * scaleRatio;
  document.querySelector('.editor').style.transform = `scale(${scaleRatio / 4})`;
  // canvas?.setDimensions({ width: canvasEdgeLength, height: canvasEdgeLength });
};

const handleWoodChange = (wood, canvas) => {
  canvas?._objects.forEach((object) => {
    if (object.isType('text')) return applyPattern(wood.url, object, 'stroke', canvas);
    applyPattern(wood.url, object, 'fill', canvas);
  });
};

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

const Canvas = () => {
  const { editor, onReady } = useFabricJSEditor();
  const {
    selectedTemplate,
    selectedWood,
    size,
    selectedColor,
    setFields,
    fields,
    font,
    fonts,
    setFont,
    shouldSave,
    setShouldSave,
  } = useContext(valuesContext);

  const loadSVGCallback = (objects, options) => {};

  const loadSVGReviver = async (img, object) => {
    // ? Set object properties

    if (object.id.includes('editable')) {
      const id = object.id.replace('editable ', '');
      setFields((field) => [...field, { id, text: object.text }]);
    }

    if (object.isType('text')) {
      //? LOAD FONT
      await applyFont('Lobster Two', editor?.canvas, object);
      const fontFace = img.attributes['font-family']?.value;
      console.log({ fontFace });
      console.log(fonts.includes(fontFace));
      if (fonts.includes(fontFace)) await applyFont(fontFace, editor?.canvas, object);

      object.on('selected', function () {
        setFont(object.fontFamily);
        console.log({ font });
      });

      object.id = 'foreground ' + object.id;
      object.set({ paintFirst: 'stroke', strokeLineJoin: 'round', strokeLineCap: 'round' });
    } else {
      object.id = 'background ' + object.id;
      object.set('selectable', false);
    }

    editor?.canvas.add(object);

    handleColorChange(selectedColor, editor?.canvas);
    handleSizeChange(size, editor?.canvas);
    handleWoodChange(selectedWood, editor?.canvas);

    object.on('modified', function () {
      object.bringToFront();
    });
  };

  //Load template
  useEffect(() => {
    setFields([]);
    editor?.canvas.setHeight('1600');
    editor?.canvas.setWidth('1600');
    editor?.canvas.clear();
    editor?.canvas.setZoom(4);
    editor?.canvas.set('targetFindTolerance', 20);

    fabric.loadSVGFromURL(
      process.env.PUBLIC_URL + `/templates/${selectedTemplate.path}`,
      loadSVGCallback,
      loadSVGReviver
    );
  }, [editor?.canvas, selectedTemplate]);

  useEffect(() => {
    loadFonts(fonts);
  }, [fonts]);

  useEffect(() => {
    handleWoodChange(selectedWood, editor?.canvas);
    editor?.canvas.renderAll();
  }, [selectedWood, editor?.canvas]);

  useEffect(() => {
    handleColorChange(selectedColor, editor?.canvas);
    editor?.canvas.renderAll();
  }, [selectedColor, editor?.canvas]);

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
    if (!shouldSave) return;
    async function saveSVG() {
      if (!editor?.canvas) return;

      const original = editor?.canvas.toJSON([
        'id',
        'selectable',
        'paintFirst',
        'strokeLineJoin',
        'strokeLineCap',
        'fontFamily',
        'fill',
        'stroke',
        'text',
        'top',
        'left',
        'width',
        'height',
      ]);

      await saveForeground(original);
      console.timeEnd('parseForeground');

      editor?.canvas.renderAll();
    }
    saveSVG();
    setShouldSave(false);
  }, [setShouldSave, shouldSave, editor?.canvas]);

  const exportCurrentCanvas = (fileName) => {
    editor?.canvas.renderAll();
    const a = document.createElement('a');
    const svg = editor?.canvas.toSVG({ suppressPreamble: true, encoding: 'utf-8' });

    a.download = `${fileName}.svg`;
    a.href = `data:image/svg+xml,${encodeURIComponent(svg)}`;
    a.click();
  };

  function loadTextToSVG(fontUrl) {
    return new Promise((resolve, reject) => {
      TextToSVG.load(fontUrl, (err, textToSVGInstance) => {
        if (err) reject(err);
        else resolve(textToSVGInstance);
      });
    });
  }

  const saveForeground = async (original) => {
    const objects = [...editor?.canvas.getObjects()];

    await Promise.all(
      objects.map(async (object) => {
        if (object.id.includes('background')) {
          object.set({ fill: 'blue', stroke: 'blue' });
          return;
        }

        editor?.canvas.remove(object);
        const fontUrl = process.env.PUBLIC_URL + `/fonts/${object.fontFamily.replace(' ', '')}.ttf`;

        try {
          const textToSVGInstance = await loadTextToSVG(fontUrl);
          const options = {
            fontSize: object.fontSize,
            scaleX: object.scaleX,
            scaleY: object.scaleY,
          };

          const path = textToSVGInstance.getPath(object.text, options);

          const nonIntersectingPath = await removeIntersections(path);

          const textPath = new fabric.Path(nonIntersectingPath, {
            fill: 'red',
            stroke: 'red',
            strokeWidth: 1,
            top: object.top,
            left: object.left,
            padding: object.padding,
            scaleX: object.scaleX,
            scaleY: object.scaleY,
            skewY: object.skewY,
            skewX: object.skewX,
            angle: object.angle,
          });

          textPath.set({ shadow: 'none', stroke: 'none', fill: 'red' });
          editor?.canvas.add(textPath);
          editor?.canvas.renderAll();
          resolve();
        } catch (err) {
          return;
        }
      })
    );

    exportCurrentCanvas(`text`);
  };

  return (
    <div className="fabricHolder">
      <FabricJSCanvas className="editor" onReady={onReady} />
    </div>
  );
};

export default Canvas;
