import Joi from "joi";
const envVarsSchema = Joi.object({
  NODE_ENV: Joi.string()
    .valid("development", "production", "test")
    .default("development"),
  PORT: Joi.number().default(3000), // done
  //! Database Configuration
  DATABASE: Joi.string().required().description("Database URL"),
  DATABASE_PASSWORD: Joi.string().required().description("Database Password"),
  DATABASE_NAME: Joi.string().required().description("Database Name"),
  // ! JWT Configuration
  JWT_SECRET_KEY: Joi.string()
    .description("JWT Secret Key")
    .default("jwtSecretKey"),
  JWT_EXPIRES_IN: Joi.string().description("JWT Expiry Date").default("1d"),
  JWT_REFRESH_SECRET_KEY: Joi.string()
    .description("JWT Refresh Secret Key")
    .default("refreshSecretKey"),
  JWT_REFRESH_EXPIRES_IN: Joi.string()
    .description("JWT Refresh Expiry Date")
    .default("7d"),
  //! SMTP Configuration
  SMTP_EMAIL: Joi.string().required().description("SMTP Email"),
  SMTP_PASSWORD: Joi.string().required().description("SMTP Password"),
  SMTP_HOST: Joi.string().description("SMTP Host").default("smtp.gmail.com"),
  SMTP_PORT: Joi.number().description("SMTP Port").default(587),
  PASSWORD_RESET_EXPIRATION: Joi.number()
    .description("Password Reset Expiration")
    .default(600000), // 10 minutes
  //! Seeding Configuration
  SEED_ON_STARTUP: Joi.boolean().description("Seed on startup").default(false),
});
export default envVarsSchema;
