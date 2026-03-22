package com.smart_campus.smart_campus.user.dto;

import lombok.Data;

@Data
public class DeleteAccountRequest {
    // Null is acceptable for OAuth-only accounts (no password set)
    private String password;
}