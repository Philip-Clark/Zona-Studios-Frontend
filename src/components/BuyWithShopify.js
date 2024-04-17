import React, { useEffect } from 'react';
import { createStorefrontApiClient } from '@shopify/storefront-api-client';

//the secrets below are not actually secret and can be found in the request headers of the network tab. So we are okay to leave them here 🫡
const client = createStorefrontApiClient({
  storeDomain: 'signdevstore.myshopify.com',
  apiVersion: '2023-10',
  publicAccessToken: '6f1626074b86b98bc4b49d9f0b6c7b23',
});

const shopQuery = `
query shop {
  shop {
    name
    id
    primaryDomain {
      url
      host
    }
  }
}
`;
const cartCreateMutation = `
mutation ($input: CartInput!, $country: CountryCode, $language: LanguageCode)
@inContext(country: $country, language: $language) {
  cartCreate(input: $input) {
    userErrors {
      message
      code
      field
    }
    cart {
      id
      checkoutUrl
    }
  }
}
`;

const handlePurchase = async () => {
  const { data, errors, extensions } = await client.request(cartCreateMutation, {
    variables: {
      input: {
        lines: [{ merchandiseId: 'gid://shopify/ProductVariant/44689555718385', quantity: 1 }],
        attributes: [{ key: 'custom', value: 'value' }],
        metafields: [
          {
            key: 'A custom Attribute',
            value: 'value',
            type: 'string',
          },
        ],
      },
      country: 'US',
      language: 'EN',
    },
  });
  if (data.cartCreate.cart !== null) window.location.href = data.cartCreate.cart.checkoutUrl;
};

export function BuyWithShopify() {
  const [data, setData] = React.useState(null);
  useEffect(() => {
    const fetchData = async () => {
      const { data, errors, extensions } = await client.request(shopQuery);
      if (errors) {
        console.error(errors);
        return;
      }
      setData(data);
    };
    fetchData();
  }, []);

  return (
    <div className="Shopify">
      <p>{data?.shop.name}</p>
      <button onClick={handlePurchase}>Buy through {data?.shop.name}</button>
    </div>
  );
}
