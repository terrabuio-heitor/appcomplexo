import 'dart:convert';
import 'package:http/http.dart' as http;
import 'models.dart';

class AbyssApi {
  // Usando seu IP do Tailscale
  static const String baseUrl = 'http://100.123.137.36:8080';
  //--GET EXPEDICAO
  Future<List<Expedicao>> fetchExpedicoes() async {
    final response = await http.get(Uri.parse('$baseUrl/expedicao'));

    if (response.statusCode == 200) {
      List<dynamic> body = jsonDecode(response.body);
      return body.map((item) => Expedicao.fromJson(item)).toList();
    } else {
      throw Exception('Falha ao carregar expedições');
    }
  }

  Future<List<Evento>> fetchEventos() async {
    final response = await http.get(Uri.parse('$baseUrl/eventos'));

    if (response.statusCode == 200) {
      List<dynamic> body = jsonDecode(response.body);
      return body.map((item) => Evento.fromJson(item)).toList();
    } else {
      throw Exception('Falha ao carregar eventos');
    }
  }

  //-- POST EXPEDICAO
  Future<bool> criarExpedicao(String nome, String navio, String capitao) async {
    final response = await http.post(
      Uri.parse('$baseUrl/expedicao'),
      headers: {"Content-Type": "application/json"},
      body: jsonEncode({
        "nome": nome,
        "navio": navio,
        "capitao": capitao,
        "data_inicio": DateTime.now().toIso8601String(),
        "status": "Preparando Motores", // Status inicial padrão
      }),
    );

    return response.statusCode == 201 || response.statusCode == 200;
  }

  //-- PUT
  Future<bool> atualizarExpedicao(int id, Map<String, dynamic> dados) async {
    final response = await http.put(
      Uri.parse('$baseUrl/expedicao/$id'),
      headers: {"Content-Type": "application/json"},
      body: jsonEncode(dados),
    );

    return response.statusCode == 200;
  }

  // DELETE: Encerra ou remove a expedição do log
  Future<bool> deletarExpedicao(int id) async {
    final response = await http.delete(Uri.parse('$baseUrl/expedicao/$id'));

    // Geralmente 200 (OK) ou 204 (No Content)
    return response.statusCode == 200 || response.statusCode == 204;
  }
}
