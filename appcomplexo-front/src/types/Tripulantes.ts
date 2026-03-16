export type Tripulante = {
  id?: number;
  nome: string;
  funcao: string; // Ex: Imediato, Cozinheiro, Artilheiro
  experiencia: 'Novato' | 'Veterano' | 'Lenda';
  expedicao_id?: number; // Chave estrangeira para ligar à expedição
}