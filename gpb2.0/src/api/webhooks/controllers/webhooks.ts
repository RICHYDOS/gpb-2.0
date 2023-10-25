
module.exports = {
    async check(ctx) {
        const event = ctx.request.body;
        console.log(event);

        switch (event.type) {
            case 'payment_intent.succeeded':
              const order_id = event.data.object.metadata.order_id;
              await strapi.entityService.update('api::order.order', order_id, {
                data: {
                  status: 'Success',
                },
              });
              console.log('PaymentIntent was successful!', event.data.object.metadata);
              break;
            case 'payment_intent.payment_failed':
              await strapi.entityService.update('api::order.order', order_id, {
                data: {
                  status: 'Failed',
                },
              });
              console.log('PaymentIntent Failed!', event.data.object.metadata);
              break;
          
            default:
              console.log(`Unhandled event type ${event.type}`);
        }
        return {status: 'Payment Status received'};

    },
  };