package repository

import (
	"application-complexa/internal/domain"
	"database/sql"
	"errors"
)

type ExpedicaoRepository struct {
	db *sql.DB
}

func NovaExpedicaoRepository(db *sql.DB) *ExpedicaoRepository {
	return &ExpedicaoRepository{db: db}
}

func (r *ExpedicaoRepository) SalvarNoBanco(e domain.Expedicao) error {
	query := `INSERT INTO expedicoes 
	(nome, navio, capitao, data_inicio, status) 
	VALUES ($1, $2, $3, $4, $5) RETURNING id`
	return r.db.QueryRow(query, e.Nome, e.Navio, e.Capitao, e.Data_inicio, e.Status).Scan(&e.ID)
}

func (r *ExpedicaoRepository) ListagemEx() ([]domain.Expedicao, error) {
	rows, err := r.db.Query("Select id, nome, navio, capitao, data_inicio, status FROM expedicoes")
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	var lista []domain.Expedicao

	for rows.Next() {
		var e domain.Expedicao
		err := rows.Scan(&e.ID, &e.Nome, &e.Navio, &e.Capitao, &e.Data_inicio, &e.Status)
		if err != nil {
			return nil, err
		}
		lista = append(lista, e)
	}
	return lista, nil
}
func (r *ExpedicaoRepository) AlterarEx(e *domain.Expedicao) error {
	query := `UPDATE expedicoes SET nome = $1, navio = $2, capitao = $3, status = $4 WHERE id = $5`
	_, err := r.db.Exec(query, e.Nome, e.Navio, e.Capitao, e.Status, e.ID)
	if err != nil {
		return err
	}
	return nil
}

func (r *ExpedicaoRepository) ExcluirEx(id int) error {
	query := `DELETE FROM expedicoes WHERE id = $1`
	resultado, err := r.db.Exec(query, id)
	if err != nil {
		return err
	}
	linhasAfetadas, err := resultado.RowsAffected()
	if linhasAfetadas == 0 {
		return errors.New("Nenhuma expedição encontrada com ID")
	}
	return nil
}

/* Código ANTIGO
func (e *Expedicao) SalvarNoBanco(db *sql.DB) error {
	query := `INSERT INTO expedicoes
	(nome, navio, capitao, data_inicio, status)
	VALUES ($1, $2, $3, $4, $5)`
	//para voltar a usar o SQLite tem que colocar ? em vez do $1

	_, err := db.Exec(query, e.Nome, e.Navio, e.Capitao, e.Data_inicio, e.Status)
	return err
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
func ExcluirEx(db *sql.DB, id int) error {
	query := `DELETE FROM expedicoes WHERE id = $1`
	resultado, err := db.Exec(query, id)
	if err != nil {
		return err
	}
	linhasAfetadas, err := resultado.RowsAffected()
	if linhasAfetadas == 0 {
		return errors.New("Nenhuma expedição encontrada com ID")
	}
	return nil
}

func (e *Expedicao) AlterarEx(db *sql.DB) error {
	if err := e.Valida(); err != nil {
		return err
	}
	query := `UPDATE expedicoes SET nome = $1, navio = $2, capitao = $3, status = $4 WHERE id = $5`
	_, err := db.Exec(query, e.Nome, e.Navio, e.Capitao, e.Status, e.ID)
	if err != nil {
		return err
	}
	return nil
}
*/
