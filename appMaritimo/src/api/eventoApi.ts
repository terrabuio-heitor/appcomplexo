import type { Evento } from "../types/Evento"
import { handleApiError, handleNetworkError } from "../utils/errorHandler"
import type { AppError } from "../utils/errorHandler"

//const API = "http://127.0.0.1:8080/eventos/"//local
//const API = "http://26.134.22.30:8080/eventos/"//radmin
//const API ="http://100.99.231.15:8080/eventos/"//tailscale

const BASE_URL = "http://100.123.137.36:8080"
export const API = `${BASE_URL}/eventos/`


export const getEventos = async (): Promise<Evento[] | AppError> => {
  try {
    const res = await fetch(API)
    if (!res.ok) return await handleApiError(res)
    return await res.json()
  } catch (e) {
    return handleNetworkError(e)
  }
}

export const criarEvento = async (evento: Evento): Promise<void | AppError> => {
  try {
    const res = await fetch(API, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        descricao: evento.descricao,
        data: evento.data,
        expedicao_id: evento.exID, // Mapeia exID para expedicao_id que o Go espera
        tipo: evento.tipo // O Go pede o campo Tipo
      })
    })
    if (!res.ok) return await handleApiError(res)
  } catch (e) {
    return handleNetworkError(e)
  }
}

export const deletarEvento = async (id: number): Promise<void | AppError> => {
  try {
    const res = await fetch(`${API}${id}`, { method: "DELETE" })
    if (!res.ok) return await handleApiError(res)
  } catch (e) {
    return handleNetworkError(e)
  }
}

export const atualizarEvento = async (evento: Evento): Promise<void | AppError> => {
  try {
    const res = await fetch(`${API}${evento.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id: evento.id, // O Go precisa do ID no corpo também para o Bind
        descricao: evento.descricao,
        data: evento.data,
        expedicao_id: Number(evento.exID), // Tradução para o banco
        tipo: evento.tipo
      })
    })
    if (!res.ok) return await handleApiError(res)
  } catch (e) {
    return handleNetworkError(e)
  }
}