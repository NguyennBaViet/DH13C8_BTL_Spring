package dh13c8.common.exception;

public class BusinessException extends RuntimeException {

    private int statusCode;

    public BusinessException(String message) {
        super(message);
        this.statusCode = 400;
    }

    public BusinessException(String message, int statusCode) {
        super(message);
        this.statusCode = statusCode;
    }

    public BusinessException(String message, Throwable cause) {
        super(message, cause);
        this.statusCode = 400;
    }

    public int getStatusCode() {
        return statusCode;
    }
}
