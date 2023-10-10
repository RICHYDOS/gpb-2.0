module.exports = {
  
    async afterCreate(event) {
      const { email } = event.result;
  
      // do something to the result;
      try {
        await strapi.plugin('email').service('email').send({
          to: email, // Use the newly added email address
          from: process.env.SMTP_USERNAME, // Change to your sender email
          subject: 'Welcome to Our Service',
          text: 'Thank you for signing up for our Newsletter!',
          html: '<h4>Welcome to Our Service</h4><p>Thank you for signing up!</p>',
        });

        console.info('Email sent successfully to:', email);
      } catch (error) {
        console.error('Email sending failed:', error);
      }
    },
  };