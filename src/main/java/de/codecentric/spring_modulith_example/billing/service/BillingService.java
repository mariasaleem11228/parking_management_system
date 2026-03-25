package de.codecentric.spring_modulith_example.billing.service;

import de.codecentric.spring_modulith_example.billing.dto.InvoiceRequest;
import de.codecentric.spring_modulith_example.billing.dto.PayInvoiceRequest;
import de.codecentric.spring_modulith_example.billing.entity.Invoice;
import de.codecentric.spring_modulith_example.billing.repository.InvoiceRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

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

    public Map<String, Object> getBillingState(Long reservationId) {
        Invoice invoice = invoiceRepository.findByReservationId(reservationId)
                .orElseThrow(() -> new RuntimeException("Billing state not found"));

        Map<String, Object> result = new LinkedHashMap<>();
        result.put("reservationId", invoice.getReservationId());
        result.put("invoiceId", invoice.getId());
        result.put("status", invoice.getStatus());
        result.put("amount", invoice.getAmount());
        return result;
    }

    public Map<String, Object> getStats() {
        Map<String, Object> result = new LinkedHashMap<>();
        result.put("daily", List.of(
                Map.of("day", "Mon", "revenue", 48.50),
                Map.of("day", "Tue", "revenue", 72.00),
                Map.of("day", "Wed", "revenue", 65.00),
                Map.of("day", "Thu", "revenue", 90.00),
                Map.of("day", "Fri", "revenue", 110.00),
                Map.of("day", "Sat", "revenue", 95.00),
                Map.of("day", "Sun", "revenue", 58.00)
        ));
        return result;
    }
}