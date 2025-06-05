import rateLimit from 'express-rate-limit';

const limiter = rateLimit({
  windowMs: 60 * 1000, // 1 minuto
  max: 50,            // Límite de 100 peticiones por IP
  message: {
    message: "ah hecho demaciadas petisiones, por favor intente mas tarde",
  },
});

export default limiter;

