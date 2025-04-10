# poc-kuadra

## Tecnologías usadas:
POC: nodejs + express + postgresql

## Observaciones:

No se deberían considerar de los requisitos:
- Login: no es directamente aplicado al flujo del objetivo de la aplicación
- Mobile Aplication: No es necesario para el desarrollo de una base de datos, objetivo de este POC.
- Paymente Distribution: se define como una automatización de los pagos para el dueño del establecimiento y la comisión para kuadra, pero no está reflejado en el diagrama ni en la bd. A menos que paymentService se encargue de hacer eso más el cobro del alquiler, lo cual ya estaría mal.

- el bloque en su arquitectura de isOwner, es inneceario volverlo un servicio, puede ser controlado nada más en la bd.

- Hay servicios que pueden ser reemplazados por triggers, que como el RecipeGeneratorService.

### REQUISITOS FINALES:
Reservations
- Payment gateway
- Payment distribution
- Show parking spaces within search radius
- Accounts with privileges (tenant and client roles)
- Tenant can create/edit/delete their available schedules, vehicles, tags, rates, and
spaces
- Reminders
- Reservation status
- Show reservations
- Status: Pending payment, In progress, Completed
- Receipt generation
- Digital tickets
- User with multiple vehicles


## Como levantar el sistema:

1. Ejcutar los sql, en este orden: bd.sql -> dataMock.sql

2. Crear archivo .env en el path: "./" . Su contenido debe ser algo así:

``` js
DB_USER=postgres
DB_PASSWORD=12345
DB_HOST=localhost
DB_PORT=5432
DB_NAME=kuadrapoc
PORT=3000
```

3. Ejecutar ```npm install```

4. Ejecuar ```node .\src\app.js ```

5. Link a documentación: http://localhost:3000/api-docs/

### Testeo de Endpoints:

1. GET http://localhost:3000/parkings:

**OUTPUT**
```json
[
    {
        "id": 1,
        "owner_id": 1,
        "name": "Cochera Miraflores",
        "address": "Av. Larco 123, Miraflores",
        "latitude": -12.1211,
        "longitude": -77.0303,
        "created_at": "2025-04-09T23:23:05.341Z"
    },
    {
        "id": 2,
        "owner_id": 2,
        "name": "Estacionamiento San Isidro",
        "address": "Calle Los Laureles 456, San Isidro",
        "latitude": -12.0978,
        "longitude": -77.0365,
        "created_at": "2025-04-09T23:23:05.341Z"
    },
    {
        "id": 3,
        "owner_id": 1,
        "name": "Parking Barranco",
        "address": null,
        "latitude": null,
        "longitude": null,
        "created_at": "2025-04-10T04:09:57.045Z"
    }
]
```

2. POST http://localhost:3000/parkings:

**BODY**
```json
{
  "name": "Parking Barranco",
  "location": "Av. Grau 123",
  "owner_id": 1
}
```

**OUTPUT**
```json
{
    "id": 3,
    "owner_id": 1,
    "name": "Parking Barranco",
    "address": null,
    "latitude": null,
    "longitude": null,
    "created_at": "2025-04-10T04:09:57.045Z"
}
```

3. GET http://localhost:3000/vehicles/3

**OUTPUT**
```json
{
    "id": 3,
    "user_id": 4,
    "plate_number": "DEF-456",
    "model": "Hyundai Accent",
    "color": "Azul"
}
```

4. GET http://localhost:3000/vehicles/user/3

**OUTPUT**
```json
[
    {
        "id": 1,
        "user_id": 3,
        "plate_number": "ABC-123",
        "model": "Toyota Corolla",
        "color": "Rojo"
    },
    {
        "id": 2,
        "user_id": 3,
        "plate_number": "XYZ-789",
        "model": "Kia Rio",
        "color": "Negro"
    },
    {
        "id": 8,
        "user_id": 3,
        "plate_number": "ABC-158",
        "model": "Toyota Corolla",
        "color": "Negro"
    }
]
```

5. POST http://localhost:3000/vehicles:

**BODY**
```JSON
{
  "user_id": 3,
  "plate_number": "ABC-158",
  "model": "Toyota Corolla",
  "color": "Negro"
}
```

```OUTPUT
{
    "id": 8,
    "user_id": 3,
    "plate_number": "ABC-158",
    "model": "Toyota Corolla",
    "color": "Negro"
}
```

6. GET http://localhost:3000/digitalTicket/verify/?ticketId=1:

**OUTPUT**
```json
{
    "message": "Ticket válido",
    "ticket": {
        "id": 1,
        "reservation_id": 2,
        "issued_at": "2025-04-09T23:23:15.137Z",
        "access_code": "f9cc240a200f"
    }
}
```