import React from 'react';
import { useContext } from 'react';
import { valuesContext } from '../contexts';
import { saveCanvas } from '../helpers/canvasExporter';
import combineSVGStrings from '../helpers/combineSVGStrings';
const apiURL = 'http://localhost:3333';

const uploadImage = async (canvas, filename) => {
  const { foregroundString, backgroundString } = await saveCanvas(canvas);
  const combinedSVG = combineSVGStrings(backgroundString, foregroundString);

  const response = await fetch(`${apiURL}/api/image`, {
    method: 'POST',
    body: JSON.stringify({ combinedSVG, filename }),
    headers: {
      'Content-Type': 'application/json',
    },
  }).then((res) => res.json());

  return { url: response.url };
};

const createCart = async (canvas, url) => {
  const { data, extensions, message } = await fetch(`${apiURL}/api/checkout`, {
    method: 'POST',
    body: JSON.stringify({ url }),
    headers: {
      'Content-Type': 'application/json',
    },
  }).then((res) => res.json());
  if (!data.cartCreate.cart) return null;
  return data.cartCreate.cart;
};

const MobilePurchase = () => {
  const { canvas, filename } = useContext(valuesContext);

  const context = useContext(valuesContext);
  const handleSave = () => {
    // Logic for saving the purchase
  };

  const handlePurchase = async () => {
    const { url } = await uploadImage(canvas, filename);
    const cart = await createCart(canvas, url);
    if (!cart) console.log('Error creating cart');
    window.location.href = cart.checkoutUrl;
  };
  return (
    <div className="mobilePurchase MobileStep">
      {/* <button onClick={handleSave}>Save</button> */}
      <div className="specs">
        <p>
          Template: <span>{context.selectedTemplate.name}</span>
        </p>
        <p>
          Size:{' '}
          <span>
            {context.size}in x {context.size}in
          </span>
        </p>
        {context.fields.map((field) => (
          <p key={field.id}>
            {field.id}: <span>{field.text}</span>
          </p>
        ))}
      </div>
      <button onClick={handlePurchase}>Purchase</button>
    </div>
  );
};

export default MobilePurchase;
