/**
 * order controller
 */

import { factories } from '@strapi/strapi';
const stripe = require('stripe')(process.env.STRAPI_ADMIN_TEST_STRIPE_SECRET_KEY);

export default factories.createCoreController('api::order.order', ({strapi}) => ({
    async create(ctx) {
        const { email, customerDetails, productInfo } = ctx.request.body;
        let amount = 0;

        for (const element of productInfo) {
            const product = await strapi.entityService.findOne('api::product.product', element.productId, {
                fields: ['price', 'discountPrice'],
              });
            if (product.discountPrice) {
                amount = amount + Number(product.discountPrice);
            }
            else{
                amount = amount + Number(product.price);
            }
        }

        // Stripe Logic
        // ---
        const paymentIntent = await stripe.paymentIntents.create({
            amount: amount,
            currency: 'ngn',
            automatic_payment_methods: {
              enabled: true,
            },
          });
        // ---

        const order = await strapi.entityService.create('api::order.order', {
            data: {
              email,
              total: amount,
              customerDetails,
              productInfo
            },
          });
    
        return {
          clientSecret: paymentIntent.client_secret,
          data: {
            email,
            customerDetails,
            productInfo
          }
        };
      }
}));
