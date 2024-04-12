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
    shouldSave,
    setShouldSave,
  } = useContext(valuesContext);

  useEffect(() => {
    loadFonts(fonts);
  }, [fonts]);
  useEffect(() => {
    handleWoodChange(selectedWood, editor?.canvas);
  }, [selectedWood, editor]);
  useEffect(() => {
    console.log(selectedColor);
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
    editor?.canvas.setHeight('1600');
    editor?.canvas.setWidth('1600');
    editor?.canvas.clear();
    editor?.canvas.setZoom(4);
    editor?.canvas.set('targetFindTolerance', 20);
  }, [editor]);

  useEffect(() => {
    editor?.canvas.clear();
    fabric.loadSVGFromURL(
      process.env.PUBLIC_URL + `/templates/${selectedTemplate.path}`,
      (objects) => {
        if (!objects) return;
        const editable = objects.filter((object) => object.id.includes('editable'));
        setFields([]);
        setFields(
          editable.map((object) => ({
            id: object.id.replace('editable ', '').replace('text ', ''),
            text: object.text,
          }))
        );
      },

      (source, object) => {
        fabricSVGReviver(object, editor?.canvas, fonts);
      }
    );
  }, [selectedTemplate, editor, setFields, fonts]);

  const activeObjects = editor?.canvas.getActiveObjects();
  useEffect(() => {
    if (!activeObjects) return;
    if (activeObjects.length !== 1) return;
    setFont(activeObjects[0].fontFamily);
    setSelectedColor(colors.find((color) => color.value === activeObjects[0].fill));
  }, [activeObjects, editor?.canvas]);

  return (
    <div className="fabricHolder">
      <FabricJSCanvas className="editor" onReady={onReady} />
    </div>
  );
};

export default Canvas;
