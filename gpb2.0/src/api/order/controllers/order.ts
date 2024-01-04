/**
 * order controller
 */
import {SMTP_USERNAME} from '../../../../config/environment';
import { factories } from "@strapi/strapi";
const stripe = require("stripe")(process.env.STRAPI_ADMIN_LIVE_STRIPE_LIVE_KEY);

export default factories.createCoreController(
  "api::order.order",
  ({ strapi }) => ({
    async create(ctx) {
      const { email, customerDetails, productInfo, paymentType } = ctx.request.body;
      let amount = 0;
      const products = [];

      for (const element of productInfo) {
        const colourOptions = await strapi.entityService.findMany(
          "api::background-color-option.background-color-option"
        );

        const product = await strapi.entityService.findOne(
          "api::product.product",
          element.productId,
          {
            fields: ["name", "price", "discountPrice"],
            populate: "productImage",
          }
        )
        element["name"] = product.name;
        let price = 0;

        if (product.discountPrice) {
          price = Number(product.discountPrice);
          if (element.colour.toLowerCase() === "satisfied") {
            price = price + Number(colourOptions[0].satisfied);
          } else if (element.colour.toLowerCase() === "change") {
            price = price + Number(colourOptions[0].change);
          } else if (element.colour.toLowerCase() === "changes2") {
            price = price + Number(colourOptions[0].changes2);
          } else if (element.colour.toLowerCase() === "changes3") {
            price = price + Number(colourOptions[0].changes3);
          }
  
          if (element.exclusivity === true) {
            price = price + Number(colourOptions[0].exclusivity)
          }
          amount = amount + price;
        } else {
          price = Number(product.price);
          if (element.colour.toLowerCase() === "satisfied") {
            price = price + Number(colourOptions[0].satisfied);
          } else if (element.colour.toLowerCase() === "change") {
            price = price + Number(colourOptions[0].change);
          } else if (element.colour.toLowerCase() === "changes2") {
            price = price + Number(colourOptions[0].changes2);
          } else if (element.colour.toLowerCase() === "changes3") {
            price = price + Number(colourOptions[0].changes3);
          }
  
          if (element.exclusivity === true) {
            price = price + Number(colourOptions[0].exclusivity)
          }
          amount = amount + price;
        }

        product.productImage = product.productImage[0].formats.small.url;
        product["colour"] = element.colour.toLowerCase();
        product.price = price.toLocaleString();
        products.push(product);
      }
      console.log(products);

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
          amount: amount * 100,
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
                subject: 'GPB Order Confirmation',
              },
              {
                order_id: order.id,
                products,
                amount: amount.toLocaleString(),
              }
            );

          await strapi
            .plugin("email-designer")
            .service("email")
            .sendTemplatedEmail(
              {
                to: SMTP_USERNAME,
              },
              {
                templateReferenceId: 2,
                subject: 'GPB Order Confirmation',
              },
              {
                order_id: order.id,
                products,
                amount: amount.toLocaleString(),
              }
            );
          strapi.log.debug(
            `📺: Emails Sent Successfully to ${email} and ${SMTP_USERNAME}`
          );
        } catch (err) {
          strapi.log.error("📺: ", err);
          return ctx.badRequest(null, err);
        }
      }
      strapi.log.debug("Order Created");

      return {
        clientSecret,
        data: {
          email,
          customerDetails,
          products,
          amount: amount.toLocaleString(),
        },
      };
    },
  })
);
