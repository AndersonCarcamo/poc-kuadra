const pool = require('../config/db');

const createTables = async () => {
    try {
        await pool.query(`
      CREATE TYPE user_role AS ENUM ('tenant', 'client');
      CREATE TYPE reservation_status AS ENUM ('pending_payment', 'in_progress', 'completed');
      CREATE TYPE payment_status AS ENUM ('pending', 'completed', 'failed');

      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        email VARCHAR(100) UNIQUE NOT NULL,
        password_hash TEXT NOT NULL,
        role user_role NOT NULL DEFAULT 'client',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
        
      CREATE TABLE vehicles (
        id SERIAL PRIMARY KEY,
        user_id INT REFERENCES users(id) ON DELETE CASCADE,
        plate_number VARCHAR(20) UNIQUE NOT NULL,
        model VARCHAR(100),
        color VARCHAR(50)
    );

      CREATE TABLE parkings (
        id SERIAL PRIMARY KEY,
        owner_id INT REFERENCES users(id) ON DELETE CASCADE,
        name VARCHAR(100) NOT NULL,
        address TEXT NOT NULL,
        latitude DOUBLE PRECISION NOT NULL,
        longitude DOUBLE PRECISION NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

        CREATE TABLE spaces (
        id SERIAL PRIMARY KEY,
        parking_id INT REFERENCES parkings(id) ON DELETE CASCADE,
        name VARCHAR(50) NOT NULL,
        description TEXT,
        rate_per_hour NUMERIC(10,2) NOT NULL,
        is_available BOOLEAN DEFAULT TRUE
    );

    CREATE TABLE reservations (
        id SERIAL PRIMARY KEY,
        space_id INT REFERENCES spaces(id),
        user_id INT REFERENCES users(id),
        vehicle_id INT REFERENCES vehicles(id),
        status reservation_status DEFAULT 'pending_payment',
        start_time TIMESTAMP NOT NULL,
        end_time TIMESTAMP NOT NULL,
        total_amount NUMERIC(10,2),  -- (end_time - start_time) * rate_per_hour
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE payments (
        id SERIAL PRIMARY KEY,
        user_id INT REFERENCES users(id),         
        tenant_id INT REFERENCES users(id),        
        reservation_id INT REFERENCES reservations(id),
        amount NUMERIC(10,2) NOT NULL,
        method VARCHAR(50) NOT NULL,              
        status payment_status DEFAULT 'pending',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

      
      CREATE TABLE IF NOT EXISTS payment_distributions (
        id SERIAL PRIMARY KEY,
        payment_id INT REFERENCES payments(id) ON DELETE CASCADE,
        platform_amount NUMERIC(10,2) NOT NULL,
        tenant_amount NUMERIC(10,2) NOT NULL,
        distributed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );



    CREATE TABLE digital_tickets (
        id SERIAL PRIMARY KEY,
        reservation_id INT REFERENCES reservations(id) ON DELETE CASCADE,
        issued_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        access_code VARCHAR(50) UNIQUE NOT NULL
    );
    `);
        console.log('✅ Tablas creadas');
    } catch (error) {
        console.error('❌ Error al crear tablas:', error.message);
        process.exit(1);
    }
};

module.exports = createTables;