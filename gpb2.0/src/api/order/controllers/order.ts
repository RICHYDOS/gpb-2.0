/**
 * order controller
 */

import { factories } from "@strapi/strapi";
const stripe = require("stripe")(process.env.STRAPI_ADMIN_LIVE_STRIPE_LIVE_KEY);

export default factories.createCoreController(
  "api::order.order",
  ({ strapi }) => ({
    async create(ctx) {
      const { email, customerDetails, productInfo, paymentType } =
        ctx.request.body;
      let amount = 0;
      const products = [];

      for (const element of productInfo) {
        const product = await strapi.entityService.findOne(
          "api::product.product",
          element.productId,
          {
            fields: ["name", "price", "discountPrice"],
            populate: "productImage.formats.small.url",
          }
        );

        element["name"] = product.name;
        if (product.productImage) {
          element["productImage"] = product.productImage.formats.small.url;
        } else {
          element["productImage"] =
            "https://res.cloudinary.com/drxadr6gz/image/upload/v1695483982/small_abiodun1_a4810a39e9.webp";
        }
        if (product.discountPrice) {
          element["price"] = product.discountPrice;
          amount = amount + Number(product.discountPrice);
        } else {
          element["price"] = product.price;
          amount = amount + Number(product.price);
        }
        products.push(product);
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
                templateReferenceId: 2,
              },
              {
                customer: {
                  firstname: customerDetails.firstName,
                  lastname: customerDetails.lastName,
                },
                order_id: order.id,
                products: productInfo,
                amount,
              }
            );

          await strapi
            .plugin("email-designer")
            .service("email")
            .sendTemplatedEmail(
              {
                to: process.env.SMTP_USERNAME,
              },
              {
                templateReferenceId: 2,
              },
              {
                customer: {
                  firstname: customerDetails.firstName,
                  lastname: customerDetails.lastName,
                },
                order_id: order.id,
                products: productInfo,
                amount,
              }
            );
          strapi.log.debug(
            `📺: Email Sent Successfully to ${email} and ${process.env.SMTP_USERNAME}`
          );
        } catch (err) {
          strapi.log.debug("📺: ", err);
          return ctx.badRequest(null, err);
        }
      }
      console.debug("Order Created");

      return {
        clientSecret,
        data: {
          email,
          customerDetails,
          productInfo,
          amount,
        },
      };
    },
  })
);
