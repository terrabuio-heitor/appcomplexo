package sql

import (
	"database/sql"
	"log"

	_ "github.com/lib/pq"
	//_ "github.com/mattn/go-sqlite3"
	//_ "github.com/glebarez/go-sqlite"
)

var DB *sql.DB

func Connect() {
	var err error
	connStr := "host=localhost port=5432 user=postgres password=admin dbname=appcomplexoDB sslmode=disable"
	DB, err = sql.Open("postgres", connStr)
	//DB, err = sql.Open("sqlite", "./sql/database.db")

	if err != nil {
		log.Fatal("Erro ao abrir o banco", err)
	}

	//--era para funfar no SQLite mas nem nele funfava:
	// statement, _ := DB.Prepare(`CREATE TABLE IF NOT EXISTS expedicoes (
	//     id INTEGER PRIMARY KEY AUTOINCREMENT,
	//     nome TEXT,
	//     navio TEXT,
	//     capitao TEXT,
	//     data_inicio DATETIME,
	//     status TEXT
	// )`)
	// statement.Exec()
	//main tabela
	statement, _ := DB.Prepare(`CREATE TABLE expedicoes (
		id SERIAL PRIMARY KEY,
		nome TEXT,
		navio TEXT,
		capitao TEXT,
		data_inicio DATE,
		status TEXT
	);`)
	statement.Exec()
	//eventos
	statement, _ = DB.Prepare(`CREATE TABLE eventos (
		id SERIAL PRIMARY KEY,
		tipo TEXT NOT NULL,
		descricao TEXT,
		data TIMESTAMP NOT NULL,
		expedicao_id INT NOT NULL,

		CONSTRAINT fk_evento_expedicao
			FOREIGN KEY (expedicao_id)
			REFERENCES expedicoes(id)
			ON DELETE CASCADE
		);`)
	statement.Exec()
	//tripulantes
	statement, _ = DB.Prepare(`CREATE TABLE tripulantes (
		id SERIAL PRIMARY KEY,
		nome TEXT NOT NULL,
		cargo TEXT NOT NULL,
		expedicao_id INT NOT NULL,
		
		CONSTRAINT fk_expedicao
			FOREIGN KEY (expedicao_id)
			REFERENCES expedicoes(id)
			ON DELETE CASCADE
	);`)
	statement.Exec()
	//monstros
	statement, _ = DB.Prepare(`CREATE TABLE monstros (
		id SERIAL PRIMARY KEY,
		nome TEXT NOT NULL,
		nivel_perigo INT,
		descricao TEXT
	);`)
	statement.Exec()

	//n para n Montros Eventos
	statement, _ = DB.Prepare(`CREATE TABLE evento_monstro (
		id SERIAL PRIMARY KEY,
		evento_id INT NOT NULL,
		monstro_id INT NOT NULL,

		FOREIGN KEY (evento_id) REFERENCES eventos(id) ON DELETE CASCADE,
		FOREIGN KEY (monstro_id) REFERENCES monstros(id) ON DELETE CASCADE
	);`)
	statement.Exec()
	//recursos do navio
	statement, _ = DB.Prepare(`CREATE TABLE recursos (
		id SERIAL PRIMARY KEY,
		nome TEXT NOT NULL,
		quantidade INT NOT NULL,
		expedicao_id INT NOT NULL,

		FOREIGN KEY (expedicao_id) REFERENCES expedicoes(id) ON DELETE CASCADE
	);`)
	statement.Exec()

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
