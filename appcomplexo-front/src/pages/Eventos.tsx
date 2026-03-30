import { useState, useEffect } from "react"
import type { Evento, EventoInput } from "../types/Evento"
import EventoForm from "../components/EventoForm"
import { getEventos, criarEvento, deletarEvento, atualizarEvento } from "../api/eventoApi"

export default function Eventos() {
  const [eventos, setEventos] = useState<Evento[]>([])
  const [editando, setEditando] = useState<Evento | null>(null)

  const carregarDados = async () => {
    const data = await getEventos()
    if (Array.isArray(data)) setEventos(data)
  }

  useEffect(() => { carregarDados() }, [])

  const salvar = async (evento: EventoInput) => {
    if (evento.id) {
      await atualizarEvento(evento)
    } else {
      await criarEvento(evento)
    }
    setEditando(null)
    carregarDados()
  }

  // Função para definir a cor da Tag baseada no tipo de evento
  const getTagColor = (tipo: string) => {
    const t = tipo.toLowerCase()
    if (t.includes("ataque") || t.includes("colisão") || t.includes("monstro")) 
      return "bg-red-100 text-red-700 border-red-200"
    if (t.includes("tempestade") || t.includes("desvio")) 
      return "bg-amber-100 text-amber-700 border-amber-200"
    if (t.includes("descoberta") || t.includes("ilha")) 
      return "bg-emerald-100 text-emerald-700 border-emerald-200"
    return "bg-sky-100 text-sky-700 border-sky-200" // Padrão
  }

  return (
    <div className="min-h-screen bg-slate-50 p-6 font-sans">
      <main className="max-w-6xl mx-auto">
        
        <section className="mb-10 bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
          <h2 className="text-xl font-bold mb-6 text-slate-800 flex items-center gap-2">
            {editando ? "📝 Editando Registro #" + editando.id : "📜 Novo Registro de Bordo"}
          </h2>
          <EventoForm onSave={salvar} initial={editando || undefined} />
        </section>

        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Ocorrência</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Relato Detalhado</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Data</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Expedição</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {eventos.map(e => (
                <tr key={e.id} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-[11px] font-black uppercase border ${getTagColor(e.tipo || "")}`}>
                      {e.tipo}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-600 italic">
                    "{e.descricao}"
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-500 font-mono">
                    {e.data.toLocaleDateString("pt-BR")}
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm font-bold text-slate-700 bg-slate-100 px-2 py-1 rounded">
                      ⚓ {e.expedicaoId}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex gap-2 justify-end opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={() => setEditando(e)} className="text-indigo-600 font-bold text-xs hover:underline">EDITAR</button>
                      <button onClick={() => e.id && deletarEvento(e.id).then(carregarDados)} className="text-red-500 font-bold text-xs hover:underline">REMOVER</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {eventos.length === 0 && (
            <div className="p-12 text-center text-slate-400">Nenhum evento registrado no logbook.</div>
          )}
        </div>
      </main>
    </div>
  )
}