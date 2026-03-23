export type Tripulante = {
  id?: number;
  nome: string;
  cargo: string; // Ex: Imediato, Cozinheiro, Artilheiro
  experiencia: string,//'Novato' | 'Veterano' | 'Lenda';
  expedicao_id?: number; // Chave estrangeira para ligar à expedição
}