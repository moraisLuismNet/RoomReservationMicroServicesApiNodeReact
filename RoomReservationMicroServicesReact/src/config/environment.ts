export const environment = {
  production: import.meta.env.PROD,
  apiUrls: {
    user: import.meta.env.VITE_USER_API_URL || "http://localhost:7007",
    room: import.meta.env.VITE_ROOM_API_URL || "http://localhost:7008",
    reservation:
      import.meta.env.VITE_RESERVATION_API_URL || "http://localhost:7009",
    payment: import.meta.env.VITE_PAYMENT_API_URL || "http://localhost:7010",
    email: import.meta.env.VITE_EMAIL_API_URL || "http://localhost:7011",
  },
  stripePublishableKey:
    import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY ||
    "pk_test_51Sf4ekKa83u5j4F8Y8KV7xFXW8gHbLlcRjuFMEKdl5zfG2MNROFxoe8cNacleKNRuFgl9tN3TsER3165FWkhdPuL00WRZcCMqA",
};
