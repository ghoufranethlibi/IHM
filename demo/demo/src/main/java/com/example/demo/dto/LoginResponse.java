package com.example.demo.dto;

import com.example.demo.entity.Utilisateur;
import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class LoginResponse {
    private AuthUser user;
    private String token;
    private long expiresInSeconds;

    public static LoginResponse from(Utilisateur user, String token, long expiresInSeconds) {
        return new LoginResponse(toAuthUser(user), token, expiresInSeconds);
    }

    public static AuthUser toAuthUser(Utilisateur user) {
        String roleName = user.getRole() != null ? user.getRole().getName() : "ROLE_PATIENT";
        return new AuthUser(
                String.valueOf(user.getId()),
                "",
                "",
                mapRole(roleName),
                user.getEmail()
        );
    }

    private static String mapRole(String roleName) {
        return switch (roleName) {
            case "ROLE_ADMIN" -> "Admin";
            case "ROLE_MEDECIN" -> "Medecin";
            case "ROLE_INFIRMIER" -> "Infirmier";
            case "ROLE_AGENT", "ROLE_AGENT_MEDICAL" -> "AgentMedical";
            case "ROLE_PATIENT" -> "Patient";
            default -> "Patient";
        };
    }

    @Data
    @AllArgsConstructor
    public static class AuthUser {
        private String id;
        private String prenom;
        private String nom;
        private String role;
        private String email;
    }
}
