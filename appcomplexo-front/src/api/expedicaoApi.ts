import type { Expedicao } from "../types/Expedicao"

//const API = "http://127.0.0.1:8080/expedicao/"//local
//const API = "http://26.134.22.30:8080/expedicao/"//radmin
const API ="http://100.99.231.15:8080/expedicao/"//tailscale

export const getExpedicoes = async () => {
  const res = await fetch(API)
  return res.json()
}

export const criarExpedicao = async (expedicao: Expedicao) => {
  await fetch(API, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(expedicao)
  })
}

export const deletarExpedicao = async (id: number) => {
  await fetch(`${API}${id}`, {
    method: "DELETE"
  })
}

export const atualizarExpedicao = async (expedicao: Expedicao) => {
  await fetch(`${API}${expedicao.id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(expedicao)
  })
}