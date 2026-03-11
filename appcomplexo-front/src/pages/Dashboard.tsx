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
    if (confirm("Deseja realmente excluir esta expedição?")) {
      await deletarExpedicao(id)
      carregar()
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
      {/* Header Principal */}
      <header className="bg-indigo-900 text-white py-8 px-6 shadow-lg mb-8">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight flex items-center gap-3">
              <span className="text-4xl">⚓</span> 
              Sistema de Expedições Marítimas
            </h1>
            <p className="text-indigo-200 mt-1 italic">Logística de frotas e rotas em tempo real</p>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 pb-20">
        
        {/* Seção do Formulário - Agora dentro de um Card */}
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

        {/* Grid de Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {expedicoes.map(e => (
            <div
              key={e.id}
              className="bg-white border border-slate-200 rounded-2xl shadow-sm hover:shadow-md transition-all overflow-hidden group"
            >
              {/* Faixa de Status Lateral */}
              <div className="h-2 bg-indigo-500 group-hover:bg-indigo-600 transition-colors"></div>
              
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <h2 className="text-xl font-bold text-slate-800 leading-tight">{e.nome}</h2>
                  <span className="bg-indigo-50 text-indigo-700 text-[10px] uppercase tracking-widest font-bold px-2 py-1 rounded-md border border-indigo-100">
                    {e.status}
                  </span>
                </div>

                <div className="space-y-3 mb-6">
                  <div className="flex items-center text-sm text-slate-600">
                    <span className="w-20 font-semibold text-slate-400 uppercase text-[10px]">🚢 Navio</span>
                    <span className="font-medium">{e.navio}</span>
                  </div>
                  <div className="flex items-center text-sm text-slate-600">
                    <span className="w-20 font-semibold text-slate-400 uppercase text-[10px]">👨‍✈️ Capitão</span>
                    <span className="font-medium">{e.capitao}</span>
                  </div>
                  <div className="flex items-center text-sm text-slate-600">
                    <span className="w-20 font-semibold text-slate-400 uppercase text-[10px]">⏳ Início</span>
                    <span className="font-medium">{e.data_inicio}</span>
                  </div>
                </div>

                {/* Ações */}
                <div className="flex gap-3 border-t border-slate-100 pt-5">
                  <button
                    onClick={() => setEditando(e)}
                    className="flex-1 px-4 py-2 bg-slate-100 text-slate-700 rounded-lg font-bold text-sm hover:bg-yellow-100 hover:text-yellow-800 transition-colors"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => remover(e.id!)}
                    className="flex-1 px-4 py-2 bg-slate-100 text-slate-400 rounded-lg font-bold text-sm hover:bg-red-50 hover:text-red-600 transition-colors"
                  >
                    Remover
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {expedicoes.length === 0 && (
          <div className="text-center py-20 border-2 border-dashed border-slate-200 rounded-3xl">
            <p className="text-slate-400">Nenhuma expedição registrada no radar.</p>
          </div>
        )}
      </main>
    </div>
  )
}