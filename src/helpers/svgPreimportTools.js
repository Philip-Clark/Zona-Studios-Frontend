function resolveTspans(svgString) {
  const parser = new DOMParser();
  const xmlDoc = parser.parseFromString(svgString, 'image/svg+xml');

  const textElements = xmlDoc.getElementsByTagName('text');
  for (const textElement of textElements) {
    const tspanElement = textElement.querySelector('tspan');

    if (tspanElement) {
      const x = tspanElement.getAttribute('x');
      const y = tspanElement.getAttribute('y');

      if (x) textElement.setAttribute('x', x);
      if (y) textElement.setAttribute('y', y);

      textElement.innerHTML = tspanElement.innerHTML;
      tspanElement.remove();
    }
  }

  return xmlDoc.documentElement.outerHTML;
}

export { resolveTspans };
