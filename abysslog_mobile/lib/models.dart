class Expedicao {
  final int id;
  final String nome;
  final String navio;
  final String capitao;
  final DateTime dataInicio;
  final String status;

  Expedicao({
    required this.id,
    required this.nome,
    required this.navio,
    required this.capitao,
    required this.dataInicio,
    required this.status,
  });

  factory Expedicao.fromJson(Map<String, dynamic> json) {
    return Expedicao(
      id: json['id'],
      nome: json['nome'],
      navio: json['navio'],
      capitao: json['capitao'],
      dataInicio: DateTime.parse(json['data_inicio']),
      status: json['status'],
    );
  }
}

class Evento {
  final int id;
  final String tipo;
  final String descricao;
  final DateTime data;
  final int expedicaoId;

  Evento({
    required this.id,
    required this.tipo,
    required this.descricao,
    required this.data,
    required this.expedicaoId,
  });

  factory Evento.fromJson(Map<String, dynamic> json) {
    return Evento(
      id: json['id'],
      tipo: json['tipo'],
      descricao: json['descricao'],
      data: DateTime.parse(json['data']),
      expedicaoId: json['expedicao_id'],
    );
  }
}
