package sql

import (
	"database/sql"
	"log"

	_ "github.com/lib/pq"
	//_ "github.com/mattn/go-sqlite3"
	//_ "github.com/glebarez/go-sqlite"
)

var DB *sql.DB
var connStr = "host=localhost port=5432 user=postgres password=admin dbname=appcomplexoDB sslmode=disable"

func Conectar() *sql.DB { // Adicione o tipo de retorno aqui
	db, err := sql.Open("postgres", connStr)
	if err != nil {
		log.Fatal(err)
	}

	// Opcional: atribuir à global se você ainda a usa
	DB = db
	CriarTabelas()
	err = db.Ping()
	if err != nil {
		log.Fatal("Erro ao conectar no banco:", err)
	}
	return db // Retorne o valor explicitamente
}

func CriarTabelas() {
	queriesCriação := []string{
		//navio
		`CREATE TABLE IF NOT EXISTS navios (
		id SERIAL PRIMARY KEY,
		nome TEXT NOT NULL,
		tipo TEXT,
		capacidade_tripulacao INT,
		capacidade_carga INT,
		velocidade INT,
		resistencia INT,
		ano_fabricacao INT,
		status TEXT
		);`,

		//expedicao
		`CREATE TABLE IF NOT EXISTS expedicoes (
		id SERIAL PRIMARY KEY,
		nome TEXT,
		navio_id INT,
		capitao TEXT,
		data_inicio DATE,
		status TEXT,

		FOREIGN KEY (navio_id) REFERENCES navios(id) ON DELETE SET NULL
		);`,
		//eventos
		`CREATE TABLE IF NOT EXISTS eventos (
		id SERIAL PRIMARY KEY,
		tipo TEXT NOT NULL,
		descricao TEXT,
		data TIMESTAMP NOT NULL,
		expedicao_id INT NOT NULL,

		CONSTRAINT fk_evento_expedicao
			FOREIGN KEY (expedicao_id)
			REFERENCES expedicoes(id)
			ON DELETE CASCADE
		);`, 
		//tripulantes
		`CREATE TABLE IF NOT EXISTS tripulantes (
		id SERIAL PRIMARY KEY,
		nome TEXT NOT NULL,
		cargo TEXT NOT NULL
		);`,
		//bestiário
		`CREATE TABLE IF NOT EXISTS monstros (
		id SERIAL PRIMARY KEY,
		nome TEXT NOT NULL,
		nivel_perigo INT,
		descricao TEXT
		);`,
		//evento-mostro
		`CREATE TABLE IF NOT EXISTS evento_monstro (
		id SERIAL PRIMARY KEY,
		evento_id INT NOT NULL,
		monstro_id INT NOT NULL,

		FOREIGN KEY (evento_id) REFERENCES eventos(id) ON DELETE CASCADE,
		FOREIGN KEY (monstro_id) REFERENCES monstros(id) ON DELETE CASCADE,

		CONSTRAINT unique_evento_monstro UNIQUE (evento_id, monstro_id)
		);`,
		//recursos
		`CREATE TABLE IF NOT EXISTS recursos (
		id SERIAL PRIMARY KEY,
		nome TEXT NOT NULL,
		quantidade INT NOT NULL,
		expedicao_id INT NOT NULL,

		FOREIGN KEY (expedicao_id) REFERENCES expedicoes(id) ON DELETE CASCADE
		);`,
		//tripulante-expedicao
		`CREATE TABLE IF NOT EXISTS tripulante_expedicao (
		id SERIAL PRIMARY KEY,
		tripulante_id INT NOT NULL,
		expedicao_id INT NOT NULL,
		data_entrada DATE,
		data_saida DATE,
		ativo BOOLEAN DEFAULT true,

		FOREIGN KEY (tripulante_id) REFERENCES tripulantes(id) ON DELETE CASCADE,
		FOREIGN KEY (expedicao_id) REFERENCES expedicoes(id) ON DELETE CASCADE,

		CONSTRAINT unique_tripulante_expedicao UNIQUE (tripulante_id, expedicao_id),

		CONSTRAINT check_ativo_data_saida CHECK (
		(ativo = true AND data_saida IS NULL)
		OR
		(ativo = false AND data_saida IS NOT NULL)
		)
		);`}
	for _, q := range queriesCriação{
	_, err := DB.Exec(q)
	if err != nil {
		log.Fatal(err)
	}
}
	// statementINSERT, _ := DB.Prepare(`
	// INSERT INTO expedicoes (id, nome, navio, capitao, data_inicio, status) VALUES
	// (1, 'Atlantida', 'Lin Gau Yamamoto', 'HMS Britannic II', '2026-01-21', 'a começar'),
	// (2, 'Trasatlantico', 'HMS Titanic', 'Eduard Smith', '1912-04-10', 'viagem interrompida'),
	// (3, 'Desbravamento', 'Santa Maria', 'Pedro Álvares Cabral', '1500-02-10', 'viagem completada'),
	// (5, 'Em busca do baú da Morte', 'Pérola Negra', 'Jack Sparrow', '2026-03-11', 'Preparando Motores'),
	// (11, '(CONFIDENCIAL)', 'USS Indianopolis CA-35', 'Charles Butler McVay III', '2026-03-14', 'Preparando Motores'),
	// (17, 'Descoberta das Américas', 'Caravela', 'Cristóvão Colombo', '2026-03-17', 'Preparando Motores');
	// INSERT INTO eventos (id, tipo, descricao, data, expedicao_id) VALUES
	// (1, '💥 Colisão', 'Colisão com Iceberg.', '1912-03-14 00:00:00', 2),
	// (4, 'Marítimo', 'Saída do Porto', '2026-01-22 00:00:00', 1),
	// (5, 'Marítimo', 'Entrega da Little Boy', '1945-07-16 00:00:00', 11),
	// (9, '⚔️ Ataque pirata', 'Um navio aproximou, levantou as velas negras e foi direto disparando canhões.', '1894-03-21 00:00:00', 5),
	// (11, '🏝 Descoberta de ilha', 'Avistamento de uma grande ilha, de tamanhos continentais...', '0001-01-01 00:00:00', 3);
	// INSERT INTO tripulantes (id, nome, cargo, expedicao_id) VALUES
	// (1, 'Chuck Norris', '💂 Primeiro Imediato', 17);
	// `)
	// statementINSERT.Exec()

	log.Print("⚓ Conexão com o PostGreSQL estabelecida!")
}
