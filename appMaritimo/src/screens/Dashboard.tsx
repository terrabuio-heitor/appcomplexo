import { useEffect, useState } from "react"
import { View, Text } from "react-native"
import { getExpedicoes } from "../api/expedicaoApi"

export default function Dashboard() {
  const [mensagem, setMensagem] = useState("Carregando...")

  useEffect(() => {
    const carregar = async () => {
      const res = await getExpedicoes()

      if (Array.isArray(res)) {
        setMensagem(`Conectado! ${res.length} expedições encontradas ⚓`)
      } else {
        setMensagem("Erro ao conectar com backend ❌")
        console.log(res)
      }
    }

    carregar()
  }, [])

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text>{mensagem}</Text>
    </View>
  )
}