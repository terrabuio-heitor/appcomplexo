import { useState } from "react"
import type { Expedicao } from "../types/Expedicao"

type Props = {
  onSave: (exp: Expedicao) => void
  initial?: Expedicao
}

export default function ExpedicaoForm({ onSave, initial }: Props) {

  const [nome, setNome] = useState(initial?.nome || "")
  const [navio, setNavio] = useState(initial?.navio || "")
  const [capitao, setCapitao] = useState(initial?.capitao || "")

  const submit = (e: React.FormEvent) => {
    e.preventDefault()

    onSave({
      id: initial?.id,
      nome,
      navio,
      capitao
    })

    setNome("")
    setNavio("")
    setCapitao("")
  }

  return (
    <form onSubmit={submit} className="bg-white shadow p-4 rounded mb-6">

      <h2 className="text-xl font-bold mb-3">
        {initial ? "Editar Expedição" : "Nova Expedição"}
      </h2>

      <input
        className="border p-2 w-full mb-2"
        placeholder="Nome"
        value={nome}
        onChange={e => setNome(e.target.value)}
      />

      <input
        className="border p-2 w-full mb-2"
        placeholder="Navio"
        value={navio}
        onChange={e => setNavio(e.target.value)}
      />

      <input
        className="border p-2 w-full mb-3"
        placeholder="Capitão"
        value={capitao}
        onChange={e => setCapitao(e.target.value)}
      />

      <button className="bg-blue-600 text-white px-4 py-2 rounded">
        Salvar
      </button>

    </form>
  )
}