import { colorizeSVG } from '../helpers/colorizeSVG';

//a test for a function that takes a svg string and fill color, and returns a colorized svg string
test('colorizeSVG', async () => {
  const svgString = `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="400">
  <path fill="black" d="M 100 100 L 300 100 L 200 300 z" />
</svg>`;
  const color = 'red';
  const colorizedSVG = colorizeSVG(svgString, color);
  expect(colorizedSVG).toBe(
    `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="400">
  <path fill="red" d="M 100 100 L 300 100 L 200 300 z" />
</svg>`
  );
});
