import { useState, useEffect } from "react"
//import type { Evento } from "../types/Evento"
import type { Expedicao } from "../types/Expedicao"
import { getExpedicoes } from "../api/expedicaoApi"
import type { Evento, EventoInput } from "../types/Evento"

type Props = {
  onSave: (evento: EventoInput) => void
  initial?: Evento
}

export default function EventoForm({ onSave, initial }: Props) {
  const [tipoEvento, setTipoEvento] = useState(initial?.tipo || "")
  const [detalhes, setDetalhes] = useState(initial?.descricao || "")
  const [data, setData] = useState("")
  const [exID, setExID] = useState<number>(initial?.expedicaoId || 0)

  const [expedicoes, setExpedicoes] = useState<Expedicao[]>([])

  const tiposPredefinidos = [
    "🌊 Tempestade no Atlântico",
    "🐙 Avistamento de criatura marinha",
    "🏝 Descoberta de ilha",
    "⚔️ Ataque pirata",
    "⚓ Parada para suprimentos",
    "🐉 Ataque de Monstro Marinho",
    "💥 Colisão",
    "🧭 Desvio de rota"
  ]

  // 🔥 carregar expedições
  useEffect(() => {
    getExpedicoes().then(res => {
      if (Array.isArray(res)) setExpedicoes(res)
    })
  }, [])

  // 🔥 corrigido: preencher TODOS os campos no edit
useEffect(() => {
  if (initial) {
    setTipoEvento(initial.tipo || "")
    setDetalhes(initial.descricao || "")

    if (initial.data) {
      const d = new Date(initial.data)
      setData(d.toISOString().split("T")[0])
    }

    setExID(initial.expedicaoId || 0)
  }
}, [initial])

  const submit = (e: React.FormEvent) => {
    e.preventDefault()

    if (exID === 0 || !tipoEvento) {
      alert("Selecione a expedição e o tipo de evento!")
      return
    }

    const dataISO = new Date(data).toISOString()

    onSave({
      id: initial?.id,
      descricao: detalhes,
      tipo: tipoEvento,
      data,
      expedicao_id: exID
    })

    if (!initial) {
      setTipoEvento("")
      setDetalhes("")
      setData("")
      setExID(0)
    }
  }

  return (
    <form onSubmit={submit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* COLUNA 1 */}
        <div className="flex flex-col gap-4">

          <div className="flex flex-col gap-1">
            <label className="text-xs font-bold text-slate-500 uppercase ml-1">Ocorrência</label>
            <select
              className="w-full px-4 py-2.5 rounded-lg border border-slate-200 bg-slate-50 focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
              value={tipoEvento}
              onChange={e => setTipoEvento(e.target.value)}
              required
            >
              <option value="">Selecione o tipo de evento...</option>
              {tiposPredefinidos.map(tipo => (
                <option key={tipo} value={tipo}>{tipo}</option>
              ))}
              <option value="Outro">Outro (especificar nos detalhes)</option>
            </select>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs font-bold text-slate-500 uppercase ml-1">Vincular à Expedição</label>
            <select
              className="w-full px-4 py-2.5 rounded-lg border border-slate-200 bg-slate-50 focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
              value={exID}
              onChange={e => setExID(Number(e.target.value))}
              required
            >
              <option value={0}>Selecione a expedição...</option>
              {expedicoes.map(ex => (
                <option key={ex.id} value={ex.id}>
                  ⚓ ID: {ex.id} - {ex.nome || 'Sem nome'}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs font-bold text-slate-500 uppercase ml-1">Data</label>
            <input
              type="date"
              className="w-full px-4 py-2.5 rounded-lg border border-slate-200 bg-slate-50 focus:ring-2 focus:ring-indigo-500 outline-none"
              value={data}
              onChange={e => setData(e.target.value)}
              required
            />
          </div>

        </div>

        {/* COLUNA 2 */}
        <div className="flex flex-col gap-1">
          <label className="text-xs font-bold text-slate-500 uppercase ml-1">Relato do Capitão (Detalhes)</label>
          <textarea
            className="w-full h-full min-h-[150px] px-4 py-2.5 rounded-lg border border-slate-200 bg-slate-50 focus:ring-2 focus:ring-indigo-500 outline-none transition-all resize-none"
            placeholder="Descreva o que aconteceu detalhadamente..."
            value={detalhes}
            onChange={e => setDetalhes(e.target.value)}
            required
          />
        </div>

      </div>

      <div className="flex justify-end">
        <button className="px-10 py-3 font-bold text-white bg-indigo-600 rounded-xl hover:bg-indigo-700 shadow-lg active:scale-95 transition-all">
          {initial ? "💾 Atualizar Diário" : "📜 Registrar no Diário de Bordo"}
        </button>
      </div>
    </form>
  )
}