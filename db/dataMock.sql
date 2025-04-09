-- Usuarios propietarios (tenants)
INSERT INTO users (name, email, password_hash, role)
VALUES 
('Carlos Dueñas', 'carlos@cocheras.pe', 'hash1', 'tenant'),
('Ana Salas', 'ana@estaciona.pe', 'hash2', 'tenant');

-- Usuarios clientes
INSERT INTO users (name, email, password_hash, role)
VALUES 
('Luis Ramos', 'luis@gmail.com', 'hash3', 'client'),
('María Quispe', 'mariaq@hotmail.com', 'hash4', 'client'),
('Jorge Pérez', 'jperez@yahoo.com', 'hash5', 'client');

-- Asumiendo que Luis tiene id = 3, María = 4, Jorge = 5
INSERT INTO vehicles (user_id, plate_number, model, color)
VALUES 
(3, 'ABC-123', 'Toyota Corolla', 'Rojo'),
(3, 'XYZ-789', 'Kia Rio', 'Negro'),
(4, 'DEF-456', 'Hyundai Accent', 'Azul'),
(5, 'GHI-321', 'Mazda 3', 'Gris');

-- Asumiendo Carlos = 1 y Ana = 2
INSERT INTO parkings (owner_id, name, address, latitude, longitude)
VALUES 
(1, 'Cochera Miraflores', 'Av. Larco 123, Miraflores', -12.1211, -77.0303),
(2, 'Estacionamiento San Isidro', 'Calle Los Laureles 456, San Isidro', -12.0978, -77.0365);


-- Asumiendo Cochera Miraflores = 1, Estacionamiento San Isidro = 2
INSERT INTO spaces (parking_id, name, description, rate_per_hour, is_available)
VALUES 
(1, 'Espacio A1', 'Primer piso, cerca a la entrada', 5.50, TRUE),
(1, 'Espacio A2', 'Segundo piso', 4.00, TRUE),
(2, 'Espacio B1', 'Primer piso, techado', 6.00, TRUE);


-- Reservas creadas por usuarios para vehículos
-- Espacio A1 = 1, A2 = 2, B1 = 3

INSERT INTO reservations (space_id, user_id, vehicle_id, status, start_time, end_time)
VALUES 
(1, 3, 1, 'pending_payment', '2025-04-10 08:00:00', '2025-04-10 10:00:00'),
(2, 4, 3, 'confirmed', '2025-04-11 09:00:00', '2025-04-11 12:00:00'),
(3, 5, 4, 'in_progress', '2025-04-09 07:00:00', '2025-04-09 09:30:00');

-- Asumiendo que la reserva confirmada tiene id = 2
INSERT INTO digital_tickets (reservation_id, access_code)
VALUES 
(2, encode(gen_random_bytes(6), 'hex'));

-- Reserva 2: 3 horas * 4.00 = 12.00
-- Reserva 3: 2.5 horas * 6.00 = 15.00
INSERT INTO receipts (reservation_id, amount, issued_at)
VALUES 
(2, 12.00, NOW()),
(3, 15.00, NOW());

INSERT INTO payments (user_id, owner_id, reservation_id, amount, method, status)
VALUES 
(4, 2, 2, 12.00, 'tarjeta', 'completado'),
(5, 2, 3, 15.00, 'yape', 'completado');