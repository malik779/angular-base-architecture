namespace ECommerce.BuildingBlocks.Common.Application;

/// <summary>
/// Result pattern for handling operation outcomes
/// </summary>
public class Result
{
    public bool IsSuccess { get; }
    public bool IsFailure => !IsSuccess;
    public string? Error { get; }
    public List<string> Errors { get; }

    protected Result(bool isSuccess, string? error = null, List<string>? errors = null)
    {
        IsSuccess = isSuccess;
        Error = error;
        Errors = errors ?? new List<string>();
    }

    public static Result Success() => new(true);
    public static Result Failure(string error) => new(false, error);
    public static Result Failure(List<string> errors) => new(false, errors: errors);
    
    public static Result<T> Success<T>(T value) => new(value, true);
    public static Result<T> Failure<T>(string error) => new(default!, false, error);
    public static Result<T> Failure<T>(List<string> errors) => new(default!, false, errors: errors);
}

/// <summary>
/// Generic result with value
/// </summary>
public class Result<T> : Result
{
    public T? Value { get; }

    protected internal Result(T? value, bool isSuccess, string? error = null, List<string>? errors = null)
        : base(isSuccess, error, errors)
    {
        Value = value;
    }
}
