package models

import (
	"database/sql"
	"errors"
	"strings"
)

var Eventos []Evento

type Evento struct {
	ID          int    `json:"id"`
	Descricao   string `json:"descricao"`
	Tipo        string `json:"tipo"`
	Data        string `json:"data"`
	ExpedicaoID int    `json:"expedicao_id"`
}

func CriarEvento(descricao, tipo, data string, expedicao_id int) Evento {
	novaEv := Evento{
		Descricao:   descricao,
		Tipo:        tipo,
		Data:        data,
		ExpedicaoID: expedicao_id,
	}
	Eventos = append(Eventos, novaEv)
	return novaEv
}
func ListagemEventos(db *sql.DB) ([]Evento, error) {
	rows, err := db.Query("Select id, descricao, tipo, data, expedicao_id from eventos")
	if err != nil {
		return nil, err

	}
	defer rows.Close()
	var lista []Evento

	for rows.Next() {
		var e Evento
		err := rows.Scan(&e.ID, &e.Descricao, &e.Tipo, &e.Data, &e.ExpedicaoID)
		if err != nil {
			return nil, err
		}
		lista = append(lista, e)
	}
	return lista, nil
}

func (e *Evento) Valida() error {
	if strings.TrimSpace(e.Descricao) == "" {
		//Erro = "Erro no Nome"
		return errors.New("descrição do evento obrigatória")
	}

	if strings.TrimSpace(e.Tipo) == "" {
		//Erro = "Erro no Navio"
		return errors.New("tipo do evento obrigatório")
	}

	if strings.TrimSpace(e.Data) == "" {
		//Erro = "Erro no data"
		return errors.New("data obrigatória")
	}

	return nil
}

func (e *Evento) AlterarEv(db *sql.DB) error {
	if err := e.Valida(); err != nil {
		return err
	}
	query := `UPDATE eventos SET descricao = ?, tipo = ?, data = ?, expedicao_id = ? where id = ?`
	_, err := db.Exec(query, e.Descricao, e.Tipo, e.Data, e.ExpedicaoID, e.ID)
	if err != nil {
		return err
	}
	return nil
}

func ExcluirEv(db *sql.DB, id int) error {
	query := `DELETE FROM eventos WHERE id = ?`
	resultado, err := db.Exec(query, id)
	if err != nil {
		return err
	}
	linhasAfetadas, err := resultado.RowsAffected()
	if linhasAfetadas == 0 {
		return errors.New("Nenhum evento encontrado com ID")
	}
	return nil
}

// db
func (e *Evento) SalvarNoBanco(db *sql.DB) error {
	query := `INSERT INTO eventos (descricao, tipo, data, expedicao_id) VALUES (?, ?, ?, ?)`

	_, err := db.Exec(query, e.Descricao, e.Tipo, e.Data, e.ExpedicaoID)
	return err
}
