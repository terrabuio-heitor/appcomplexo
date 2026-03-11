// package main
package models

import (
	"database/sql"
	"errors"
	"strings"
)

var Expedicoes []Expedicao

// var proximoID = 1
var Erro string = ""

type Expedicao struct {
	ID          int    `json:"id"`
	Nome        string `json:"nome"`
	Navio       string `json:"navio"`
	Capitao     string `json:"capitao"`
	Data_inicio string `json:"data_inicio"`
	Status      string `json:"status"`
}

func CriarEx(nome, navio, capitao string, data_inicio string) Expedicao {
	nova := Expedicao{
		Nome:        nome,
		Navio:       navio,
		Capitao:     capitao,
		Data_inicio: data_inicio,
		Status:      "Preparando Motores",
	}
	Expedicoes = append(Expedicoes, nova)
	//proximoID++
	return nova
}

func ListagemGeral(db *sql.DB) ([]Expedicao, error) {
	rows, err := db.Query("Select id, nome, navio, capitao, data_inicio, status FROM expedicoes")
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	var lista []Expedicao

	for rows.Next() {
		var e Expedicao
		err := rows.Scan(&e.ID, &e.Nome, &e.Navio, &e.Capitao, &e.Data_inicio, &e.Status)
		if err != nil {
			return nil, err
		}
		lista = append(lista, e)
	}
	return lista, nil
}

func (e *Expedicao) Valida() error {
	if strings.TrimSpace(e.Nome) == "" {
		Erro = "Erro no Nome"
		return errors.New("nome da expedição obrigatório")
	}

	if strings.TrimSpace(e.Navio) == "" {
		Erro = "Erro no Navio"
		return errors.New("nome do navio obrigatório")
	}

	if strings.TrimSpace(e.Capitao) == "" {
		Erro = "Erro no Capitao"
		return errors.New("capitão obrigatório")
	}

	return nil
}

func (e *Expedicao) SalvarNoBanco(db *sql.DB) error {
	query := `INSERT INTO expedicoes (nome, navio, capitao, data_inicio, status) VALUES (?, ?, ?, ?, ?)`

	_, err := db.Exec(query, e.Nome, e.Navio, e.Capitao, e.Data_inicio, e.Status)
	return err
}

// func main() {
// 	fmt.Println("--- 🌊 Sistema de Gestão de Viagens Marítimas ---")

// 	// Criando a primeira jornada!
// 	viagem := CriarEx("Em Busca do Kraken", "Pérola Negra", "Jack Sparrow")

// 	fmt.Printf("Expedição '%s' iniciada com o navio '%s' sob o comando de %s!\n",
// 		viagem.Nome, viagem.Navio, viagem.Capitao)
// 	fmt.Println("Status atual:", viagem.Status)
// }
