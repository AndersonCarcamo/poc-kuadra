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

1. 