namespace ECommerce.Payment.Service.Application.Services;

/// <summary>
/// Payment service for handling multiple payment gateways
/// </summary>
public interface IPaymentService
{
    // Stripe
    Task<PaymentResult> ProcessStripePaymentAsync(StripePaymentRequest request, CancellationToken cancellationToken = default);
    Task<RefundResult> RefundStripePaymentAsync(string paymentIntentId, decimal amount, CancellationToken cancellationToken = default);
    
    // PayPal
    Task<PaymentResult> ProcessPayPalPaymentAsync(PayPalPaymentRequest request, CancellationToken cancellationToken = default);
    Task<RefundResult> RefundPayPalPaymentAsync(string captureId, decimal amount, CancellationToken cancellationToken = default);
    
    // Razorpay
    Task<PaymentResult> ProcessRazorpayPaymentAsync(RazorpayPaymentRequest request, CancellationToken cancellationToken = default);
    Task<RefundResult> RefundRazorpayPaymentAsync(string paymentId, decimal amount, CancellationToken cancellationToken = default);
    
    // Generic
    Task<PaymentResult> ProcessPaymentAsync(PaymentRequest request, CancellationToken cancellationToken = default);
    Task<PaymentStatus> GetPaymentStatusAsync(string paymentId, PaymentGateway gateway, CancellationToken cancellationToken = default);
    Task<List<PaymentMethod>> GetAvailablePaymentMethodsAsync(Guid tenantId, CancellationToken cancellationToken = default);
}

public enum PaymentGateway
{
    Stripe,
    PayPal,
    Razorpay,
    Square
}

public enum PaymentStatus
{
    Pending,
    Processing,
    Succeeded,
    Failed,
    Cancelled,
    Refunded,
    PartiallyRefunded
}

public class PaymentRequest
{
    public Guid TenantId { get; set; }
    public Guid OrderId { get; set; }
    public decimal Amount { get; set; }
    public string Currency { get; set; } = "USD";
    public PaymentGateway Gateway { get; set; }
    public string CustomerEmail { get; set; } = string.Empty;
    public string? CustomerName { get; set; }
    public Dictionary<string, string> Metadata { get; set; } = new();
}

public class StripePaymentRequest : PaymentRequest
{
    public string PaymentMethodId { get; set; } = string.Empty;
    public bool SavePaymentMethod { get; set; }
    public string? CustomerId { get; set; }
}

public class PayPalPaymentRequest : PaymentRequest
{
    public string OrderId { get; set; } = string.Empty;
    public string PayerId { get; set; } = string.Empty;
}

public class RazorpayPaymentRequest : PaymentRequest
{
    public string RazorpayPaymentId { get; set; } = string.Empty;
    public string RazorpayOrderId { get; set; } = string.Empty;
    public string RazorpaySignature { get; set; } = string.Empty;
}

public class PaymentResult
{
    public bool Success { get; set; }
    public string? PaymentId { get; set; }
    public string? TransactionId { get; set; }
    public PaymentStatus Status { get; set; }
    public decimal Amount { get; set; }
    public string Currency { get; set; } = string.Empty;
    public string? ErrorMessage { get; set; }
    public string? ErrorCode { get; set; }
    public DateTime ProcessedAt { get; set; }
    public Dictionary<string, string> Metadata { get; set; } = new();
}

public class RefundResult
{
    public bool Success { get; set; }
    public string? RefundId { get; set; }
    public decimal Amount { get; set; }
    public string? ErrorMessage { get; set; }
    public DateTime ProcessedAt { get; set; }
}

public class PaymentMethod
{
    public PaymentGateway Gateway { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public bool IsEnabled { get; set; }
    public string? LogoUrl { get; set; }
    public List<string> SupportedCurrencies { get; set; } = new();
}
