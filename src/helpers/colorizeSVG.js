// A function that takes a string and returns a string with the colorized SVG
export function colorizeSVG(svgString, color) {
  const colorizedSVG = svgString.replace(/fill=".*?"/, `fill="${color}"`);
  return colorizedSVG;
}
