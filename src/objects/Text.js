import removeIntersections from '../helpers/removeIntersections';
import TextToSVG from '../helpers/textToSvg';
import { fabric } from 'fabric';

export function createTextObject(text_, options) {
  const { fontFamily } = options;
  const fontUrl = process.env.PUBLIC_URL + `/fonts/${fontFamily.replace(' ', '')}.ttf`;
  const text = text_;
  const textToSVGInstance = TextToSVG.load(fontUrl);

  const getOutlineOfText = async () => {
    const path = textToSVGInstance.getPath(text, options);
    const nonIntersectingPath = await removeIntersections(path);
    return nonIntersectingPath;
  };

  return { getOutlineOfText };
}
