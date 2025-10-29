interface PatientData {
  [key: string]: any;
}

interface Dependant {
  relationship: string;
  result: Array<{
    first_name: string;
    middle_name: string;
    last_name: string;
    gender: string;
    date_of_birth: string;
    identification_number: string;
    identification_type: string;
  }>;
}

interface AlternativeContact {
  contact_type: string;
  contact_id: string;
  contact_name: string;
  relationship: string;
  remarks: string;
}

const fieldMapping: Record<string, string | { path: string; transform?: (value: any) => any }> = {
  givenName: 'first_name',
  familyName: 'last_name',
  middleName: 'middle_name',
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
  address: 'address',
  gender: {
    path: 'gender',
    transform: (value) => {
      if (!value) return '';
      const genderMap: Record<string, string> = {
        male: 'male',
        m: 'male',
        female: 'female',
        f: 'female',
        other: 'other',
        unknown: 'unknown',
      };
      return genderMap[value.toLowerCase()] || value.toLowerCase();
    },
  },
  'academicOccupation.highestLevelEducation': {
    path: 'employment_type',
    transform: (value) => value || '',
  },

  // Occupation field - also using employment_type (you might want to separate these)
  'academicOccupation.occupation': {
    path: 'employment_type',
    transform: (value) => value || '',
  },

  // Civil status/marital status
  civilStatus: {
    path: 'civil_status',
    transform: (value) => value || '',
  },
};

function mapNextOfKin(patient: PatientData, setFieldValue: (field: string, value: any) => void) {
  const alternativeContacts: AlternativeContact[] = patient.alternative_contacts || [];

  const spouseContact = alternativeContacts.find((contact) => contact.relationship.toLowerCase() === 'spouse');

  const nextOfKinContact =
    spouseContact ||
    alternativeContacts.find(
      (contact) =>
        contact.remarks.toLowerCase().includes('next of kin') ||
        contact.relationship.toLowerCase().includes('next of kin'),
    );

  if (nextOfKinContact) {
    setFieldValue('nextOfKin.nextOfKinName', nextOfKinContact.contact_name);
    setFieldValue('nextOfKin.nextOfKinRelationship', nextOfKinContact.relationship);
    setFieldValue('nextOfKin.nextOfKinPhoneNumber', nextOfKinContact.contact_id);
    setFieldValue('nextOfKin.nextOfKinResidence', patient.village_estate || patient.county || '');
  } else {
    setFieldValue('nextOfKin.nextOfKinName', '');
    setFieldValue('nextOfKin.nextOfKinRelationship', '');
    setFieldValue('nextOfKin.nextOfKinPhoneNumber', '');
    setFieldValue('nextOfKin.nextOfKinResidence', '');
  }
}

function mapRelationships(patient: PatientData, setFieldValue: (field: string, value: any) => void) {
  const dependants: Dependant[] = patient.dependants || [];
  const relationships: any[] = [];

  dependants.forEach((dependant, index) => {
    if (dependant.result && dependant.result.length > 0) {
      const person = dependant.result[0];
      relationships.push({
        relationshipType: dependant.relationship, // "Child"
        relatedPersonName: `${person.first_name} ${person.middle_name || ''} ${person.last_name}`.trim(),
        relatedPersonUuid: '',
        relationshipTypeUuid: '',
        relativeName: `${person.first_name} ${person.middle_name || ''} ${person.last_name}`.trim(),
        relativePhone: '',
        relationship: dependant.relationship,
        birthdate: person.date_of_birth,
        gender: person.gender,
        identifier: person.identification_number,
      });
    }
  });

  setFieldValue('relationships', relationships);
}

export function applyClientRegistryMapping(patient: PatientData, setFieldValue: (field: string, value: any) => void) {
  Object.entries(fieldMapping).forEach(([formField, mapping]) => {
    let crField: string;
    let transformFn: (value: any) => any = (v) => v;

    if (typeof mapping === 'string') {
      crField = mapping;
    } else {
      crField = mapping.path;
      transformFn = mapping.transform || transformFn;
    }

    if (crField && patient[crField] !== undefined && patient[crField] !== null && patient[crField] !== '') {
      const value = transformFn(patient[crField]);
      setFieldValue(formField, value);
    }
  });

  mapNextOfKin(patient, setFieldValue);
  mapRelationships(patient, setFieldValue);
}
