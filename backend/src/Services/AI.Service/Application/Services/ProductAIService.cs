using Azure.AI.OpenAI;
using Azure;
using Microsoft.Extensions.Configuration;
using System.Text.Json;

namespace ECommerce.AI.Service.Application.Services;

/// <summary>
/// Implementation of AI service using Azure OpenAI
/// </summary>
public class ProductAIService : IProductAIService
{
    private readonly OpenAIClient _openAIClient;
    private readonly IConfiguration _configuration;
    private readonly string _deploymentName;

    public ProductAIService(IConfiguration configuration)
    {
        _configuration = configuration;
        var endpoint = configuration["AzureOpenAI:Endpoint"] ?? throw new InvalidOperationException("Azure OpenAI endpoint not configured");
        var apiKey = configuration["AzureOpenAI:ApiKey"] ?? throw new InvalidOperationException("Azure OpenAI API key not configured");
        _deploymentName = configuration["AzureOpenAI:DeploymentName"] ?? "gpt-4";
        
        _openAIClient = new OpenAIClient(new Uri(endpoint), new AzureKeyCredential(apiKey));
    }

    public async Task<ProductSeoContent> GenerateSeoContentAsync(ProductSeoRequest request, CancellationToken cancellationToken = default)
    {
        var prompt = $@"Generate SEO-optimized content for an e-commerce product:

Product Name: {request.ProductName}
Description: {request.Description}
Category: {request.Category}
Features: {string.Join(", ", request.Features)}
Price: {request.Price:C}

Please provide:
1. An SEO-optimized title (max 60 characters)
2. A meta description (max 160 characters)
3. 10 relevant keywords
4. A compelling meta description for search engines

Format the response as JSON with keys: seoTitle, seoDescription, keywords (array), metaDescription";

        var response = await CallOpenAIAsync(prompt, cancellationToken);
        
        try
        {
            var seoContent = JsonSerializer.Deserialize<ProductSeoContent>(response);
            return seoContent ?? new ProductSeoContent();
        }
        catch
        {
            // Fallback parsing
            return new ProductSeoContent
            {
                SeoTitle = request.ProductName,
                SeoDescription = request.Description ?? string.Empty,
                Keywords = request.Features,
                MetaDescription = request.Description
            };
        }
    }

    public async Task<string> GenerateProductDescriptionAsync(ProductDescriptionRequest request, CancellationToken cancellationToken = default)
    {
        var tone = request.Tone ?? "Professional";
        var prompt = $@"Write a compelling product description for an e-commerce website:

Product Name: {request.ProductName}
Category: {request.Category}
Features: {string.Join(", ", request.Features)}
Benefits: {string.Join(", ", request.Benefits)}
Target Audience: {request.TargetAudience}
Tone: {tone}

Write a 2-3 paragraph description that:
- Highlights key features and benefits
- Appeals to the target audience
- Uses persuasive language
- Includes a call-to-action
- Is SEO-friendly

Description:";

        return await CallOpenAIAsync(prompt, cancellationToken);
    }

    public async Task<ImageAnalysisResult> AnalyzeProductImageAsync(string imageUrl, CancellationToken cancellationToken = default)
    {
        // In a real implementation, this would use Azure Computer Vision API
        // For now, returning a mock result
        await Task.Delay(100, cancellationToken);
        
        return new ImageAnalysisResult
        {
            Tags = new List<string> { "product", "high-quality", "professional" },
            Description = "Product image with good lighting and composition",
            QualityScore = 0.85m,
            SuggestedImprovements = new List<string> { "Consider adding lifestyle context", "Ensure white background" },
            IsProductCentered = true,
            DominantColor = "#FFFFFF"
        };
    }

    public async Task<PricingRecommendation> GetPricingRecommendationAsync(PricingAnalysisRequest request, CancellationToken cancellationToken = default)
    {
        var competitorInfo = string.Join(", ", request.CompetitorPrices.Select(c => $"{c.CompetitorName}: {c.Price:C}"));
        var conversionRate = request.ViewsLast30Days > 0 ? (decimal)request.SalesLast30Days / request.ViewsLast30Days : 0;
        
        var prompt = $@"Analyze pricing strategy for an e-commerce product:

Current Price: {request.CurrentPrice:C}
Cost Price: {request.CostPrice:C}
Sales (Last 30 Days): {request.SalesLast30Days}
Views (Last 30 Days): {request.ViewsLast30Days}
Conversion Rate: {conversionRate:P}
Competitor Prices: {competitorInfo}

Provide:
1. Recommended price
2. Minimum viable price (considering costs)
3. Maximum price (market ceiling)
4. Reasoning for the recommendation
5. Expected impact on sales (percentage)

Format as JSON with keys: recommendedPrice, minPrice, maxPrice, reasoning, expectedImpact";

        var response = await CallOpenAIAsync(prompt, cancellationToken);
        
        try
        {
            var recommendation = JsonSerializer.Deserialize<PricingRecommendation>(response);
            return recommendation ?? CreateDefaultPricingRecommendation(request);
        }
        catch
        {
            return CreateDefaultPricingRecommendation(request);
        }
    }

