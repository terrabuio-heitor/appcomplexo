package sql

import (
	"database/sql"
	"log"

	//_ "github.com/mattn/go-sqlite3"
	_ "github.com/glebarez/go-sqlite"
)

var DB *sql.DB

func Connet() {
	var err error
	DB, err = sql.Open("sqlite", "./sql/database.db")
	if err != nil {
		log.Fatal("Erro ao abrir o banco", err)
	}
	// statement, _ := DB.Prepare(`CREATE TABLE IF NOT EXISTS expedicoes (
	//     id INTEGER PRIMARY KEY AUTOINCREMENT,
	//     nome TEXT,
	//     navio TEXT,
	//     capitao TEXT,
	//     data_inicio DATETIME,
	//     status TEXT
	// )`)
	// statement.Exec()
	log.Print("⚓ Conexão com o SQLite estabelecida!")
}
