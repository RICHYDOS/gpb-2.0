/**
 * order controller
 */

import { factories } from "@strapi/strapi";
const stripe = require("stripe")(
  process.env.STRAPI_ADMIN_TEST_STRIPE_SECRET_KEY
);

export default factories.createCoreController(
  "api::order.order",
  ({ strapi }) => ({
    async create(ctx) {
      const { email, customerDetails, productInfo, paymentType } =
        ctx.request.body;
      let amount = 0;
      for (const element of productInfo) {
        const product = await strapi.entityService.findOne(
          "api::product.product",
          element.productId,
          {
            fields: ["name", "price", "discountPrice"],
          }
        );
        element["name"] = product.name;
        if (product.discountPrice) {
          amount = amount + Number(product.discountPrice);
        } else {
          amount = amount + Number(product.price);
        }
      }
      const order = await strapi.entityService.create("api::order.order", {
        data: {
          email,
          total: amount,
          customerDetails,
          productInfo,
          paymentType,
        },
      });

      // Stripe Logic
      // ---
      let clientSecret = "";
      if (paymentType === "card") {
        const paymentIntent = await stripe.paymentIntents.create({
          amount: amount,
          currency: "ngn",
          automatic_payment_methods: {
            enabled: true,
          },
          metadata: {
            order_id: order.id,
          },
        });

        clientSecret = paymentIntent.client_secret;
        // ---
      } else if (paymentType === "bank transfer") {
        try {
          await strapi
            .plugin("email-designer")
            .service("email")
            .sendTemplatedEmail(
              {
                to: email,
              },
              {
                templateReferenceId: 4,
                subject: `GPB System: ${email} placed an order`,
              },
              {
                name: customerDetails.firstName,
              }
            );
        } catch (err) {
          strapi.log.debug("📺: ", err);
          return ctx.badRequest(null, err);
        }
      }

      return {
        clientSecret,
        data: {
          email,
          customerDetails,
          productInfo,
        },
      };
    },
  })
);
