/**
 * product controller
 */

import { factories } from "@strapi/strapi";

export default factories.createCoreController(
  "api::product.product",
  ({ strapi }) => ({
    async find(ctx) {
      const { meta } = await super.find(ctx);
      const data = await strapi.entityService.findMany("api::product.product", {
        filters: { exclusivity: false },
        populate: ["productImage", "backgroundColourOptions"],
      });

      meta.date = Date.now();

      return { data, meta };
    },

    async findOne(ctx) {
      let { id } = ctx.request.params;
      const data = await strapi.entityService.findOne(
        "api::product.product",
        id,
        {
          populate: ["productImage", "backgroundColourOptions"],
        }
      );

      const colourOptions = await strapi.entityService.findMany(
        "api::background-color-option.background-color-option"
      );

      for (const option in data.backgroundColourOptions) {
        if (option !== "id" && data.backgroundColourOptions[option]) {
          data.backgroundColourOptions[option] = [
            data.backgroundColourOptions[option],
            colourOptions[0][option],
          ];
        }
      }

      return { data };
    },
  })
);
