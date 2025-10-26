package org.backend.exception;

public class CreateTaskFailedException extends RuntimeException {
    public CreateTaskFailedException(String message) {
        super(message);
    }
}
