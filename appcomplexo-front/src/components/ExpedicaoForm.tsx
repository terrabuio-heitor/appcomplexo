import { useState, useEffect } from "react"
import type { Expedicao } from "../types/Expedicao"

type Props = {
  onSave: (exp: Expedicao) => void
  initial?: Expedicao
}

export default function ExpedicaoForm({ onSave, initial }: Props) {
  const [nome, setNome] = useState(initial?.nome || "")
  const [navio, setNavio] = useState(initial?.navio || "")
  const [capitao, setCapitao] = useState(initial?.capitao || "")

  // Esse useEffect garante que, ao clicar em "Editar" no Dashboard, 
  // os campos do formulário sejam preenchidos com os dados novos.
  useEffect(() => {
    if (initial) {
      setNome(initial.nome || "")
      setNavio(initial.navio || "")
      setCapitao(initial.capitao || "")
    }
  }, [initial])

  const submit = (e: React.FormEvent) => {
    e.preventDefault()

    onSave({
      id: initial?.id,
      nome,
      navio,
      capitao,
      // Mantendo campos que possam vir do initial (como data ou status)
      data_inicio: initial?.data_inicio || new Date().toISOString(),//new Date().toLocaleDateString('pt-BR'),
      

      status: initial?.status || "Planejada"
    })

    // Limpa apenas se não for edição
    if (!initial) {
      setNome("")
      setNavio("")
      setCapitao("")
    }
  }

  return (
    <form onSubmit={submit} className="space-y-6">
      {/* Grid para os inputs ficarem lado a lado em telas maiores */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        
        <div className="flex flex-col gap-1">
          <label className="text-xs font-bold text-slate-500 uppercase ml-1">Nome da Missão</label>
          <input
            className="w-full px-4 py-2.5 rounded-lg border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all placeholder:text-slate-400"
            placeholder="Ex: Rota do Atlântico"
            value={nome}
            onChange={e => setNome(e.target.value)}
            required
          />
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-xs font-bold text-slate-500 uppercase ml-1">Embarcação</label>
          <input
            className="w-full px-4 py-2.5 rounded-lg border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all placeholder:text-slate-400"
            placeholder="Ex: Pérola Negra"
            value={navio}
            onChange={e => setNavio(e.target.value)}
            required
          />
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-xs font-bold text-slate-500 uppercase ml-1">Comandante</label>
          <input
            className="w-full px-4 py-2.5 rounded-lg border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all placeholder:text-slate-400"
            placeholder="Ex: Jack Sparrow"
            value={capitao}
            onChange={e => setCapitao(e.target.value)}
            required
          />
        </div>

      </div>

      <div className="flex justify-end">
        <button className="group relative inline-flex items-center justify-center px-8 py-3 font-bold text-white transition-all duration-200 bg-indigo-600 font-pj rounded-xl focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-600 hover:bg-indigo-700 shadow-md active:scale-95">
          {initial ? "💾 Atualizar Dados" : "🚀 Lançar Expedição"}
        </button>
      </div>
    </form>
  )
}