    public async Task<ProductInsights> GenerateProductInsightsAsync(ProductPerformanceData data, CancellationToken cancellationToken = default)
    {
        var conversionRate = data.ViewCount > 0 ? (decimal)data.PurchaseCount / data.ViewCount : 0;
        
        var prompt = $@"Analyze product performance and provide actionable insights:

Product Performance Metrics:
- Views: {data.ViewCount}
- Purchases: {data.PurchaseCount}
- Conversion Rate: {conversionRate:P}
- Revenue: {data.Revenue:C}
- Stock Quantity: {data.StockQuantity}
- Days Since Last Sale: {data.DaysSinceLastSale}
- Average Rating: {data.AverageRating}/5
- Review Count: {data.ReviewCount}

Provide:
1. Performance score (A, B, C, D, or F)
2. Recommended action (Promote, Discount, Hold, Discontinue, Restock)
3. Detailed insights (2-3 sentences)
4. 3-5 specific action items
5. Is this a slow-moving product? (true/false)
6. Estimated days until stockout (if applicable)

Format as JSON with keys: performanceScore, recommendedAction, detailedInsights, actionItems (array), isSlowMoving, daysUntilStockout";

        var response = await CallOpenAIAsync(prompt, cancellationToken);
        
        try
        {
            var insights = JsonSerializer.Deserialize<ProductInsights>(response);
            return insights ?? CreateDefaultInsights(data);
        }
        catch
        {
            return CreateDefaultInsights(data);
        }
    }

    public async Task<DemandForecast> PredictDemandAsync(DemandPredictionRequest request, CancellationToken cancellationToken = default)
    {
        var historicalSummary = string.Join("\n", request.HistoricalData.Select(h => $"{h.Date:yyyy-MM-dd}: {h.UnitsSold} units"));
        
        var prompt = $@"Predict product demand based on historical sales data:

Historical Sales Data:
{historicalSummary}

Forecast Period: {request.ForecastDays} days

Provide:
1. Total predicted sales for the period
2. Confidence level (0-1)
3. Daily forecasts
4. Trend analysis (Increasing, Stable, Decreasing)

Format as JSON with keys: predictedSales, confidence, dailyForecasts (array with date and predictedUnits), trend";

        var response = await CallOpenAIAsync(prompt, cancellationToken);
        
        try
        {
            var forecast = JsonSerializer.Deserialize<DemandForecast>(response);
            return forecast ?? CreateDefaultForecast(request);
        }
        catch
        {
            return CreateDefaultForecast(request);
        }
    }

    public async Task<List<ProductRecommendation>> GetSlowMovingProductRecommendationsAsync(Guid tenantId, CancellationToken cancellationToken = default)
    {
        // This would typically query the database for slow-moving products
        // and generate recommendations for each
        await Task.Delay(100, cancellationToken);
        
        return new List<ProductRecommendation>();
    }

    private async Task<string> CallOpenAIAsync(string prompt, CancellationToken cancellationToken)
    {
        try
        {
            var chatCompletionsOptions = new ChatCompletionsOptions
            {
                DeploymentName = _deploymentName,
                Messages =
                {
                    new ChatRequestSystemMessage("You are an AI assistant specialized in e-commerce product optimization and analytics. Provide accurate, actionable insights."),
                    new ChatRequestUserMessage(prompt)
                },
                Temperature = 0.7f,
                MaxTokens = 1000
            };

            var response = await _openAIClient.GetChatCompletionsAsync(chatCompletionsOptions, cancellationToken);
            return response.Value.Choices[0].Message.Content;
        }
        catch (Exception ex)
        {
            // Log error and return empty response
            Console.WriteLine($"OpenAI API Error: {ex.Message}");
            return "{}";
        }
    }

    private PricingRecommendation CreateDefaultPricingRecommendation(PricingAnalysisRequest request)
    {
        var avgCompetitorPrice = request.CompetitorPrices.Any() 
            ? request.CompetitorPrices.Average(c => c.Price) 
            : request.CurrentPrice;
        
        return new PricingRecommendation
        {
            RecommendedPrice = avgCompetitorPrice * 0.95m,
            MinPrice = request.CostPrice ?? request.CurrentPrice * 0.7m,
            MaxPrice = avgCompetitorPrice * 1.2m,
            Reasoning = "Price recommendation based on competitor analysis",
            ExpectedImpact = 5.0m
        };
    }

    private ProductInsights CreateDefaultInsights(ProductPerformanceData data)
    {
        var conversionRate = data.ViewCount > 0 ? (decimal)data.PurchaseCount / data.ViewCount : 0;
        var score = conversionRate > 0.05m ? "A" : conversionRate > 0.03m ? "B" : conversionRate > 0.01m ? "C" : "D";
        
        return new ProductInsights
        {
            PerformanceScore = score,
            RecommendedAction = data.DaysSinceLastSale > 30 ? "Discount" : "Promote",
            DetailedInsights = $"Product has {conversionRate:P} conversion rate with {data.ViewCount} views.",
            ActionItems = new List<string> { "Optimize product images", "Improve description", "Consider promotion" },
            IsSlowMoving = data.DaysSinceLastSale > 30,
            DaysUntilStockout = data.PurchaseCount > 0 ? data.StockQuantity / (data.PurchaseCount / 30) : null
        };
    }

    private DemandForecast CreateDefaultForecast(DemandPredictionRequest request)
    {
        var avgDailySales = request.HistoricalData.Any() 
            ? (int)request.HistoricalData.Average(h => h.UnitsSold) 
            : 0;
        
        return new DemandForecast
        {
            PredictedSales = avgDailySales * request.ForecastDays,
            Confidence = 0.7m,
            DailyForecasts = new List<DailyForecast>(),
            Trend = "Stable"
        };
    }
}
