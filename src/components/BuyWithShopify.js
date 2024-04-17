import React from 'react';

const apiURL = 'http://localhost:3333';
const handlePurchase = async () => {
  const { data, extensions, message } = await fetch(`${apiURL}/api/checkout`).then((res) =>
    res.json()
  );
  if (data.cartCreate.cart !== null) window.location.href = data.cartCreate.cart.checkoutUrl;
};

export function BuyWithShopify() {
  return (
    <button className="Shopify" onClick={handlePurchase}>
      Buy Now
    </button>
  );
}
