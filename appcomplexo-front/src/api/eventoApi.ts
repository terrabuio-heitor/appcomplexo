//import type { Evento } from "../types/Evento"
import { handleApiError, handleNetworkError } from "../utils/errorHandler"
import type { AppError } from "../utils/errorHandler"
import { toEvento, toEventoDTO } from "../mappers/eventoMapper"
import type { Evento, EventoInput } from "../types/Evento"

//const API = "http://127.0.0.1:8080/eventos/"//local
//const API = "http://26.134.22.30:8080/eventos/"//radmin
//const API ="http://100.99.231.15:8080/eventos/"//tailscale

const getBaseURL = (): string => {
    const hostname = window.location.hostname;

    // Se estiver no PC local (ou via loopback)
    if (hostname === "localhost" || hostname === "127.0.0.1") {
        return "http://127.0.0.1:8080";
    }

    // Se estiver acessando via rede (Tailscale, Radmin ou IP Local)
    // O window.location.hostname retornará automaticamente o IP que você usou no navegador
    return `http://${hostname}:8080`;
};

export const API = `${getBaseURL()}/eventos/`;



export const getEventos = async (): Promise<Evento[] | AppError> => {
  try {
    const res = await fetch(API)
    if (!res.ok) return await handleApiError(res)

    const data = await res.json()
    return data.map(toEvento)
  } catch (e) {
    return handleNetworkError(e)
  }
}

export const criarEvento = async (input: EventoInput): Promise<void | AppError> => {
  try {
    const dto = toEventoDTO(input)

    const res = await fetch(API, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(dto)
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

export const atualizarEvento = async (input: EventoInput): Promise<void | AppError> => {
  try {
    const dto = toEventoDTO(input)

    const res = await fetch(`${API}${dto.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(dto)
    })

    if (!res.ok) return await handleApiError(res)
  } catch (e) {
    return handleNetworkError(e)
  }
}