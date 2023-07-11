import { fabric } from 'fabric';
import { FabricJSCanvas, useFabricJSEditor } from 'fabricjs-react';
import { imagedataToSVG } from 'imagetracerjs';
import { useEffect, useState } from 'react';
import FontFaceObserver from 'fontfaceobserver';

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
      });
      pattern.scaleX = 10;
      pattern.scaleY = 10;
      shape.set(patternArea, pattern);
      canvas.renderAll();
    },
    {
      crossOrigin: 'anonymous',
    }
  );
}

const loadAndUse = (font, canvas) => {
  const myFont = new FontFaceObserver(font);
  myFont
    .load()
    .then(function () {
      // when font is loaded, use it.
      canvas.getActiveObject().set('fontFamily', font);
      canvas.requestRenderAll();
    })
    .catch(function (e) {
      console.log(e);
      alert('font loading failed ' + font);
    });
};

const Canvas = ({ template, wood, size, color, firstName, lastName }) => {
  const { editor, onReady } = useFabricJSEditor();
  const [padding, setPadding] = useState(50);

  //Load template
  useEffect(() => {
    editor?.canvas.clear();
    fabric.loadSVGFromURL(
      process.env.PUBLIC_URL + '/templates/template1.svg',
      (objects, options) => {
        objects.forEach((object) => {
          if (object.isType('text')) {
            if (object.get('text') === 'first') object.set('id', 'first');
            if (object.get('text') === 'last') object.set('id', 'last');
            object.set('initialWidth', object.getScaledWidth());
          } else object.set('selectable', false);

          editor?.canvas.add(object);
        });
      }
    );
  }, [template, editor?.canvas]);

  editor?.canvas.setHeight('400');
  editor?.canvas.setWidth('400');

  const setFont = (font) => {
    loadAndUse(font, editor?.canvas);
  };

  //Watch for wood change
  useEffect(() => {
    editor?.canvas._objects.forEach((object) => {
      if (object.isType('text')) return;
      applyPattern(wood.url, object, 'fill', editor?.canvas);
    });
  }, [wood, editor?.canvas]);

  //Watch for Color change
  useEffect(() => {
    editor?.canvas._objects.forEach((object) => {
      if (!object.isType('text')) return;
      if (color.url == undefined) object.set('fill', color.value);
      else applyPattern(color.url, object, 'fill', editor?.canvas);
    });
  }, [color, editor?.canvas]);

  //Watch for firstName change
  useEffect(() => {
    editor?.canvas._objects.forEach((object) => {
      if (object.id !== 'first') return;
      object.set('text', firstName);
      object.scaleToWidth(object.get('initialWidth'));
    });
  }, [firstName, editor?.canvas]);

  //Watch for lastName change
  useEffect(() => {
    editor?.canvas._objects.forEach((object) => {
      if (object.id !== 'last') return;
      object.set('text', lastName);
      object.scaleToWidth(object.get('initialWidth'));
    });
  }, [lastName, editor?.canvas]);

  //Watch for size change
  useEffect(() => {
    editor?.canvas.set('centeredScaling', true);
    const intSize = parseInt(size.split('x')[0]);
    const scaleRatio = intSize / 48;
    editor?.canvas.zoomToPoint({ x: 200, y: 200 }, scaleRatio);
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
