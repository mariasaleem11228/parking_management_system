package de.codecentric.spring_modulith_example.billing.service;

import de.codecentric.spring_modulith_example.billing.dto.InvoiceRequest;
import de.codecentric.spring_modulith_example.billing.dto.PayInvoiceRequest;
import de.codecentric.spring_modulith_example.billing.entity.Invoice;
import de.codecentric.spring_modulith_example.billing.repository.InvoiceRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class BillingService {

    private final InvoiceRepository invoiceRepository;

    public BillingService(InvoiceRepository invoiceRepository) {
        this.invoiceRepository = invoiceRepository;
    }

    public Invoice createInvoice(InvoiceRequest request) {
        double parkingCost = request.getParkingHours() * request.getPricePerHour();
        double chargingCost = request.getChargingKwh() * request.getChargingFeePerKwh();
        double totalCost = parkingCost + chargingCost;

        Invoice invoice = new Invoice();
        invoice.setReservationId(request.getReservationId());
        invoice.setUserId(request.getUserId());
        invoice.setUserName(request.getUserName());
        invoice.setSpaceName(request.getSpaceName());
        invoice.setZoneName(request.getZoneName());
        invoice.setAmount(totalCost);
        invoice.setStatus("UNPAID");
        invoice.setIssuedAt(LocalDateTime.now().toString());
        invoice.setPaidAt(null);

        return invoiceRepository.save(invoice);
    }

    public List<Invoice> getAllInvoices() {
        return invoiceRepository.findAll();
    }

    public Invoice getInvoiceById(Long id) {
        return invoiceRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Invoice not found"));
    }

    public List<Invoice> getMyInvoices() {
        return invoiceRepository.findAll();
    }

    public Invoice payInvoice(Long id, PayInvoiceRequest request) {
        Invoice invoice = invoiceRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Invoice not found"));

        invoice.setStatus("PAID");
        invoice.setPaidAt(LocalDateTime.now().toString());

        return invoiceRepository.save(invoice);
    }
}