module.exports = {
    async send(ctx) {
        const { email, subject, message, name } = ctx.request.body;

        try {
          await strapi
            .plugin("email-designer")
            .service("email")
            .sendTemplatedEmail(
              {
                to: email,
              },
              {
                templateReferenceId: 4
              },
            );
          
            await strapi
            .plugin("email-designer")
            .service("email")
            .sendTemplatedEmail(
              {
                to: process.env.SMTP_USERNAME,
              },
              {
                templateReferenceId: 6
              },
              {
                subject,
                message,
                name, 
                email
              }
            );
            strapi.log.debug(`📺: Emails Sent Successfully to ${email} and ${process.env.SMTP_USERNAME}`);
            return `📺: Emails Sent Successfully to ${email} and ${process.env.SMTP_USERNAME}`;
        } catch (err) {
          strapi.log.debug("📺: ", err);
        }
    },
  };
