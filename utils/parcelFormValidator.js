export function validateFormData(formData) {
  const fieldsToCheck = [
    "address_from.address",
    "address_from.house",
    "address_from.latitude",
    "address_from.longitude",
    "address_from.room",
    "address_from.stage",
    "address_to.address",
    "address_to.house",
    "address_to.latitude",
    "address_to.longitude",
    "address_to.room",
    "address_to.stage",
    "delivery_date",
    "delivery_time",
    "description",
    "instructions",
    "note",
    "notify",
    "payment_type_id",
    "phone_from",
    "phone_to",
    "username_from",
    "username_to",
    "type_id",
    "qr_value",
    "currency_id", // Assuming this is a field name, you need to provide the actual field name
  ];

  for (const field of fieldsToCheck) {
    const value = getFieldByPath(formData, field);
    if (value === undefined || value === null || value === "") {
      return false;
    }
  }

  return true;
}

export function phoneInputValidator(event, handleFunction) {
  const phoneNumberRegex =
    /^\+\d{1,4}(?:\s*\(\d{1,4}\)\s*|\s+)?\d{1,5}(?:[-.\s]?\d{1,5}){3}$/;
  const isValid = phoneNumberRegex.test(event?.target?.value);
  // Set input value only if phone number valid, else set input value empty string
  if (isValid) handleFunction(event);
  else handleFunction({ target: { value: "", name: event?.target?.name } });
}

// Helper function to access nested fields using a path
function getFieldByPath(obj, path) {
  const parts = path.split(".");
  let current = obj;

  for (const part of parts) {
    if (current[part] === undefined) {
      return undefined;
    }
    current = current[part];
  }

  return current;
}
