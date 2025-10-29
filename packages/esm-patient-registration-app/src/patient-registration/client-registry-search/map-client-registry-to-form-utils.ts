interface PatientData {
  [key: string]: any;
}

/**
 * Defines the mapping between CR fields and form fields.
 * Add or remove mappings here as needed.
 */
const fieldMapping: Record<string, string> = {
  givenName: 'first_name',
  familyName: 'last_name',
  gender: 'gender',
  birthdate: 'date_of_birth',
  phone: 'phone',
  email: 'email',
  identificationNumber: 'identification_number',
  identificationType: 'identification_type',
  county: 'county',
  subCounty: 'sub_county',
  ward: 'ward',
  village: 'village_estate',
  postalAddress: 'postal_address',
};

/**
 * Dynamically maps patient fields from the CR response to Formik fields.
 * Only fields present in both the mapping and patient object will be set.
 */
export function applyClientRegistryMapping(patient: PatientData, setFieldValue: (field: string, value: any) => void) {
  Object.entries(fieldMapping).forEach(([formField, crField]) => {
    if (patient[crField] !== undefined) {
      let value = patient[crField];

      if (formField === 'gender' && typeof value === 'string') {
        value = value.charAt(0).toUpperCase();
      }

      setFieldValue(formField, value);
    }
  });
}
