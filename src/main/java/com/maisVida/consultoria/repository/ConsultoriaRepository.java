
package com.maisVida.consultoria.repository;

import com.maisVida.consultoria.model.Consultoria;
import org.springframework.data.jpa.repository.JpaRepository;
import java.time.LocalDate;
import java.time.LocalTime;
import org.springframework.stereotype.Repository;

@Repository
public interface ConsultoriaRepository extends JpaRepository<Consultoria, Long> {
    boolean existsByMedicoAndDataAndHora(String medico, LocalDate data, LocalTime hora);
}


