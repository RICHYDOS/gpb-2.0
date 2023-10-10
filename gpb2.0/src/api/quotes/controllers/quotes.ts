module.exports = {
    async send(ctx) {
        const { email, subject, message, name } = ctx.request.body;
        try {
            await strapi.plugin('email').service('email').send({
              to: email, // Use the newly added email address
              from: process.env.SMTP_USERNAME, // Change to your sender email
              subject: `Hi ${name}`,
              text: 'Your Response has been noted',
              html: '<h4>Welcome to Our Service</h4><p>Your Response has been noted</p>',
            });
    
            await strapi.plugin('email').service('email').send({
                to: process.env.SMTP_USERNAME, // Use the newly added email address
                from: process.env.SMTP_USERNAME, // Change to your sender email
                subject: subject,
                text: `Quote! ${message}`,
                html: `<h4>Quote!</h4><p>${message}</p>`,
              });
    
            ctx.body = `Emails sent successfully to ${email} & ${process.env.SMTP_USERNAME}`;
          } catch (error) {
            console.error('Email sending failed:', error);
          }
    },
  };
