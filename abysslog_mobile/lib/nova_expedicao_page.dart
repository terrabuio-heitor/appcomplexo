import 'package:flutter/material.dart';
import 'api.dart';

class NovaExpedicaoPage extends StatefulWidget {
  const NovaExpedicaoPage({super.key});

  @override
  State<NovaExpedicaoPage> createState() => _NovaExpedicaoPageState();
}

class _NovaExpedicaoPageState extends State<NovaExpedicaoPage> {
  final _formKey = GlobalKey<FormState>();

  final _nomeController = TextEditingController();
  final _navioController = TextEditingController();
  final _capitaoController = TextEditingController();

  bool _isLoading = false;

  Future<void> _salvar() async {
    if (!_formKey.currentState!.validate()) return;

    setState(() => _isLoading = true);

    final sucesso = await AbyssApi().criarExpedicao(
      _nomeController.text,
      _navioController.text,
      _capitaoController.text,
    );

    setState(() => _isLoading = false);

    if (sucesso) {
      if (!mounted) return;

      Navigator.pop(context, true);

      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Expedição criada com sucesso! ⚓')),
      );
    } else {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text('Erro ao criar expedição'),
          backgroundColor: Colors.red,
        ),
      );
    }
  }

  InputDecoration _inputDecoration(String label, IconData icon) {
    return InputDecoration(
      labelText: label,
      labelStyle: const TextStyle(color: Colors.white70),
      prefixIcon: Icon(icon, color: const Color(0xFFD4AF37)), // dourado
      filled: true,
      fillColor: const Color(0xFF102F44),
      border: OutlineInputBorder(
        borderRadius: BorderRadius.circular(12),
        borderSide: BorderSide.none,
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Nova Expedição 🚢'), centerTitle: true),
      body: Padding(
        padding: const EdgeInsets.all(16),
        child: Form(
          key: _formKey,
          child: Column(
            children: [
              // Nome da missão
              TextFormField(
                controller: _nomeController,
                style: const TextStyle(color: Colors.white),
                decoration: _inputDecoration('Nome da Missão', Icons.explore),
                validator: (value) =>
                    value == null || value.isEmpty ? 'Campo obrigatório' : null,
              ),

              const SizedBox(height: 16),

              // Navio
              TextFormField(
                controller: _navioController,
                style: const TextStyle(color: Colors.white),
                decoration: _inputDecoration(
                  'Nome do Navio',
                  Icons.directions_boat,
                ),
                validator: (value) =>
                    value == null || value.isEmpty ? 'Campo obrigatório' : null,
              ),

              const SizedBox(height: 16),

              // Capitão
              TextFormField(
                controller: _capitaoController,
                style: const TextStyle(color: Colors.white),
                decoration: _inputDecoration('Nome do Capitão', Icons.person),
                validator: (value) =>
                    value == null || value.isEmpty ? 'Campo obrigatório' : null,
              ),

              const SizedBox(height: 24),

              // Botão
              SizedBox(
                width: double.infinity,
                height: 50,
                child: ElevatedButton(
                  onPressed: _isLoading ? null : _salvar,
                  style: ElevatedButton.styleFrom(
                    backgroundColor: const Color(0xFFD4AF37), // dourado
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(12),
                    ),
                  ),
                  child: _isLoading
                      ? const CircularProgressIndicator(color: Colors.black)
                      : const Text(
                          'Zarpar ⚓',
                          style: TextStyle(
                            color: Colors.black,
                            fontWeight: FontWeight.bold,
                          ),
                        ),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
