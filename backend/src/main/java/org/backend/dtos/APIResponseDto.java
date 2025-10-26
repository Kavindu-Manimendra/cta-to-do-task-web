package org.backend.dtos;

import lombok.Data;

@Data
public class APIResponseDto {
    private String message;
    private Object data = null;
}
