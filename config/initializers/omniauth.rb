OmniAuth.config.logger = Rails.logger

Rails.application.config.middleware.use OmniAuth::Builder do
  provider :facebook, Figaro.env.facebook_app_id, Figaro.env.facebook_secret,
  provider_ignores_state: true
end