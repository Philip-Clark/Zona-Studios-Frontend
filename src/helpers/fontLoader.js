import FontFaceObserver from 'fontfaceobserver';

const loadAndUseFont = (font, canvas, object) => {
  const myFont = new FontFaceObserver(font);
  console.log({ font });
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

// Loads all the fonts
const loadFonts = async (fonts) => {
  fonts.forEach(async (font) => {
    const fontObserver = new FontFaceObserver(font);
    return fontObserver.load().catch((err) => console.log(`Can't load Font: ${font}\n${err}`));
  });
};

export { loadAndUseFont, loadFonts };
