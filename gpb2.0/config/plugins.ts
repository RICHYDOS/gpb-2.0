import {SMTP_HOST, SMTP_PORT, SMTP_USERNAME, SMTP_PASSWORD} from '../config/environment';

export default ({ env }) => ({
  email: {
    config: {
      provider: "nodemailer",
      providerOptions: {
        host: SMTP_HOST,
        port: SMTP_PORT || 587,
        auth: {
          user: SMTP_USERNAME,
          pass: SMTP_PASSWORD,
        },
        // ... any custom nodemailer options
      },
      settings: {
        defaultFrom: env("EMAIL_DEFAULT_FROM"),
        defaultReplyTo: env("EMAIL_DEFAULT_REPLYTO"),
      },
    },
  },
  // ...
  upload: {
    config: {
      provider: "cloudinary",
      providerOptions: {
        cloud_name: env("CLOUDINARY_NAME"),
        api_key: env("CLOUDINARY_KEY"),
        api_secret: env("CLOUDINARY_SECRET"),
      },
      actionOptions: {
        upload: {},
        uploadStream: {},
        delete: {},
      },
    },
  },
  // ...
});
