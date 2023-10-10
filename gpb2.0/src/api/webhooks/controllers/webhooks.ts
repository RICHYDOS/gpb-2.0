
module.exports = {
    async check(ctx) {
        const event = ctx.request.body;
        console.log(event);

        switch (event.type) {
            case 'payment_intent.succeeded':
              const paymentIntent = event.data.object;
              console.log('PaymentIntent was successful!', event.data.object);
              break;
            case 'payment_intent.payment_failed':
              const paymentIntentPaymentFailed = event.data.object;
              break;
          
            default:
              console.log(`Unhandled event type ${event.type}`);
        }

    },
  };