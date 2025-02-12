//Declaramos la parte de las tarjetas para poder reutilizar el codigo en las demas pantallas del aplicativo
export interface PaymentFormModel {
  number: string;
  name: string;
  cvc: string;
  expiry: string;
}
