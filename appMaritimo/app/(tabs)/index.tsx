import { useState, useCallback } from "react"
import { View, Text, FlatList, TouchableOpacity } from "react-native"
import { router, useFocusEffect } from "expo-router"
import { getExpedicoes } from "../../src/api/expedicaoApi"
import type { Expedicao } from "../../src/types/Expedicao"

export default function HomeScreen() {
  const [expedicoes, setExpedicoes] = useState<Expedicao[]>([])
  const [erro, setErro] = useState(false)
  const [loading, setLoading] = useState(false)

  const carregar = async () => {
    setLoading(true)
    setErro(false)

    const res = await getExpedicoes()

    if (Array.isArray(res)) {
      setExpedicoes(res)
    } else {
      setErro(true)
    }

    setLoading(false)
  }

  useFocusEffect(
    useCallback(() => {
      carregar()
    }, [])
  )

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>Carregando... ⚓</Text>
      </View>
    )
  }

  if (erro) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>Erro ao carregar ❌</Text>
        <TouchableOpacity onPress={carregar}>
          <Text style={{ marginTop: 10, color: "blue" }}>
            🔄 Tentar novamente
          </Text>
        </TouchableOpacity>
      </View>
    )
  }

  return (
    <View style={{ flex: 1, padding: 16 }}>

      <TouchableOpacity
        onPress={() => router.push("/expedicao/nova")}
        style={{
          backgroundColor: "#22c55e",
          padding: 12,
          borderRadius: 10,
          marginBottom: 12,
          alignItems: "center"
        }}
      >
        <Text style={{ color: "#fff", fontWeight: "bold" }}>
          ➕ Nova Expedição
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={carregar}
        style={{
          backgroundColor: "#6366f1",
          padding: 12,
          borderRadius: 10,
          marginBottom: 12,
          alignItems: "center"
        }}
      >
        <Text style={{ color: "#fff", fontWeight: "bold" }}>
          🔄 Recarregar
        </Text>
      </TouchableOpacity>

      <FlatList
        data={expedicoes}
        keyExtractor={(item) => item.id!.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => router.push(`/expedicao/${item.id}`)}
            style={{
              backgroundColor: "#ffffff",
              padding: 18,
              borderRadius: 16,
              marginBottom: 14,
              elevation: 3
            }}
          >
            <Text style={{ fontSize: 20, fontWeight: "bold" }}>
              ⚓ {item.nome}
            </Text>

            <Text style={{ color: "#555" }}>
              🚢 {item.navio}
            </Text>

            <Text style={{ color: "#555" }}>
              👨‍✈️ {item.capitao}
            </Text>
          </TouchableOpacity>
        )}
      />
    </View>
  )
}