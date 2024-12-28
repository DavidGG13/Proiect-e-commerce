export interface Recenzie {
  recenzie_id?: number;
  utilizator_id: number;
  produs_id: number;
  rating: number;
  comentariu: string;
  data_recenzie: Date;
}
