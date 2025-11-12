package com.maisVida.consultoria.controller;

import com.maisVida.consultoria.model.Consultoria;
import com.maisVida.consultoria.repository.ConsultoriaRepository;
import com.maisVida.consultoria.service.ConsultoriaService;
import java.util.Collections;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/consultorias")
public class ConsultoriaController {

    @Autowired
    private ConsultoriaRepository consultoriaRepository;

    @GetMapping
    public List<Consultoria> listarConsultorias() {
        return consultoriaRepository.findAll();
    }

    @Autowired
    private ConsultoriaService consultoriaService;

    @PostMapping
    public ResponseEntity<?> criar(@RequestBody Consultoria consultoria) {
        try {
            Consultoria nova = consultoriaService.criarConsultoria(consultoria);
            return ResponseEntity.ok(nova);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Collections.singletonMap("error", e.getMessage()));
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> excluirConsultoria(@PathVariable Long id) {
        try {
            consultoriaService.deletarConsultoria(id);
            return ResponseEntity.ok("Consultoria excluída com sucesso!");
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}
