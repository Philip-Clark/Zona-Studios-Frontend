import React, { useContext } from 'react';
import { saveCanvas } from '../helpers/canvasExporter';
import { valuesContext } from '../contexts';
import combineSVGStrings from '../helpers/combineSVGStrings';

const uploadImage = async (canvas, filename) => {
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

const createCart = async (canvas, url) => {
  const { data, extensions, message } = await fetch(
    `${process.env.REACT_APP_BACKEND_URL}/api/checkout`,
    {
      method: 'POST',
      body: JSON.stringify({ url }),
      headers: {
        'Content-Type': 'application/json',
      },
    }
  ).then((res) => res.json());
  if (!data.cartCreate.cart) return null;
  return data.cartCreate.cart;
};

export function BuyWithShopify() {
  const { canvas, filename } = useContext(valuesContext);

  const handlePurchase = async () => {
    const { url } = await uploadImage(canvas, filename);
    const cart = await createCart(canvas, url);
    if (!cart) console.log('Error creating cart');
    window.location.href = cart.checkoutUrl;
  };

  return (
    <button className="Shopify" onClick={handlePurchase}>
      Buy Now
    </button>
  );
}
