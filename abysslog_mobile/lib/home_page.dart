import 'package:flutter/material.dart';
import 'api.dart';
import 'models.dart';
import 'nova_expedicao_page.dart';

class HomePage extends StatefulWidget {
  const HomePage({super.key});

  @override
  State<HomePage> createState() => _HomePageState();
}

class _HomePageState extends State<HomePage> {
  late Future<List<Expedicao>> _futureExpedicoes;

  @override
  void initState() {
    super.initState();
    _loadExpedicoes();
  }

  void _loadExpedicoes() {
    _futureExpedicoes = AbyssApi().fetchExpedicoes();
  }

  Future<void> _refresh() async {
    setState(() {
      _loadExpedicoes();
    });
  }

  Future<void> _deletarExpedicao(int id) async {
    final sucesso = await AbyssApi().deletarExpedicao(id);

    if (sucesso) {
      _refresh();
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Expedição removida do registro ⚓')),
      );
    }
  }

  Future<void> _atualizarStatus(int id, String novoStatus) async {
    final sucesso = await AbyssApi().atualizarExpedicao(id, {
      "status": novoStatus,
    });

    if (sucesso) {
      _refresh();
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Status atualizado para "$novoStatus"')),
      );
    }
  }

  Future<bool?> _confirmarDelete() {
    return showDialog<bool>(
      context: context,
      builder: (context) {
        return AlertDialog(
          backgroundColor: const Color(0xFF102F44),
          title: const Text(
            'Abandonar Expedição?',
            style: TextStyle(color: Colors.white),
          ),
          content: const Text(
            'Deseja realmente abandonar esta expedição?',
            style: TextStyle(color: Colors.white70),
          ),
          actions: [
            TextButton(
              onPressed: () => Navigator.pop(context, false),
              child: const Text('Cancelar'),
            ),
            TextButton(
              onPressed: () => Navigator.pop(context, true),
              child: const Text(
                'Abandonar',
                style: TextStyle(color: Colors.red),
              ),
            ),
          ],
        );
      },
    );
  }

  void _abrirStatusSheet(Expedicao exp) {
    showModalBottomSheet(
      context: context,
      backgroundColor: const Color(0xFF102F44),
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(16)),
      ),
      builder: (context) {
        return Padding(
          padding: const EdgeInsets.all(16),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              const Text(
                'Alterar Status',
                style: TextStyle(color: Colors.white, fontSize: 18),
              ),
              const SizedBox(height: 16),
              _statusButton(exp.id, 'Em Mar Aberto'),
              _statusButton(exp.id, 'Combate em Curso'),
              _statusButton(exp.id, 'Viagem Concluída'),
            ],
          ),
        );
      },
    );
  }

  Widget _statusButton(int id, String status) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 8),
      child: SizedBox(
        width: double.infinity,
        child: ElevatedButton(
          style: ElevatedButton.styleFrom(
            backgroundColor: const Color(0xFFD4AF37),
          ),
          onPressed: () {
            Navigator.pop(context);
            _atualizarStatus(id, status);
          },
          child: Text(status, style: const TextStyle(color: Colors.black)),
        ),
      ),
    );
  }

  Color _getStatusColor(String status) {
    switch (status.toLowerCase()) {
      case 'ativa':
      case 'em mar aberto':
        return Colors.green;
      case 'finalizada':
      case 'viagem concluída':
        return Colors.blue;
      case 'cancelada':
      case 'combate em curso':
        return Colors.red;
      default:
        return Colors.grey;
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('AbyssLog ⚓'), centerTitle: true),
      floatingActionButton: FloatingActionButton(
        backgroundColor: const Color(0xFFD4AF37),
        child: const Icon(Icons.add, color: Colors.black),
        onPressed: () async {
          final result = await Navigator.push(
            context,
            MaterialPageRoute(builder: (context) => const NovaExpedicaoPage()),
          );

          if (result == true) {
            _refresh();
            ScaffoldMessenger.of(context).showSnackBar(
              const SnackBar(content: Text('Nova expedição registrada! ⚓')),
            );
          }
        },
      ),
      body: FutureBuilder<List<Expedicao>>(
        future: _futureExpedicoes,
        builder: (context, snapshot) {
          if (snapshot.connectionState == ConnectionState.waiting) {
            return const Center(child: CircularProgressIndicator());
          }

          if (snapshot.hasError) {
            return Center(
              child: Text(
                'Erro ao carregar expedições',
                style: TextStyle(color: Colors.red[300]),
              ),
            );
          }

          final expedicoes = snapshot.data ?? [];

          if (expedicoes.isEmpty) {
            return const Center(child: Text('Nenhuma expedição encontrada'));
          }

          return RefreshIndicator(
            onRefresh: _refresh,
            child: ListView.builder(
              padding: const EdgeInsets.all(12),
              itemCount: expedicoes.length,
              itemBuilder: (context, index) {
                final exp = expedicoes[index];

                return Dismissible(
                  key: ValueKey(exp.id),
                  direction: DismissDirection.endToStart,
                  background: Container(
                    alignment: Alignment.centerRight,
                    padding: const EdgeInsets.symmetric(horizontal: 20),
                    decoration: BoxDecoration(
                      color: Colors.red,
                      borderRadius: BorderRadius.circular(12),
                    ),
                    child: const Icon(Icons.delete, color: Colors.white),
                  ),
                  confirmDismiss: (direction) async {
                    return await _confirmarDelete();
                  },
                  onDismissed: (direction) {
                    _deletarExpedicao(exp.id);
                  },
                  child: Card(
                    color: const Color(0xFF102F44),
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(12),
                    ),
                    margin: const EdgeInsets.only(bottom: 12),
                    child: ListTile(
                      contentPadding: const EdgeInsets.all(12),
                      title: Text(
                        exp.nome,
                        style: const TextStyle(
                          fontWeight: FontWeight.bold,
                          color: Colors.white,
                        ),
                      ),
                      subtitle: Padding(
                        padding: const EdgeInsets.only(top: 6),
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text('🚢 Navio: ${exp.navio}'),
                            Text('🧭 Capitão: ${exp.capitao}'),
                          ],
                        ),
                      ),
                      trailing: Container(
                        padding: const EdgeInsets.symmetric(
                          horizontal: 10,
                          vertical: 6,
                        ),
                        decoration: BoxDecoration(
                          color: _getStatusColor(exp.status),
                          borderRadius: BorderRadius.circular(20),
                        ),
                        child: Text(
                          exp.status,
                          style: const TextStyle(
                            color: Colors.white,
                            fontSize: 12,
                          ),
                        ),
                      ),
                      onTap: () {
                        _abrirStatusSheet(exp);
                      },
                    ),
                  ),
                );
              },
            ),
          );
        },
      ),
    );
  }
}
