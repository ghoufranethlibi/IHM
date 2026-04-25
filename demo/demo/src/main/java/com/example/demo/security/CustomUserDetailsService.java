package com.example.demo.security;

import com.example.demo.entity.Utilisateur;
import com.example.demo.repository.UtilisateurRepository;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CustomUserDetailsService implements UserDetailsService {

    private final UtilisateurRepository utilisateurRepository;

    public CustomUserDetailsService(UtilisateurRepository utilisateurRepository) {
        this.utilisateurRepository = utilisateurRepository;
    }

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        Utilisateur utilisateur = utilisateurRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));

        boolean enabled = !Boolean.FALSE.equals(utilisateur.getEnabled());
        String role = utilisateur.getRole() != null ? utilisateur.getRole().getName() : "ROLE_PATIENT";

        return User.withUsername(utilisateur.getEmail())
                .password(utilisateur.getPassword())
                .authorities(List.of(new SimpleGrantedAuthority(role)))
                .disabled(!enabled)
                .build();
    }
}
