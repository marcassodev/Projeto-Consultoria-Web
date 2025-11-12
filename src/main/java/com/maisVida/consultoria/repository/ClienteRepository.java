
package com.maisVida.consultoria.repository;

import com.maisVida.consultoria.model.Cliente;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ClienteRepository extends JpaRepository<Cliente, Long> {
    
     Optional<Cliente> findByEmail(String email);
     
    boolean existsByEmail(String email);
    boolean existsByCpf(String cpf);
    boolean existsByNome(String nome);
}
