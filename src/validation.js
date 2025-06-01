const emailRegex = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;


function validateData({ username, email, company, message }) {
  if (typeof username !== 'string' || !username.trim()) {
    return { field: 'username', message: 'userName is required and must be a non-empty string' };
  }

  if (typeof email !== 'string' || !emailRegex.test(email)) {
    return { field: 'email', message: 'Email is required and must be a valid email address' };
  }

  if (company !== undefined) {
    if (typeof company !== 'string') {
      return { field: 'company', message: 'Company must be a string' };
    }
    if (company.length > 100) {
      return { field: 'company', message: 'Company must be at most 100 characters long' };
    }
  }

  if (message !== undefined) {
    if (typeof message !== 'string') {
      return { field: 'message', message: 'Message must be a string' };
    }
    if (message.length > 500) {
      return { field: 'message', message: 'Message must be at most 500 characters long' };
    }
  }

  // All checks passed
  return null;
}

export default validateData;
