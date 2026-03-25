package de.codecentric.spring_modulith_example.billing.controller;

import de.codecentric.spring_modulith_example.billing.dto.InvoiceRequest;
import de.codecentric.spring_modulith_example.billing.dto.PayInvoiceRequest;
import de.codecentric.spring_modulith_example.billing.entity.Invoice;
import de.codecentric.spring_modulith_example.billing.service.BillingService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/billing")
public class BillingController {

    private final BillingService billingService;

    public BillingController(BillingService billingService) {
        this.billingService = billingService;
    }

    @GetMapping("/invoices/my")
    public List<Invoice> getMyInvoices() {
        return billingService.getMyInvoices();
    }

    @GetMapping("/invoices")
    public List<Invoice> getAllInvoices() {
        return billingService.getAllInvoices();
    }

    @GetMapping("/invoices/{id}")
    public Invoice getInvoiceById(@PathVariable Long id) {
        return billingService.getInvoiceById(id);
    }

    @PostMapping("/invoices")
    public Invoice createInvoice(@RequestBody InvoiceRequest request) {
        return billingService.createInvoice(request);
    }

    @PostMapping("/invoices/{id}/pay")
    public Invoice payInvoice(@PathVariable Long id, @RequestBody PayInvoiceRequest request) {
        return billingService.payInvoice(id, request);
    }
}