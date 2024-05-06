import { FabricJSCanvas, useFabricJSEditor } from 'fabricjs-react';
import { useContext, useEffect } from 'react';
import { valuesContext } from '../contexts';
import fabricSVGReviver from '../helpers/fabricSVGReviver';
import { loadFonts } from '../helpers/fontLoader';
import {
  handleColorChange,
  handleFontChange,
  handleSizeChange,
  handleTextChange,
  handleWoodChange,
} from '../helpers/canvasHandlers';
import { saveCanvas } from '../helpers/canvasExporter';
import fabric from '../helpers/fabricOverrides';
import { woods } from '../definitions/woods';
import { colors } from '../definitions/colors';
import { resolveTspans } from '../helpers/svgPreimportTools';
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
    setSelectedColor,
    setSelectedWood,
    canvas,
    setCanvas,
    shouldSave,
    setShouldSave,
  } = useContext(valuesContext);

  useEffect(() => {
    loadFonts(fonts);
  }, [fonts]);
  useEffect(() => {
    handleWoodChange(selectedWood, editor?.canvas);
  }, [selectedWood, editor, fields]);
  useEffect(() => {
    handleColorChange(selectedColor, editor?.canvas);
  }, [selectedColor, editor]);

  useEffect(() => {
    fields.forEach((field) => handleTextChange(field.text, field.id, editor?.canvas));
  }, [fields, editor]);

  useEffect(() => {
    handleSizeChange(size, editor?.canvas);
  }, [size, editor]);
  useEffect(() => {
    handleFontChange(font, editor?.canvas);
  }, [font, editor]);
  useEffect(() => {
    if (shouldSave) {
      async function saveSVG() {
        if (!editor?.canvas) return;
        await saveCanvas(editor?.canvas);
        editor?.canvas.renderAll();
      }
      saveSVG();
      setShouldSave(false);
    }
  }, [shouldSave, editor, setShouldSave]);

  useEffect(() => {
    editor?.canvas.renderAll();
  }, [editor, fields, selectedWood, selectedColor, size, font, shouldSave]);

  useEffect(() => {
    editor?.canvas.setHeight('400');
    editor?.canvas.setWidth('400');
    editor?.canvas.clear();
    editor?.canvas.setZoom(1);
    editor?.canvas.set('targetFindTolerance', 2);
    editor?.canvas.set('selection', false);
    setCanvas(editor?.canvas);
  }, [editor]);

  useEffect(() => {
    editor?.canvas.setHeight('400');
    editor?.canvas.setWidth('400');
    editor?.canvas.clear();
    editor?.canvas.setZoom(1);
    (async () => {
      let svgString = await fetch(
        process.env.PUBLIC_URL + `/templates/${selectedTemplate.path}`
      ).then((res) => {
        return res.text();
      });

      svgString = resolveTspans(svgString);
      fabric.loadSVGFromString(
        svgString,
        (objects) => {
          if (!objects) return;
          const editable = objects.filter((object) => object.id.includes('editable'));
          setFields([]);
          setFields(
            editable.map((object) => ({
              id: object.id
                .replace('editable', '')
                .replace('text', '')
                .replace('cutout', ' ')
                .replace('foreground', ''),
              text: object.text,
            }))
          );
        },

        (source, object) => {
          fabricSVGReviver(object, editor?.canvas, fonts);
        }
      );
    })();
  }, [selectedTemplate, editor, setFields, fonts]);

  // const activeObjects = editor?.canvas.getActiveObjects();
  // useEffect(() => {
  //   if (!activeObjects) return;
  //   if (activeObjects.length !== 1) return;
  //   setFont(activeObjects[0].fontFamily);
  //   setSelectedColor(colors.find((color) => color.value === activeObjects[0].fill));
  // }, [activeObjects, editor?.canvas]);

  return (
    <div className="fabricHolder">
      <FabricJSCanvas className="editor" onReady={onReady} />
    </div>
  );
};

export default Canvas;
