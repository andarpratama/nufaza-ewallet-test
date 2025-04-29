export interface ErrorConfig {
    statusCode: number;
    message: string;
  }
  
  export const errorMap: Record<string, ErrorConfig> = {
    // -- generic not found
    NotFound: {
      statusCode: 404,
      message: 'Resource not found',
    },
    // -- Register
    UsernameOrEmailRequired: {
      statusCode: 422,
      message: 'Username or email is required',
    },
    NameRequired: {
      statusCode: 422,
      message: 'Name is required',
    },
    EmailRequired: {
      statusCode: 422,
      message: 'Email is required',
    },
    // -- Login
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
    // ... add other codes as needed
  };