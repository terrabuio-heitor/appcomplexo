package sql

import (
	"database/sql"
	"log"

	_ "github.com/lib/pq"
	//_ "github.com/mattn/go-sqlite3"
	//_ "github.com/glebarez/go-sqlite"
)

var DB *sql.DB

func Connet() {
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

	log.Print("⚓ Conexão com o PostGreSQL estabelecida!")
}
