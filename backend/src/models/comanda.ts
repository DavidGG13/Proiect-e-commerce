export interface Comanda {
  comanda_id?: number;
  utilizator_id: number;
  data_comanda: Date;
  pret_total: number;
  adresa_livrare: string;
  status: string;
}
