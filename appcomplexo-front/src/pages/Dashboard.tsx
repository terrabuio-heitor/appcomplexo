import { useEffect, useState } from "react"
import type { Expedicao } from "../types/Expedicao"
import {
  getExpedicoes,
  criarExpedicao,
  deletarExpedicao,
  atualizarExpedicao
} from "../api/expedicaoApi"

import ExpedicaoForm from "../components/ExpedicaoForm"

export default function Dashboard() {

  const [expedicoes, setExpedicoes] = useState<Expedicao[]>([])
  const [editando, setEditando] = useState<Expedicao | null>(null)

  const carregar = async () => {
    const data = await getExpedicoes()
    setExpedicoes(data)
  }

  useEffect(() => {
    carregar()
  }, [])

  const salvar = async (exp: Expedicao) => {

    if (exp.id) {
      await atualizarExpedicao(exp)
      setEditando(null)
    } else {
      await criarExpedicao(exp)
    }

    carregar()
  }

  const remover = async (id: number) => {
    await deletarExpedicao(id)
    carregar()
  }

  return (
    <div className="min-h-screen bg-blue-50 p-10">

      <h1 className="text-3xl font-bold mb-6">
        ⚓ Sistema de Expedições Marítimas
      </h1>

      <ExpedicaoForm
        onSave={salvar}
        initial={editando || undefined}
      />

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">

        {expedicoes.map(e => (

          <div
            key={e.id}
            className="bg-white shadow rounded p-4"
          >

            <h2 className="text-xl font-semibold">{e.nome}</h2>

            <p>🚢 Navio: {e.navio}</p>
            <p>👨‍✈️ Capitão: {e.capitao}</p>
            <p>Status: {e.status}</p>

            <div className="flex gap-2 mt-3">

              <button
                onClick={() => setEditando(e)}
                className="bg-yellow-500 text-white px-3 py-1 rounded"
              >
                Editar
              </button>

              <button
                onClick={() => remover(e.id!)}
                className="bg-red-600 text-white px-3 py-1 rounded"
              >
                Remover
              </button>

            </div>

          </div>

        ))}

      </div>

    </div>
  )
}