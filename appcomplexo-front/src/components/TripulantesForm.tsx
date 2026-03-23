import { useState, useEffect } from "react"
import type { Tripulante } from "../types/Tripulantes"
import type { Expedicao } from "../types/Expedicao"
import { getExpedicoes } from "../api/expedicaoApi"

type Props = {
  onSave: (trip: Tripulante) => void
}

export default function TripulanteForm({ onSave }: Props) {
  const [nome, setNome] = useState("")
  const [cargo, setCargo] = useState("")
  const [experiencia, setExperiencia] = useState("")
  const [expedicaoId, setExpedicaoId] = useState<number>(0)

  const [expedicoes, setExpedicoes] = useState<Expedicao[]>([])

  // Combobox estilos
  const cargos = [
    "🧭 Navegador",
    "⚓ Marinheiro",
    "💣 Artilheiro",
    "🩺 Médico",
    "🧠 Estrategista",
    "🏴‍☠️ Capitão"
  ]

  const experiencias = [
    "🟢 Iniciante",
    "🟡 Experiente",
    "🔴 Veterano",
    "☠️ Lenda dos Mares"
  ]

  useEffect(() => {
    getExpedicoes().then(res => {
      if (Array.isArray(res)) setExpedicoes(res)
    })
  }, [])

  const submit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!nome || expedicaoId === 0) {
      alert("Preencha nome e expedição!")
      return
    }

    onSave({
      nome,
      cargo,
      experiencia,
      expedicao_id: expedicaoId
    })

    setNome("")
    setCargo("")
    setExperiencia("")
    setExpedicaoId(0)
  }

  return (
    <form onSubmit={submit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        {/* COLUNA 1 */}
        <div className="flex flex-col gap-4">

          {/* Nome */}
          <div className="flex flex-col gap-1">
            <label className="text-xs font-bold text-slate-500 uppercase ml-1">
              Nome do Tripulante
            </label>
            <input
              className="w-full px-4 py-2.5 rounded-lg border border-slate-200 bg-slate-50 focus:ring-2 focus:ring-indigo-500 outline-none"
              value={nome}
              onChange={e => setNome(e.target.value)}
              required
            />
          </div>

          {/* Cargo */}
          <div className="flex flex-col gap-1">
            <label className="text-xs font-bold text-slate-500 uppercase ml-1">
              Cargo
            </label>
            <select
              className="w-full px-4 py-2.5 rounded-lg border border-slate-200 bg-slate-50 focus:ring-2 focus:ring-indigo-500"
              value={cargo}
              onChange={e => setCargo(e.target.value)}
            >
              <option value="">Selecione um cargo...</option>
              {cargos.map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          {/* Experiência */}
          <div className="flex flex-col gap-1">
            <label className="text-xs font-bold text-slate-500 uppercase ml-1">
              Experiência
            </label>
            <select
              className="w-full px-4 py-2.5 rounded-lg border border-slate-200 bg-slate-50 focus:ring-2 focus:ring-indigo-500"
              value={experiencia}
              onChange={e => setExperiencia(e.target.value)}
            >
              <option value="">Nível de experiência...</option>
              {experiencias.map(exp => (
                <option key={exp} value={exp}>{exp}</option>
              ))}
            </select>
          </div>

        </div>

        {/* COLUNA 2 */}
        <div className="flex flex-col gap-4">

          {/* Expedição */}
          <div className="flex flex-col gap-1">
            <label className="text-xs font-bold text-slate-500 uppercase ml-1">
              Expedição
            </label>
            <select
              className="w-full px-4 py-2.5 rounded-lg border border-slate-200 bg-slate-50 focus:ring-2 focus:ring-indigo-500"
              value={expedicaoId}
              onChange={e => setExpedicaoId(Number(e.target.value))}
              required
            >
              <option value={0}>Selecione a expedição...</option>
              {expedicoes.map(ex => (
                <option key={ex.id} value={ex.id}>
                  ⚓ ID: {ex.id} - {ex.nome || "Sem nome"}
                </option>
              ))}
            </select>
          </div>

          {/* Preview estiloso */}
          <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-4">
            <p className="text-xs text-indigo-500 font-bold uppercase mb-1">
              Preview
            </p>
            <p className="font-bold text-slate-800">{nome || "Nome..."}</p>
            <p className="text-sm text-indigo-600">{cargo || "Cargo..."}</p>
            <p className="text-xs text-slate-500">
              {experiencia || "Experiência..."}
            </p>
          </div>

        </div>
      </div>

      <div className="flex justify-end">
        <button className="px-10 py-3 font-bold text-white bg-indigo-600 rounded-xl hover:bg-indigo-700 shadow-lg active:scale-95 transition-all">
          ⚓ Alistar Tripulante
        </button>
      </div>
    </form>
  )
}