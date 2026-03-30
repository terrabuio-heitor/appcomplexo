import type { EventoDTO, Evento, EventoInput } from "../types/Evento"

// API → Front
export function toEvento(dto: EventoDTO): Evento {
  return {
    id: dto.id,
    descricao: dto.descricao,
    tipo: dto.tipo,
    data: new Date(dto.data),
    expedicaoId: dto.expedicao_id
  }
}

// Front → API
export function toEventoDTO(input: EventoInput): EventoDTO {
  return {
    id: input.id,
    descricao: input.descricao,
    tipo: input.tipo,
    data: new Date(input.data).toISOString(),
    expedicao_id: input.expedicao_id
  }
}