const pool = require('../config/db');

// ======================
// Servicio: Mostrar espacios en radio (cliente) Distancia euclidiana
// ======================
const getParkingsInRadius = async (lat, lon, radius) => {
  const query = `
    SELECT *, 
      SQRT(POW(latitude - $1, 2) + POW(longitude - $2, 2)) AS distance
    FROM parkings
    WHERE SQRT(POW(latitude - $1, 2) + POW(longitude - $2, 2)) <= $3
    ORDER BY distance
    LIMIT 20;
  `;
  const result = await pool.query(query, [lat, lon, radius]);
  return result.rows;
};

// ======================
// Servicio: Payment Gateway (cliente y propietario)
// ======================
const createPayment = async (userId, tenantId, reservationId, amount, method) => {
  // 1. registro el pago
  const paymentQuery = `
    INSERT INTO payments (
      user_id, 
      tenant_id, 
      reservation_id, 
      amount, 
      method, 
      status
    ) VALUES ($1, $2, $3, $4, $5, 'completed')
    RETURNING *;
  `;
  
  const paymentResult = await pool.query(paymentQuery, [
    userId,
    tenantId,
    reservationId,
    amount,
    method
  ]);

  return paymentResult.rows[0];
};

// ======================
// Servicio: Payment Distribution (empresa y propietario)
// ======================
const distributePayment = async (paymentId, commission = 0.2) => {
  // 1. recibo el pago
  const paymentResult = await pool.query(
    'SELECT * FROM payments WHERE id = $1',
    [paymentId]
  );
  
  if (paymentResult.rows.length === 0) {
    throw new Error('Pago no encontrado');
  }

  const payment = paymentResult.rows[0];
  
  // 2. calculo el pago (distribución)
  const platformAmount = payment.amount * commission;
  const tenantAmount = payment.amount - platformAmount;

  // 3. registrar pago (distribución)
  const distributionQuery = `
    INSERT INTO payment_distributions (
      payment_id,
      platform_amount,
      tenant_amount
    ) VALUES ($1, $2, $3)
    RETURNING *;
  `;
  
  const distributionResult = await pool.query(distributionQuery, [
    paymentId,
    platformAmount,
    tenantAmount
  ]);

  return distributionResult.rows[0];
};

module.exports = {
  getParkingsInRadius,
  createPayment,
  distributePayment
};