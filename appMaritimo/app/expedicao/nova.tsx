import { View, Text, TextInput, TouchableOpacity } from "react-native"
import { useState } from "react"
import { criarExpedicao } from "../../src/api/expedicaoApi"
import { router } from "expo-router"
//import { carregar } from "../(tabs)/index"

export default function NovaExpedicao() {
  const [nome, setNome] = useState("")
  const [navio, setNavio] = useState("")
  const [capitao, setCapitao] = useState("")

  const salvar = async () => {
  const res = await criarExpedicao({
    nome,
    navio,
    capitao,
    status: "Planejada",
    data_inicio: new Date().toISOString()
  })

  if (res && typeof res === "object" && "mensagem" in res) {
    alert("Erro ao criar ❌")
    return
  }
  //carregar()
  router.back() // 🔥 VOLTA PRA LISTA
}
  return (
    <View style={{ flex: 1, padding: 16 }}>
      <Text>Nome:</Text>
      <TextInput
        value={nome}
        onChangeText={setNome}
        style={{ borderWidth: 1, marginBottom: 10, padding: 8 }}
      />

      <Text>Navio:</Text>
      <TextInput
        value={navio}
        onChangeText={setNavio}
        style={{ borderWidth: 1, marginBottom: 10, padding: 8 }}
      />

      <Text>Capitão:</Text>
      <TextInput
        value={capitao}
        onChangeText={setCapitao}
        style={{ borderWidth: 1, marginBottom: 10, padding: 8 }}
      />

      <TouchableOpacity
        onPress={salvar}
        style={{
          backgroundColor: "green",
          padding: 12,
          borderRadius: 10
        }}

        
      >
        <Text style={{ color: "#fff" }}>Salvar</Text>
      </TouchableOpacity>
    </View>
  )
}