const combineSVGStrings = require('../helpers/combineSVGStrings');

// Import the function to be tested

// Test case 1: Combine two SVG strings
test('Combine two SVG strings', () => {
  // Define the input SVG strings
  const svgString1 = '<svg><rect width="100" height="100" fill="red" /></svg>';
  const svgString2 = '<svg><circle cx="50" cy="50" r="50" fill="blue" /></svg>';

  // Call the CombineSVGStrings function
  const combinedSVG = combineSVGStrings(svgString1, svgString2);

  // Define the expected output
  const expectedOutput =
    '<svg><rect width="100" height="100" fill="red" /><circle cx="50" cy="50" r="50" fill="blue" /></svg>';

  // Assert that the combinedSVG is equal to the expected output
  expect(combinedSVG).toEqual(expectedOutput);
});

// Test case 2: Combine an empty SVG string with a non-empty SVG string
test('Combine an empty SVG string with a non-empty SVG string', () => {
  // Define the input SVG strings
  const svgString1 = '';
  const svgString2 = '<svg><circle cx="50" cy="50" r="50" fill="blue" /></svg>';

  // Call the CombineSVGStrings function
  const combinedSVG = combineSVGStrings(svgString1, svgString2);

  // Define the expected output
  const expectedOutput = '<svg><circle cx="50" cy="50" r="50" fill="blue" /></svg>';

  // Assert that the combinedSVG is equal to the expected output
  expect(combinedSVG).toEqual(expectedOutput);
});
