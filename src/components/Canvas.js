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
    setFields([]);
    editor?.canvas.setHeight('1600');
    editor?.canvas.setWidth('1600');
    editor?.canvas.clear();
    editor?.canvas.setZoom(4);
    editor?.canvas.set('targetFindTolerance', 20);
  }, [editor, setFields]);

  useEffect(() => {
    editor?.canvas.clear();
    fabric.loadSVGFromURL(
      process.env.PUBLIC_URL + `/templates/${selectedTemplate.path}`,
      () => {},

      (source, object) => {
        fabricSVGReviver(object, editor?.canvas, fonts);
      }
    );
  }, [selectedTemplate, editor]);

  const activeObject = editor?.canvas.getActiveObject();
  useEffect(() => {
    if (!activeObject) return;
    setFont(activeObject?.fontFamily);
    setSelectedColor(colors.find((color) => color.value === activeObject?.fill));
  }, [activeObject, editor?.canvas]);

  return (
    <div className="fabricHolder">
      <FabricJSCanvas className="editor" onReady={onReady} />
    </div>
  );
};

export default Canvas;
