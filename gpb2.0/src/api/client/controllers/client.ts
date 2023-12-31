/**
 * client controller
 */

import { factories } from "@strapi/strapi";

export default factories.createCoreController(
  "api::client.client",
  ({ strapi }) => ({
    async find(ctx) {
      const { meta } = await super.find(ctx);
      const data = await strapi.entityService.findMany("api::client.client", {
        populate: "images",
      });

      meta.date = Date.now();

      return { data, meta };
    },
    async findOne(ctx) {
      let { id } = ctx.request.params;
      const data = await strapi.entityService.findOne(
        "api::client.client",
        id,
        {
          populate: "images",
        }
      );

      return data;
    },
  })
);
