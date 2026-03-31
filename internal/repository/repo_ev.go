package repository

import (
	"application-complexa/internal/domain"
	"database/sql"
	"errors"
)

type EventoRepository struct {
	db *sql.DB
}

func NovaEventoRepository(db *sql.DB) *EventoRepository {
	return &EventoRepository{db: db}
}

func (r *EventoRepository) SalvarNoBanco(e domain.Evento) error {
	query := `INSERT INTO eventos 
	(tipo, descricao, data, expedicao_id) 
	VALUES ($1, $2, $3, $4) RETURNING id`
	return r.db.QueryRow(query, e.Tipo, e.Descricao, e.Data, e.ExpedicaoID).Scan(&e.ID)
}

// CRUD INICIA AQUI
func (r *EventoRepository) ListagemEv() ([]domain.Evento, error) {
	rows, err := r.db.Query("Select id, tipo, descricao, data, expedicao_id FROM eventos")
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	var lista []domain.Evento

	for rows.Next() {
		var e domain.Evento
		err := rows.Scan(&e.ID, &e.Tipo, &e.Descricao, &e.Data, &e.ExpedicaoID)
		if err != nil {
			return nil, err
		}
		lista = append(lista, e)
	}
	return lista, nil
}
func (r *EventoRepository) AlterarEv(e *domain.Evento) error {
	query := `UPDATE eventos SET tipo = $1, descricao = $2, data = $3, expedicao_id = $4 WHERE id = $5`
	_, err := r.db.Exec(query, e.Tipo, e.Descricao, e.Data, e.ExpedicaoID, e.ID)
	if err != nil {
		return err
	}
	return nil
}

func (r *EventoRepository) ExcluirEv(id int) error {
	query := `DELETE FROM eventos WHERE id = $1`
	resultado, err := r.db.Exec(query, id)
	if err != nil {
		return err
	}
	linhasAfetadas, err := resultado.RowsAffected()
	if linhasAfetadas == 0 {
		return errors.New("Nenhum evento encontrada com ID")
	}
	return nil
}
