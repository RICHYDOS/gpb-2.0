/**
 * homepage-display controller
 */

import { factories } from '@strapi/strapi'

export default factories.createCoreController('api::homepage-display.homepage-display', ({strapi}) => ({
    async find(ctx) {
        const data = await strapi.entityService.findOne(
            "api::homepage-display.homepage-display",
            1,
            {
                populate: {
                    banner: {
                        populate: {
                            desktop: {
                                fields: ['url']
                            },
                            mobile: {
                                fields: ['url']
                            }
                        }
                    },
                    learnOurStorySection: {
                        fields: ['url']
                    },
                    gpbFabricsSection: {
                        fields: ['url']
                    },
                    gpbClientsSection: {
                        fields: ['url']
                    }
                }
            }
        )
        return data;
    }
}));
