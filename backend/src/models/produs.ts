export interface Produs {
  produs_id?: number;
  nume_produs: string;
  categorie_id: number;
  marca: string;
  pret: number;
  cantitate_stoc: number;
  descriere: string;
  imagine_url?: string; // Include URL-ul imaginii
}
