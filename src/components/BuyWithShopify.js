import React, { useContext } from 'react';
import { saveCanvas } from '../helpers/canvasExporter';
import { valuesContext } from '../contexts';
import combineSVGStrings from '../helpers/combineSVGStrings';
import { createCart, uploadImage } from '../helpers/checkoutHelper';

export function BuyWithShopify() {
  const { canvas, filename, setPreparingCart, size, wood, selectedColor } =
    useContext(valuesContext);
  const variantID = size;
  const handlePurchase = async () => {
    setPreparingCart(true);
    const { url } = await uploadImage(canvas, filename);
    const cart = await createCart(canvas, url, wood, variantID, selectedColor);
    setPreparingCart(false);
    if (!cart) return console.log('Error creating cart');
    window.location.href = cart.checkoutUrl;
  };

  return (
    <button className="Shopify" onClick={handlePurchase}>
      Buy Now
    </button>
  );
}
