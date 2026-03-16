import { useState } from "react"
import type { Tripulante } from "../types/Tripulantes"

type Props = { onSave: (trip: Tripulante) => void }

export default function TripulanteForm({ onSave }: Props) {
  const [nome, setNome] = useState("")
  const [funcao, setFuncao] = useState("")

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave({ nome, funcao, experiencia: 'Novato' })
    setNome(""); setFuncao("")
  }

  return (
    <form onSubmit={submit} className="flex gap-4 items-end bg-slate-50 p-4 rounded-xl border border-slate-200">
      <div className="flex-1">
        <label className="text-[10px] font-bold text-slate-400 uppercase">Nome do Marujo</label>
        <input 
          className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-500"
          value={nome} onChange={e => setNome(e.target.value)} required 
        />
      </div>
      <div className="flex-1">
        <label className="text-[10px] font-bold text-slate-400 uppercase">Função</label>
        <input 
          className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-500"
          value={funcao} onChange={e => setFuncao(e.target.value)} required 
        />
      </div>
      <button className="bg-indigo-600 text-white px-6 py-2 rounded-lg font-bold hover:bg-indigo-700 transition-colors">
        Alistar
      </button>
    </form>
  )
}