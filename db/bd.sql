CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Roles de cuenta
CREATE TYPE user_role AS ENUM ('tenant', 'client');

-- Estado de la reserva
CREATE TYPE reservation_status AS ENUM (
    'pending_payment',     -- pendiente
    'to_be_collected',     -- por cobrar
    'confirmed',           -- confirmada
    'in_progress',         -- en curso
    'completed',           -- finalizada
    'cancelled'            -- cancelada
);
-- Usuarios y Propietarios
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100),
    email VARCHAR(100) UNIQUE,
    password_hash TEXT,
    role user_role NOT NULL DEFAULT 'client',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Vehículos (un usuario puede tener varios)
CREATE TABLE vehicles (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id) ON DELETE CASCADE,
    plate_number VARCHAR(20) UNIQUE NOT NULL,
    model VARCHAR(100),
    color VARCHAR(50)
);

-- Estacionamientos
CREATE TABLE parkings (
    id SERIAL PRIMARY KEY,
    owner_id INT REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(100),
    address TEXT,
    latitude DOUBLE PRECISION,
    longitude DOUBLE PRECISION,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Espacios de estacionamiento
CREATE TABLE spaces (
    id SERIAL PRIMARY KEY,
    parking_id INT REFERENCES parkings(id) ON DELETE CASCADE,
    name VARCHAR(50),
    description TEXT,
    rate_per_hour NUMERIC(10,2),
    is_available BOOLEAN DEFAULT TRUE
);

-- Reservas
CREATE TABLE reservations (
    id SERIAL PRIMARY KEY,
    space_id INT REFERENCES spaces(id),
    user_id INT REFERENCES users(id),
    vehicle_id INT REFERENCES vehicles(id),
    status reservation_status DEFAULT 'pending_payment',
    start_time TIMESTAMP,
    end_time TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tickets digitales
CREATE TABLE digital_tickets (
    id SERIAL PRIMARY KEY,
    reservation_id INT REFERENCES reservations(id) ON DELETE CASCADE,
    issued_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    access_code VARCHAR(50) UNIQUE
);

-- Recibos
CREATE TABLE receipts (
    id SERIAL PRIMARY KEY,
    reservation_id INT REFERENCES reservations(id) ON DELETE CASCADE,
    amount NUMERIC(10,2),
    issued_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Notificaciones
CREATE TABLE notifications (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id),
    reservation_id INT REFERENCES reservations(id),
    message TEXT,
    sent_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Pagos
CREATE TABLE payments (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id),
    owner_id INT REFERENCES users(id),
    reservation_id INT REFERENCES reservations(id),
    amount NUMERIC(10,2),
    method VARCHAR(50),
    status VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Notificación automática al crear una reserva
CREATE OR REPLACE FUNCTION notify_user_on_reservation()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO notifications (user_id, reservation_id, message)
    VALUES (
        NEW.user_id,
        NEW.id,
        'Tu reserva ha sido creada. Estado: ' || NEW.status
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_notify_on_reservation
AFTER INSERT ON reservations
FOR EACH ROW
EXECUTE FUNCTION notify_user_on_reservation();

-- Generar un ticket digital automáticamente cuando se confirme la reserva

CREATE OR REPLACE FUNCTION generate_digital_ticket()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.status = 'confirmed' THEN
        INSERT INTO digital_tickets (reservation_id, access_code)
        VALUES (
            NEW.id,
            encode(gen_random_bytes(6), 'hex')
        );
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_generate_ticket
AFTER UPDATE ON reservations
FOR EACH ROW
WHEN (OLD.status IS DISTINCT FROM NEW.status)
EXECUTE FUNCTION generate_digital_ticket();

-- crear receipt automáticamente

CREATE OR REPLACE FUNCTION create_receipt_on_completion()
RETURNS TRIGGER AS $$
DECLARE
    rate NUMERIC;
    duration NUMERIC;
BEGIN
    IF NEW.status = 'completed' THEN
        SELECT s.rate_per_hour
        INTO rate
        FROM spaces s
        WHERE s.id = NEW.space_id;

        duration := EXTRACT(EPOCH FROM (NEW.end_time - NEW.start_time)) / 3600;
        
        INSERT INTO receipts (reservation_id, amount, issued_at)
        VALUES (
            NEW.id,
            ROUND(rate * duration, 2),
            NOW()
        );
    END IF;
    RETURN NEW;
END;
	$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_create_receipt
AFTER UPDATE ON reservations
FOR EACH ROW
WHEN (OLD.status IS DISTINCT FROM NEW.status)
EXECUTE FUNCTION create_receipt_on_completion();

