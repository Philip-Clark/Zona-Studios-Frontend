function combineSVGStrings(svgString1, svgString2) {
  if (!svgString1 || !svgString2) return svgString1 || svgString2;
  const svgString1Prepared = svgString1.replace(/<\/svg>/, '');
  const svgString2Prepared = svgString2.replace(/<svg[^>]*>/, '');
  const combinedSVGString = svgString1Prepared + svgString2Prepared;

  return combinedSVGString;
}

module.exports = combineSVGStrings;
