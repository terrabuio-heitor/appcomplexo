export type EventoDTO = {
  id?: number
  descricao: string
  data: string
  tipo: string
  expedicao_id: number
}

export type Evento = {
  id?: number
  descricao: string
  data: Date
  tipo: string
  expedicaoId: number
}

export type EventoInput = {
  id?: number
  descricao: string
  data: string
  tipo: string
  expedicao_id: number
}