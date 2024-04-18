import React, { useContext } from 'react';
import { saveCanvas } from '../helpers/canvasExporter';
import { valuesContext } from '../contexts';

const apiURL = 'http://localhost:3333';

const uploadImage = async (canvas) => {
  console.log(canvas);
  const { foregroundString, backgroundString } = await saveCanvas(canvas);
  console.log(foregroundString, backgroundString);

  const { foregroundResponse, backgroundResponse } = await fetch(`${apiURL}/api/image`, {
    method: 'POST',
    body: JSON.stringify({ foregroundString, backgroundString }),
    headers: {
      'Content-Type': 'application/json',
    },
  }).then((res) => res.json());

  console.log({ feURL: foregroundResponse.url, beURL: backgroundResponse.url });
  return { foregroundUrl: foregroundResponse.url, backgroundUrl: backgroundResponse.url };
};

const createCart = async (canvas, urls) => {
  const { foregroundUrl, backgroundUrl } = urls;
  const { foregroundString } = await saveCanvas(canvas);
  console.log(foregroundString);
  const { data, extensions, message } = await fetch(`${apiURL}/api/checkout`, {
    method: 'POST',
    body: JSON.stringify({ foregroundUrl, backgroundUrl }),
    headers: {
      'Content-Type': 'application/json',
    },
  }).then((res) => res.json());
  if (!data.cartCreate.cart) return null;
  return data.cartCreate.cart;
};

export function BuyWithShopify() {
  const { canvas } = useContext(valuesContext);

  const handlePurchase = async () => {
    const urls = await uploadImage(canvas);
    const cart = await createCart(canvas, urls);
    if (!cart) console.log('Error creating cart');
    window.location.href = cart.checkoutUrl;
  };

  return (
    <button className="Shopify" onClick={handlePurchase}>
      Buy Now
    </button>
  );
}
