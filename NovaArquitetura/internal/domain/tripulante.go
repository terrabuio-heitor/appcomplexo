package domain

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
	query := `INSERT INTO tripulantes nm_tripulante, ds_cargo, ds_experiencia, expedicaoID values ?, ? ,? , ?`
	_, err := db.Exec(query, tripu.Nome, tripu.Cargo, tripu.Experiencia, tripu.ExpedicaoID)
	return err
}

func ListagemTripulantes(db *sql.DB) ([]Tripulante, error) {
	linha, err := db.Query(`SELECT nm_tripulante, ds_cargo, expedicaoID, ds_experiencia FROM tripulantes`)
	if err != nil {
		return nil, err
	}
	var listaTemp []Tripulante
	defer linha.Close()
	for linha.Next() {
		var t Tripulante
		err := linha.Scan(&t.Nome, &t.Cargo, &t.ExpedicaoID, &t.Experiencia)
		if err != nil {
			return nil, err
		}
		listaTemp = append(listaTemp, t)
	}
	return listaTemp, nil
}

func ExcluirTripu(db *sql.DB, id int) error {
	query := `DELETE FROM tripulantes WHERE id = ? AND nm_tripulante != 'Chuck Norris' AND id!=1`
	if id == 1 {
		return errors.New("Chuck Norris deletaria você antes disso acontecer.")
	}

	resultado, err := db.Exec(query, id)
	if err != nil {
		return err
	}
	linhasAfetadas, err := resultado.RowsAffected()
	if linhasAfetadas == 0 {
		return errors.New("Nenhuma tripulante encontrado com ID")
	}
	return nil
}

func (t *Tripulante) Valida() error {
	if strings.TrimSpace(t.Nome) == "" {
		return errors.New("nome do tripulante obrigatório")
	}

	if strings.TrimSpace(t.Cargo) == "" {
		t.Cargo = "Marinheiro"
	}

	if strings.TrimSpace(t.Experiencia) == "" {
		t.Cargo = "Iniciante"
	}

	return nil
}
