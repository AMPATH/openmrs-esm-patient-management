export type RequestCustomOtpDto = {
  identificationNumber: string | number;
  identificationType: string;
  locationUuid: string;
};

export interface RequestCustomOtpResponse {
  message: string;
  sessionId: string;
  maskedPhone: string;
}

export interface ValidateHieCustomOtpDto {
  sessionId: string;
  otp: number | string;
  locationUuid: string;
}

export interface ValidateCustomOtpResponse {
  message: string;
  isValid?: boolean;
}

export type ClientRegistrySearchRequest = {
  identificationNumber: string | number;
  identificationType: string;
  locationUuid: string;
};

export type ClientRegistryBody = {
  id: string;
  first_name: string;
  middle_name: string;
  last_name: string;
  gender: string;
  date_of_birth: string;
  other_identifications: Array<{
    identification_number: string;
    identification_type: string;
  }>;
  dependants: Array<ClientRegistryDependantBody>;
  citizenship: string;
  kra_pin: string;
  civil_status: string;
  email: string;
  phone: string;
  place_of_birth: string;
  country: string;
  county: string;
  sub_county: string;
  ward: string;
  village_estate: string;
  building_house_no: string;
  latitude: string;
  longitude: string;
  identification_number: string;
};

export type ClientRegistryDependantBody = {
  relationship: string;
  total: number;
  result: Array<ClientRegistryBody>;
};

export interface CustomRelationship {
  uuid: string;
  display: string;
  relative: string;
  relatedPersonUuid: string;
  relationshipType: string;
  relationshipTypeUuId: string;
  relationshipTypeName: string;
  relatedPerson: any;
}

export interface AmrsPerson {
  uuid: string;
  identifiers: Identifier[];
  display: string;
  person: {
    uuid: string;
    display: string;
    gender: string;
    age: number;
    birthdate: string;
    birthdateEstimated: boolean;
    dead: boolean;
    deathDate?: any;
    causeOfDeath?: any;
    preferredAddress: {
      address1: string;
      address2: string;
      address3: string;
      address4: string;
      address5: string;
      address6: string;
      address7: string;
      cityVillage: string;
      country: string;
      postalCode: string;
      stateProvince: string;
      countyDistrict: string;
      latitude: string;
      longitude: string;
    };
    preferredName: {
      display: string;
      uuid: string;
      givenName: string;
      middleName: string;
      familyName: string;
    };
    attributes: Array<Attributes>;
    identifiers: Identifier[];
    voided: boolean;
    birthtime?: any;
    deathdateEstimated: boolean;
    resourceVersion: string;
  };
  attributes: { value: string; attributeType: { uuid: string; display: string } }[];
  voided: boolean;
}

export interface Address {
  preferred: boolean;
  address1: string;
  cityVillage: string;
  country: string;
  postalCode: string;
  stateProvince: string;
}

export interface Identifier {
  uuid: string;
  display: string;
  identifier: string;
  identifierType: {
    uuid: string;
    display: string;
  };
}

export interface Attributes {
  uuid: string;
  display: string;
  value: {
    uuid: string;
    display: string;
  };
  attributeType: {
    uuid: string;
    display: string;
  };
}

export type ClientRegistrySearchResponse = Array<ClientRegistryBody>;

export enum HieIdentificationType {
  NationalID = 'National ID',
  SHANumber = 'SHA Number',
  HouseholdNumber = 'Household Number',
  RefugeeID = 'Refugee ID',
  AlienID = 'Alien ID',
  MandateNumber = 'Mandate Number',
  Cr = 'id',
  TemporaryDependantID = 'Temporary Dependant ID',
}

const HOUSE_HOLD_NUMBER_UUID = 'bb74b20e-dcee-4f59-bdf1-2dffc3abf106';
const SHA_UUID = 'cf5362b2-8049-4442-b3c6-36f870e320cb';
const CLIENT_REGISTRY_NO_UUID = 'e88dc246-3614-4ee3-8141-1f2a83054e72';
const NATIONAL_ID_UUID = '58a47054-1359-11df-a1f1-0026b9348838';
const PROVIDER_NATIONAL_ID_UUID = '4550df92-c684-4597-8ab8-d6b10eabdcfb';
const REFUGEE_ID_UUID = '465e81af-8d69-47e9-9127-53a94adc75fb';
const MANDATE_NUMBER_UUID = 'aae2d097-20ba-43ca-9b71-fd8296068f39';
const ALIEN_ID_UUID = '12f5b147-3403-4a73-913d-7ded9ffec094';
const TEMPORARY_DEPENDANT_ID_UUID = 'a3d34214-93e8-4faf-bf4d-0272eee079eb';
const AMRS_UNIVERSAL_ID_UUID = '58a4732e-1359-11df-a1f1-0026b9348838';
const UPI_NUMBER_UUID = 'cba702b9-4664-4b43-83f1-9ab473cbd64d';

