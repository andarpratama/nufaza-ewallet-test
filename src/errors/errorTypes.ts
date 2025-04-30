export interface ErrorConfig {
    statusCode: number;
    message: string;
  }
  
  export const errorMap: Record<string, ErrorConfig> = {
    NotAllowed: {
      statusCode: 400,
      message: 'Not Allowed',
    },
    NotFound: {
      statusCode: 404,
      message: 'Resource not found',
    },
    BadRequest: {
      statusCode: 400,
      message: 'Bad Request',
    },
    Conflict: {
      statusCode: 409,
      message: 'Resource not found',
    },
    UsernameOrEmailRequired: {
      statusCode: 422,
      message: 'Username or email is required',
    },
    BodyRequired: {
      statusCode: 422,
      message: '<Name> is required',
    },
    InvalidEmail: {
      statusCode: 422,
      message: 'Invalid email format',
    },
    EmailNotRegistered: {
      statusCode: 401,
      message: 'Email not registered',
    },
    InvalidPassword: {
      statusCode: 401,
      message: 'Invalid password',
    },
  };