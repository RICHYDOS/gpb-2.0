module.exports = {
  
    async afterCreate(event) {
      const { email } = event.result;

      try {
        await strapi
          .plugin("email-designer")
          .service("email")
          .sendTemplatedEmail(
            {
              to: email,
            },
            {
              templateReferenceId: 1
            }
          );
          strapi.log.debug("📺: Email Sent Successfully to ", email);
      } catch (err) {
        strapi.log.debug("📺: ", err);
      }
    },
  };
