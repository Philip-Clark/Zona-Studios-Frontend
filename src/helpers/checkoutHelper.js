import { saveCanvas } from './canvasExporter';
import combineSVGStrings from './combineSVGStrings';

export const uploadImage = async (canvas, filename) => {
  const { foregroundString, backgroundString } = await saveCanvas(canvas);
  const combinedSVG = combineSVGStrings(backgroundString, foregroundString);

  const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/image`, {
    method: 'POST',
    body: JSON.stringify({ combinedSVG, filename }),
    headers: {
      'Content-Type': 'application/json',
    },
  }).then((res) => res.json());

  return { url: response.url };
};

export const createCart = async (canvas, url, wood, variantID, color) => {
  console.log({ url, wood, variantID, color });
  const { data, extensions, message } = await fetch(
    `${process.env.REACT_APP_BACKEND_URL}/api/checkout`,
    {
      method: 'POST',
      body: JSON.stringify({ url, wood: wood, variantID, color: color.value }),
      headers: {
        'Content-Type': 'application/json',
      },
    }
  ).then((res) => res.json());
  if (!data.cartCreate.cart) return null;
  return data.cartCreate.cart;
};
