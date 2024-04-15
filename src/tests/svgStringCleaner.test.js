import { resolveTspans } from '../helpers/svgPreimportTools';

test('resolveTspans removes tspan elements', () => {
  const svgString = '<svg><text><tspan fill="red">Hello</tspan></text></svg>';
  const expected = '<svg><text>Hello</text></svg>';
  const result = resolveTspans(svgString);
  expect(result).toBe(expected);
});

test('resolveTspans removes tspan elements and keeps tspan x,y', () => {
  const svgString = '<svg><text><tspan x="0" y="15" fill="red">Hello</tspan></text></svg>';
  const expected = '<svg><text x="0" y="15">Hello</text></svg>';
  const result = resolveTspans(svgString);
  expect(result).toBe(expected);
});
// test('resolveTspans handles multiple tspans by making new text element', () => {
//   const svgString =
//     '<svg><text><tspan x="0" y="15" fill="red">Hello</tspan><tspan x="0" y="0">World</tspan></text></svg>';
//   const expected =
//     '<svg><text x="0" y="15">Hello</text></text><text x="0" y="0">World</text></svg>';
//   const result = resolveTspans(svgString);
//   expect(result).toBe(expected);
// });