export const IdentifierTypesUuids = {
  HOUSE_HOLD_NUMBER_UUID,
  SHA_UUID,
  CLIENT_REGISTRY_NO_UUID,
  NATIONAL_ID_UUID,
  PROVIDER_NATIONAL_ID_UUID,
  REFUGEE_ID_UUID,
  MANDATE_NUMBER_UUID,
  ALIEN_ID_UUID,
  TEMPORARY_DEPENDANT_ID_UUID,
  AMRS_UNIVERSAL_ID_UUID,
  UPI_NUMBER_UUID,
};

export enum HieAttributeType {
  KRAPin = 'kra_pin',
  CivilStatus = 'civil_status',
  Email = 'email',
  Phone = 'phone',
  PlaceOfBirth = 'place_of_birth',
  Citizenship = 'citizenship',
  Cr = 'id',
}

const CONTACT_PHONE_NUMBER_UUID = '72a759a8-1359-11df-a1f1-0026b9348838';
const CITIZENSHIP_UUID = '72a759a8-1359-11df-a1f1-0026b9348838';
const CONTACT_EMAIL_ADDRESS_UUID = '2f65dbcb-3e58-45a3-8be7-fd1dc9aa0faa';
const ALTERNATIVE_CONTACT_PHONE_NUMBER_UUID = 'c725f524-c14a-4468-ac19-4a0e6661c930';
const KRA_PIN_UUID = 'ae683747-b3fc-4e5c-bad3-c3be743b248f';
const CIVIL_STATUS_UUID = '8d871f2a-c2cc-11de-8d13-0010c6dffd0f';
const CLIENT_REGISTRY_ID_UUID = 'e068e02b-faac-4baf-bd58-fe6e0c29a81f';
const PLACE_OF_BIRTH_UUID = '8d8718c2-c2cc-11de-8d13-0010c6dffd0f';
const EMAIL_UUID = '2f65dbcb-3e58-45a3-8be7-fd1dc9aa0faa';

export const PersonAttributeTypeUuids = {
  CONTACT_PHONE_NUMBER_UUID,
  CITIZENSHIP_UUID,
  CONTACT_EMAIL_ADDRESS_UUID,
  ALTERNATIVE_CONTACT_PHONE_NUMBER_UUID,
  KRA_PIN_UUID,
  CIVIL_STATUS_UUID,
  CLIENT_REGISTRY_ID_UUID,
  PLACE_OF_BIRTH_UUID,
  EMAIL_UUID,
};

const PARENT_CHILD_UUID = '7878d348-1359-11df-a1f1-0026b9348838';
const AUNT_UNCLE_NIECE_NEPHEW_UUID = '7878dd3e-1359-11df-a1f1-0026b9348838';
const SPOUSE_UUID = '7878df3c-1359-11df-a1f1-0026b9348838';
const GRANDCHILD_GRANDPARENT_UUID = '7878e144-1359-11df-a1f1-0026b9348838';
const GUARDIAN_CHILD_UUD = '01bc0cf5-d428-427f-be13-305eb9cad7ba';
const FOSTER_CHILD_FOSTER_PARENT_UUID = '7878e52c-1359-11df-a1f1-0026b9348838';
const OTHER_NON_CODED_UUID = 'af78531e-98ab-41da-be3a-6a871ecbf8c0';

export const RelationshipTypeUuids = {
  PARENT_CHILD_UUID,
  AUNT_UNCLE_NIECE_NEPHEW_UUID,
  SPOUSE_UUID,
  GRANDCHILD_GRANDPARENT_UUID,
  GUARDIAN_CHILD_UUD,
  FOSTER_CHILD_FOSTER_PARENT_UUID,
  OTHER_NON_CODED_UUID,
};
