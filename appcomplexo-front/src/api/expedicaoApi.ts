import type { Expedicao } from "../types/Expedicao"
import { handleApiError, handleNetworkError } from "../utils/errorHandler"
import type { AppError } from "../utils/errorHandler"

//const API = "http://127.0.0.1:8080/expedicao/"//local
//const API = "http://26.134.22.30:8080/expedicao/"//radmin
//const API ="http://100.99.231.15:8080/expedicao/"//tailscale

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

export const API = `${getBaseURL()}/expedicao/`;

export const getExpedicoes = async (): Promise<Expedicao[] | AppError> => {
  try {
    const res = await fetch(API)
    if (!res.ok) return await handleApiError(res)
    return await res.json()
  } catch (e) {
    return handleNetworkError(e)
  }
}

export const criarExpedicao = async (expedicao: Expedicao): Promise<void | AppError> => {
  try {
    const res = await fetch(API, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(expedicao)
    })
    if (!res.ok) return await handleApiError(res)
  } catch (e) {
    return handleNetworkError(e)
  }
}

export const deletarExpedicao = async (id: number): Promise<void | AppError> => {
  try {
    const res = await fetch(`${API}${id}`, {
      method: "DELETE"
    })
    if (!res.ok) return await handleApiError(res)
  } catch (e) {
    return handleNetworkError(e)
  }
}

export const atualizarExpedicao = async (expedicao: Expedicao): Promise<void | AppError> => {
  try {
    const res = await fetch(`${API}${expedicao.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(expedicao)
    })
    if (!res.ok) return await handleApiError(res)
  } catch (e) {
    return handleNetworkError(e)
  }
}