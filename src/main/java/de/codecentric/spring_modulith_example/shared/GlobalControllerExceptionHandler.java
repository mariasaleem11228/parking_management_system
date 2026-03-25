package de.codecentric.spring_modulith_example.shared;

import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.context.request.WebRequest;
import org.springframework.web.servlet.mvc.method.annotation.ResponseEntityExceptionHandler;
import org.springframework.web.server.ResponseStatusException;

import java.util.NoSuchElementException;

@ControllerAdvice
class GlobalControllerExceptionHandler extends ResponseEntityExceptionHandler {
    @Override
    protected ResponseEntity<Object> handleMethodArgumentNotValid(
        MethodArgumentNotValidException ex,
        HttpHeaders headers,
        HttpStatusCode status,
        WebRequest request
    ) {
        var message = ex.getBindingResult().getFieldErrors().stream()
            .findFirst()
            .map(fieldError -> fieldError.getDefaultMessage())
            .orElse("Validation failed");
        return buildError(HttpStatus.BAD_REQUEST, message, request);
    }

    @ExceptionHandler(ResponseStatusException.class)
    protected ResponseEntity<Object> handleResponseStatusException(ResponseStatusException ex, WebRequest request) {
        var message = ex.getReason() == null ? "Request failed" : ex.getReason();
        return buildError(ex.getStatusCode(), message, request);
    }

    @ExceptionHandler(NoSuchElementException.class)
    protected ResponseEntity<Object> handleConflict(RuntimeException ex, WebRequest request) {
        return buildError(HttpStatus.NOT_FOUND, "Resource not found", request);
    }

    @ExceptionHandler(NumberFormatException.class)
    protected ResponseEntity<Object> handleUnprocessableEntity(RuntimeException ex, WebRequest request) {
        return buildError(HttpStatus.UNPROCESSABLE_CONTENT, "Malformed number in request", request);
    }

    @ExceptionHandler(Exception.class)
    protected ResponseEntity<Object> handleAnyException(Exception ex, WebRequest request) {
        return buildError(HttpStatus.INTERNAL_SERVER_ERROR, "Unexpected server error", request);
    }

    private ResponseEntity<Object> buildError(org.springframework.http.HttpStatusCode status, String message, WebRequest request) {
        var httpStatus = HttpStatus.resolve(status.value());
        if (httpStatus == null) {
            httpStatus = HttpStatus.INTERNAL_SERVER_ERROR;
        }
        var payload = new ErrorResponse(message, httpStatus.value());
        return handleExceptionInternal(new RuntimeException(message), payload, new HttpHeaders(), httpStatus, request);
    }

    private record ErrorResponse(String message, int status) {
        // NOOP
    }
}
