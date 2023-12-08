import type { Schema, Attribute } from '@strapi/strapi';

export interface CustomerCustomerDetails extends Schema.Component {
  collectionName: 'components_customer_customer_details';
  info: {
    displayName: 'customerDetails';
  };
  attributes: {
    firstName: Attribute.String;
    lastName: Attribute.String;
    companyName: Attribute.String;
    country: Attribute.String;
    zipcode: Attribute.String;
    state: Attribute.String;
    city: Attribute.String;
    address: Attribute.Text;
    phoneNumber: Attribute.String;
  };
}

export interface CustomerProducts extends Schema.Component {
  collectionName: 'components_customer_products';
  info: {
    displayName: 'products';
    description: '';
  };
  attributes: {
    colour: Attribute.String & Attribute.DefaultTo<'Satisfactory'>;
    exclusivity: Attribute.Boolean & Attribute.DefaultTo<false>;
    name: Attribute.String;
  };
}

export interface ProductBackgroundChange extends Schema.Component {
  collectionName: 'components_product_background_changes';
  info: {
    displayName: 'backgroundChange';
    icon: 'rotate';
  };
  attributes: {
    satifactory: Attribute.Enumeration<['Satifactory']>;
    change1: Attribute.Enumeration<['change * 1']>;
    change2: Attribute.Enumeration<['change * 2']>;
    change3: Attribute.Enumeration<['change * 3']>;
  };
}

declare module '@strapi/types' {
  export module Shared {
    export interface Components {
      'customer.customer-details': CustomerCustomerDetails;
      'customer.products': CustomerProducts;
      'product.background-change': ProductBackgroundChange;
    }
  }
}
