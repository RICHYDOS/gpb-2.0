module.exports = {
  
    async afterCreate(event) {
      const { reference_id, subject } = event.result;
      const data = await strapi.entityService.findMany("api::mailing-list.mailing-list", {
        fields: ['email']
      });
      try {
        for (const mail of data) {
          try {
            await strapi
              .plugin("email-designer")
              .service("email")
              .sendTemplatedEmail(
                {
                  to: mail.email,
                },
                {
                  templateReferenceId: reference_id,
                  subject
                }
              );
            
          } catch (err) {
            strapi.log.error("📺: ", err);
          }
        }
        strapi.log.debug("📺: Emails Sent Successfully");
      } catch (err) {
        strapi.log.error("📺: ", err);
      }
    },
  };
