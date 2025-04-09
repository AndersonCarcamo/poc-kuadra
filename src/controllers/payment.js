const { createPayment, distributePayment } = require('../models/queries');

const processPayment = async (req, res) => {
  try {
    const { userId, tenantId, reservationId, amount, method } = req.body;

    // valido datos
    if (!userId || !tenantId || !reservationId || !amount) {
      return res.status(400).json({ error: "Datos incompletos" });
    }

    const payment = await createPayment(userId, tenantId, reservationId, amount, method);
    const distribution = await distributePayment(payment.id);

    res.json({
      payment,
      distribution,
      message: "Pago procesado exitosamente"
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { processPayment };