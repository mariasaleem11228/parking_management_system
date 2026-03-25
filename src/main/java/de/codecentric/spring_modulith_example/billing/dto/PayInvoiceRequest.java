package de.codecentric.spring_modulith_example.billing.dto;

public class PayInvoiceRequest {

    private String method;

    public PayInvoiceRequest() {
    }

    public String getMethod() {
        return method;
    }

    public void setMethod(String method) {
        this.method = method;
    }
}
