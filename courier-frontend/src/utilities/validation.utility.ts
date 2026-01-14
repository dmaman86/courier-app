interface ValidationRule {
  isValid: (value: string | Date, anotherValue?: any) => boolean;
  message: string;
}

const format = (date: Date, locale: string) => {
  return new Intl.DateTimeFormat(locale, {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(date);
};

export const validatorInput = (() => {
  const isNotEmpty: ValidationRule = {
    isValid: (value) =>
      !!value && typeof value === "string" && value.trim() !== "",
    message: "This field is required",
  };

  const isGreaterThan: ValidationRule = {
    isValid: (value, minLength = 5) =>
      !!value && typeof value === "string" && value.length > minLength,
    message: "Password must be at least 6 characters",
  };

  const isPhoneNumber: ValidationRule = {
    isValid: (value) =>
      !!value &&
      typeof value === "string" &&
      /^(05|\+9725)(\d{8}|\d-\d{7}|\d-\d{3}-\d{4}|\d-\d{4}-\d{3})$/.test(
        value.trim(),
      ),
    message: "Please enter a valid phone number",
  };

  const isEmail: ValidationRule = {
    isValid: (value) =>
      !!value &&
      typeof value === "string" &&
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim()),
    message: "Please enter a valid email address",
  };

  const isEmailOrPhoneNumber: ValidationRule = {
    isValid: (value) =>
      !!value && (isPhoneNumber.isValid(value) || isEmail.isValid(value)),
    message: "Please enter a valid email address or phone number",
  };

  const isDate: ValidationRule = {
    isValid: (value) =>
      value instanceof Date &&
      !isNaN(value.getTime()) &&
      !!format(value, "he-IL"),
    message: "Please enter a valid date",
  };

  const isValidDate: ValidationRule = {
    isValid: (value) => {
      if (!(value instanceof Date) || isNaN(value.getTime())) return false;
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      return value > today;
    },
    message: "Please select a valid future date",
  };

  const isSamePassword: ValidationRule = {
    isValid: (value, anotherValue) => {
      if (
        !isNotEmpty.isValid(value) ||
        !isNotEmpty.isValid(anotherValue?.password)
      ) {
        return false;
      }
      return value === anotherValue.password;
    },
    message: "Passwords do not match",
  };

  return {
    isNotEmpty,
    isGreaterThan,
    isPhoneNumber,
    isEmail,
    isEmailOrPhoneNumber,
    isDate,
    isValidDate,
    isSamePassword,
  };
})();
