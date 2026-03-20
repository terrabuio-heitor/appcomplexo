package models

import (
	"database/sql"
	"errors"
	"strings"
)

var nextID = 1
var Tripulantes []Tripulante

type Tripulante struct {
	ID          int    `json:"id"`
	Nome        string `json:"nome"`
	Cargo       string `json:"cargo"`
	Experiencia string `json:"experiencia"`
	ExpedicaoID int    `json:"expedicao_id"`
}

func CriarTripulante(nome, cargo, experiencia string, expedicaoID int) Tripulante {
	novoMarujo := Tripulante{
		Nome:        nome,
		Cargo:       cargo,
		Experiencia: experiencia,
		ExpedicaoID: expedicaoID,
	}
	Tripulantes = append(Tripulantes, novoMarujo)
	return novoMarujo
}

func (tripu Tripulante) SalvarNoBanco(db *sql.DB) error {
	query := `INSERT INTO tripulantes nome, cargo, experiencia, expedicao_id values ?, ? ,? , ?`
	_, err := db.Exec(query, tripu.Nome, tripu.Cargo, tripu.Experiencia, tripu.ExpedicaoID)
	return err
}

func ListagemTripulantes(db *sql.DB) ([]Tripulante error) {
	linha, err := db.Querry(`SELECT nome, cargo, expedicao_id, experiencia FROM tripulantes`)
	if err != nil{
		return err
	}
	defer db.Close()
	var listaTemp[] Tripulante

	for linha.Next(){
		var t Tripulante
		err := t.Scan(&t.Nome,,&t.Cargo,& t.ExpedicaoID, &t.Experiencia)
		if err!= nil {
			return nil
		}
		listaTemp = append(listaTemp, t)
	}
	return listaTemp,nil
}
