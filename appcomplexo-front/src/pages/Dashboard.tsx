import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import type { AppError } from "../utils/errorHandler"
import ErrorMessage from "../components/ErrorMessage"

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
  const [erro, setErro] = useState<AppError | null>(null)

  const navigate = useNavigate()

  const carregar = async () => {
    setErro(null)
    const resultado = await getExpedicoes()
    
    // Se resultado existir e for um objeto de erro, exibe o erro.
    if (resultado && typeof resultado === 'object' && "mensagem" in resultado) {
      setErro(resultado as AppError)
    } else {
      // DEFESA ABSOLUTA: Se não for um erro, garanta que seja um array. Se o backend mandar null, vira []
      setExpedicoes(Array.isArray(resultado) ? resultado : [])
    }
  }

  useEffect(() => {
    carregar()
  }, [])

  const salvar = async (exp: Expedicao) => {
    setErro(null)
    let resultado

    if (exp.id) {
      resultado = await atualizarExpedicao(exp)
    } else {
      resultado = await criarExpedicao(exp)
    }

    if (resultado && typeof resultado === 'object' && "mensagem" in resultado) {
      setErro(resultado as AppError)
    } else {
      setEditando(null)
      carregar()
    }
  }

  const remover = async (id: number) => {
    if (confirm("Deseja realmente excluir esta expedição?")) {
      setErro(null)
      const resultado = await deletarExpedicao(id)
      
      if (resultado && typeof resultado === 'object' && "mensagem" in resultado) {
        setErro(resultado as AppError)
      } else {
        carregar()
      }
    }
  }

  return (
    <main className="max-w-6xl mx-auto px-6 pb-20">

      <section className="mb-12 bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <h2 className="text-xl font-bold mb-4 text-slate-700 flex items-center gap-2">
          {editando ? "📝 Editar Expedição" : "➕ Nova Expedição"}
        </h2>

        <ExpedicaoForm
          onSave={salvar}
          initial={editando || undefined}
        />

        {editando && (
          <button
            onClick={() => setEditando(null)}
            className="mt-2 text-sm text-slate-500 underline hover:text-slate-800"
          >
            Cancelar edição
          </button>
        )}
      </section>

      {/* Painel de Erro */}
      {erro && <ErrorMessage error={erro} onRetry={carregar} />}

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {expedicoes.map(e => (
          <div
            key={e.id}
            onClick={() => navigate(`/expedicao/${e.id}`)}
            className="bg-white border border-slate-200 rounded-2xl shadow-sm hover:shadow-md transition-all overflow-hidden group cursor-pointer"
          >
            <div className="h-2 bg-indigo-500 group-hover:bg-indigo-600 transition-colors"></div>

            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-xl font-bold text-slate-800 leading-tight">
                  {e.nome}
                </h2>
                <span className="bg-indigo-50 text-indigo-700 text-[10px] uppercase tracking-widest font-bold px-2 py-1 rounded-md border border-indigo-100">
                  {e.status}
                </span>
              </div>

              <div className="space-y-3 mb-6">
                <div className="flex items-center text-sm text-slate-600">
                  <span className="w-20 font-semibold text-slate-400 uppercase text-[10px]">
                    🚢 Navio
                  </span>
                  <span className="font-medium">
                    {e.navio}
                  </span>
                </div>

                <div className="flex items-center text-sm text-slate-600">
                  <span className="w-20 font-semibold text-slate-400 uppercase text-[10px]">
                    👨‍✈️ Capitão
                  </span>
                  <span className="font-medium">
                    {e.capitao}
                  </span>
                </div>

                <div className="flex items-center text-sm text-slate-600">
                  <span className="w-20 font-semibold text-slate-400 uppercase text-[10px]">
                    ⏳ Início
                  </span>
                  <span className="font-medium">
                    {e.data_inicio}
                  </span>
                </div>
              </div>

              <div className="flex gap-3 border-t border-slate-100 pt-5">
                <button
                  onClick={(ev) => {
                    ev.stopPropagation()
                    setEditando(e)
                  }}
                  className="flex-1 px-4 py-2 bg-slate-100 text-slate-700 rounded-lg font-bold text-sm hover:bg-yellow-100 hover:text-yellow-800 transition-colors"
                >
                  Editar
                </button>

                <button
                  onClick={(ev) => {
                    ev.stopPropagation()
                    remover(e.id!)
                  }}
                  className="flex-1 px-4 py-2 bg-slate-100 text-slate-400 rounded-lg font-bold text-sm hover:bg-red-50 hover:text-red-600 transition-colors"
                >
                  Remover
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Exibe mensagem de vazio apenas se não houver erros na tela e o array estiver vazio */}
      {expedicoes.length === 0 && !erro && (
        <div className="text-center py-20 border-2 border-dashed border-slate-200 rounded-3xl">
          <p className="text-slate-400">
            Nenhuma expedição registrada no radar.
          </p>
        </div>
      )}

    </main>
  )
}