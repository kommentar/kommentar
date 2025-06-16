enum ErrorCode {
  INVALID_INPUT = "InvalidInput",
  UNAUTHORIZED = "Unauthorized",
  FORBIDDEN = "Forbidden",
  NOT_FOUND = "NotFound",
  CONFLICT = "Conflict",
  UNKNOWN_ERROR = "UnknownError",
  RATE_LIMIT_EXCEEDED = "RateLimitExceeded",
  UNAVAILABLE = "Unavailable",
}

type CustomError = {
  message: string;
  type: string;
  code: ErrorCode;
  retryable: boolean;
};

const commentNotFoundError: CustomError = {
  message: "Comment not found",
  type: "COMMENT_NOT_FOUND",
  code: ErrorCode.NOT_FOUND,
  retryable: false,
};

const unauthorizedError: CustomError = {
  message: "Unauthorized access",
  type: "UNAUTHORIZED",
  code: ErrorCode.UNAUTHORIZED,
  retryable: false,
};

const consumerNotFoundError: CustomError = {
  message: "Consumer not found",
  type: "CONSUMER_NOT_FOUND",
  code: ErrorCode.NOT_FOUND,
  retryable: false,
};

const profaneCommentError: CustomError = {
  message: "Comment contains profane content. Please revise your comment.",
  type: "PROFANE_COMMENT",
  code: ErrorCode.INVALID_INPUT,
  retryable: false,
};

const dataStoreError: CustomError = {
  message: "Data store error",
  type: "DATA_FETCH_ERROR",
  code: ErrorCode.UNKNOWN_ERROR,
  retryable: true,
};

const profanityCheckError: CustomError = {
  message: "Failed to check profanity",
  type: "PROFANITY_CHECK_ERROR",
  code: ErrorCode.UNKNOWN_ERROR,
  retryable: true,
};

const errors = {
  domain: {
    commentNotFound: commentNotFoundError,
    unauthorized: unauthorizedError,
    consumerNotFound: consumerNotFoundError,
    profaneComment: profaneCommentError,
  },
  dependency: {
    dataStoreError: dataStoreError,
    profanityCheckError: profanityCheckError,
  },
};

export type { CustomError };
export { ErrorCode, errors };
