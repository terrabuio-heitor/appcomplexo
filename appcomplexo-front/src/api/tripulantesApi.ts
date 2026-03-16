import type { Tripulante } from "../types/Tripulantes"
import { handleApiError, handleNetworkError } from "../utils/errorHandler"
import type { AppError } from "../utils/errorHandler"

//const API = "http://127.0.0.1:8080/expedicao/"//local
//const API = "http://26.134.22.30:8080/expedicao/"//radmin
const API = "http://100.99.231.15:8080/tripulante/" // tailscale

export const getTripulantes = async (): Promise<Tripulante[] | AppError> => {
  try {
    const res = await fetch(API)
    if (!res.ok) return await handleApiError(res)
    return await res.json()
  } catch (e) {
    return handleNetworkError(e)
  }
}

export const criarTripulante = async (trip: Tripulante): Promise<void | AppError> => {
  try {
    const res = await fetch(API, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(trip)
    })
    if (!res.ok) return await handleApiError(res)
  } catch (e) {
    return handleNetworkError(e)
  }
}

export const deletarTripulante = async (id: number): Promise<void | AppError> => {
  try {
    const res = await fetch(`${API}${id}`, {
      method: "DELETE"
    })
    if (!res.ok) return await handleApiError(res)
  } catch (e) {
    return handleNetworkError(e)
  }
}