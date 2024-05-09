import React from 'react';
import { useContext } from 'react';
import { valuesContext } from '../contexts';
import { saveCanvas } from '../helpers/canvasExporter';
import combineSVGStrings from '../helpers/combineSVGStrings';
import { createCart, uploadImage } from '../helpers/checkoutHelper';

const MobilePurchase = () => {
  const { canvas, filename, setPreparingCart, wood, size, selectedColor } =
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
    <div className="mobilePurchase MobileStep">
      {/* <button onClick={handleSave}>Save</button> */}
      <div className="specs">
        {/* <p>
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
        ))} */}
        <h3>Price available at checkout</h3>
      </div>
      <button onClick={handlePurchase}>Purchase</button>
    </div>
  );
};

export default MobilePurchase;
