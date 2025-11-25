import { createPerson, createRelationship } from '../client-registry-search/client-registry.resource';
import {
  type CreateRelationshipDto,
  HieClientDependant,
  type HieDependant,
  HieIdentificationType,
  IdentifierTypesUuids,
  PersonAttributeTypeUuids,
  RelationshipTypeUuids,
} from '../client-registry/types';
import { CivilStatusUids } from './constants/civil-status';
import { type HieIdentifications, type HieClient, type CreatePersonDto } from './types';

const clientDatailsFields = [
  'id',
  'other_identifications',
  'first_name',
  'middle_name',
  'last_name',
  'gender',
  'date_of_birth',
  'is_alive',
  'deceased_datetime',
  'phone',
  'email',
  'civil_status',
  'place_of_birth',
  'citizenship',
  'country',
  'county',
  'sub_county',
  'ward',
  'village_estate',
  'longitude',
  'latitude',
  'identification_type',
];

const nameFields = ['first_name', 'middle_name', 'last_name'];
const otherPersonFields = ['gender', 'date_of_birth', 'is_alive', 'deceased_datetime'];
const attributeFields = ['phone', 'email', 'civil_status', 'place_of_birth', 'citizenship'];
const addressFields = ['country', 'county', 'sub_county', 'ward', 'village_estate', 'longitude', 'latitude'];
const otherFields = ['gender', 'date_of_birth'];
const identifierFields = [
  HieIdentificationType.Cr,
  HieIdentificationType.SHANumber,
  HieIdentificationType.HouseholdNumber,
  HieIdentificationType.RefugeeID,
  HieIdentificationType.MandateNumber,
  HieIdentificationType.AlienID,
  HieIdentificationType.NationalID,
  HieIdentificationType.TemporaryDependantID,
];
const hieAmrsSyncFields = [
  ...identifierFields,
  ...nameFields,
  ...otherPersonFields,
  ...attributeFields,
  ...addressFields,
];

export function generateHieClientDetails(hieClient: HieClient) {
  let data = {};
  Object.keys(hieClient)
    .filter((key) => {
      return clientDatailsFields.includes(key);
    })
    .forEach((key) => {
      if (key === 'other_identifications') {
        const otherIds = generateOtherIdentifications(hieClient[key]);
        data = {
          ...data,
          ...otherIds,
        };
      } else if (key === 'identification_type') {
        data[hieClient['identification_type']] = hieClient.identification_number;
      } else {
        const value = hieClient[key];
        data[key] = value;
      }
    });
  return data;
}
function generateOtherIdentifications(hieIdentifications: HieIdentifications[]) {
  const other = {};
  hieIdentifications.forEach((id) => {
    other[id.identification_type] = id.identification_number;
  });
  return other;
}

export function generateAmrsPersonPayload(hieClient: HieClient): CreatePersonDto {
  const createPersonPayload: CreatePersonDto = {};
  const namesAttribute = {};
  const addresses = {};
  const attributes = [];
  hieAmrsSyncFields.forEach((d) => {
    if (d === 'first_name') {
      namesAttribute['givenName'] = hieClient.first_name;
    }
    if (d === 'middle_name') {
      namesAttribute['middleName'] = hieClient.middle_name;
    }
    if (d === 'last_name') {
      namesAttribute['familyName'] = hieClient.last_name;
    }
    if (d === 'gender') {
      createPersonPayload['gender'] = hieClient.gender === 'Male' ? 'M' : 'F';
    }
    if (d === 'date_of_birth') {
      createPersonPayload['birthdate'] = hieClient.date_of_birth;
      createPersonPayload['birthdateEstimated'] = false;
    }
    if (d === 'is_alive') {
      createPersonPayload['dead'] = hieClient.is_alive === 0 ? true : false;
    }
    if (d === 'deceased_datetime') {
      if (hieClient.deceased_datetime.length > 0) {
        createPersonPayload['deathDate'] = hieClient.deceased_datetime;
      }
    }
    if (d === 'country' && hieClient.country.length > 0) {
      addresses['country'] = hieClient.country;
      addresses['address1'] = hieClient.country;
    }
    if (d === 'place_of_birth' && hieClient.place_of_birth.length > 0) {
      addresses['address10'] = hieClient.place_of_birth;
    }
    if (d === 'county' && hieClient.county.length > 0) {
      addresses['countyDistrict'] = hieClient.county;
    }
    if (d === 'sub_county' && hieClient.sub_county.length > 0) {
      addresses['address2'] = hieClient.sub_county;
      addresses['stateProvince'] = hieClient.sub_county;
    }
    if (d === 'ward' && hieClient.sub_county.length > 0) {
      addresses['address7'] = hieClient.sub_county;
      addresses['address4'] = hieClient.sub_county;
    }
    if (d === 'village_estate' && hieClient.village_estate.length > 0) {
      addresses['cityVillage'] = hieClient.village_estate;
    }
    if (d === 'longitude' && hieClient.longitude.length > 0) {
      addresses['longitude'] = hieClient.longitude;
    }
    if (d === 'latitude' && hieClient.latitude.length > 0) {
      addresses['latitude'] = hieClient.latitude;
    }
    if (d === 'place_of_birth' && hieClient.place_of_birth.length > 0) {
      attributes.push({
        value: hieClient.place_of_birth,
        attributeType: PersonAttributeTypeUuids.PLACE_OF_BIRTH_UUID,
      });
    }
    if (d === 'phone' && hieClient.phone.length > 0) {
      attributes.push({
        value: hieClient.phone,
        attributeType: PersonAttributeTypeUuids.CONTACT_PHONE_NUMBER_UUID,
      });
    }
    if (d === 'email' && hieClient.email.length > 0) {
      attributes.push({
        value: hieClient.email,
        attributeType: PersonAttributeTypeUuids.CONTACT_EMAIL_ADDRESS_UUID,
      });
    }
    if (d === 'civil_status' && hieClient.civil_status.length > 0) {
      attributes.push({
        value: getAmrsConceptUuidFromField(hieClient.civil_status),
        attributeType: PersonAttributeTypeUuids.CIVIL_STATUS_UUID,
      });
    }
    if (d === 'id' && hieClient.id) {
      attributes.push({
        value: hieClient.id,
        attributeType: PersonAttributeTypeUuids.CLIENT_REGISTRY_ID_UUID,
      });
    }
    if (d === 'citizenship' && hieClient.citizenship) {
      attributes.push({
        value: hieClient.citizenship,
        attributeType: PersonAttributeTypeUuids.CITIZENSHIP_UUID,
      });
    }
  });
  if (Object.keys(namesAttribute).length > 0) {
    createPersonPayload['names'] = [namesAttribute];
  }
  if (Object.keys(addresses).length > 0) {
    createPersonPayload['addresses'] = [addresses];
  }
  if (attributes.length > 0) {
    createPersonPayload['attributes'] = attributes;
  }
  return createPersonPayload;
}
function getAmrsConceptUuidFromField(fieldName: string): string {
  let conceptUuid = '';
  switch (fieldName) {
    case 'Divorced':
      conceptUuid = CivilStatusUids.DIVORCED_UUID;
      break;
    case 'Married':
      conceptUuid = CivilStatusUids.MARRIED_UUID;
      break;
    case 'Single':
      conceptUuid = CivilStatusUids.SINGLE_UUID;
      break;
    default:
      conceptUuid = CivilStatusUids.NOT_APPLICABLE_UUID;
  }
  return conceptUuid;
}
export function generateAmrsCreatePatientIdentifiersPayload(hieClient: HieClient, identifierLocation: string) {
  const identifiers = [];
  // add CR number
  identifiers.push({
    identifierType: getAmrsIdentifierTypeUuid(HieIdentificationType.Cr),
    identifier: hieClient.id,
    location: identifierLocation,
  });

  // add main identifier
  identifiers.push({
    identifierType: getAmrsIdentifierTypeUuid(hieClient.identification_type),
    identifier: hieClient.identification_number,
    location: identifierLocation,
  });

  // add other idenfications
  hieClient.other_identifications.forEach((id) => {
    identifiers.push({
      identifierType: getAmrsIdentifierTypeUuid(id.identification_type),
      identifier: id.identification_number,
      location: identifierLocation,
    });
  });

  return identifiers;
}

function getAmrsIdentifierTypeUuid(hieIdentifierName: string) {
  let idTypeUuid;
  switch (hieIdentifierName) {
    case HieIdentificationType.NationalID:
      idTypeUuid = IdentifierTypesUuids.NATIONAL_ID_UUID;
      break;
    case HieIdentificationType.HouseholdNumber:
      idTypeUuid = IdentifierTypesUuids.HOUSE_HOLD_NUMBER_UUID;
      break;
    case HieIdentificationType.AlienID:
      idTypeUuid = IdentifierTypesUuids.ALIEN_ID_UUID;
      break;
    case HieIdentificationType.SHANumber:
      idTypeUuid = IdentifierTypesUuids.SHA_UUID;
      break;
    case HieIdentificationType.MandateNumber:
      idTypeUuid = IdentifierTypesUuids.MANDATE_NUMBER_UUID;
      break;
    case HieIdentificationType.RefugeeID:
      idTypeUuid = IdentifierTypesUuids.REFUGEE_ID_UUID;
      break;
    case HieIdentificationType.Cr:
      idTypeUuid = IdentifierTypesUuids.CLIENT_REGISTRY_NO_UUID;
      break;
    case HieIdentificationType.TemporaryDependantID:
      idTypeUuid = IdentifierTypesUuids.TEMPORARY_DEPENDANT_ID_UUID;
      break;
  }
  return idTypeUuid;
}

export async function createPatientDependantRelationsips(patientUuid: string, hieClientDependants: HieDependant[]) {
  for (const dependant of hieClientDependants) {
    await createPatientDependantRelationsip(patientUuid, dependant);
  }
}

async function createPatientDependantRelationsip(patientUuid: string, hieDependant: HieDependant) {
  const resp = await createDependant(hieDependant);
  const res = (await resp.json()) as any;
  const dependantPersonUuid = res.uuid;
  return createDependantRelationship(hieDependant, patientUuid, dependantPersonUuid);
}

function createDependant(hieDependant: HieDependant) {
  const depentantPersonPayload = createDependantPersonPayload(hieDependant);
  return createDependantPerson(depentantPersonPayload);
}

function createDependantPersonPayload(hieDependant: HieDependant) {
  const createPersonPayload: CreatePersonDto = generateAmrsPersonPayload(hieDependant.result[0]);
  return createPersonPayload;
}

function createDependantPerson(createPersonPayload: CreatePersonDto) {
  return createPerson(createPersonPayload);
}

function createDependantRelationship(hieDependant: HieDependant, patientUuid: string, dependantPersonUuid: string) {
  const relationshipPayload = generateRelationshipPayload(hieDependant, patientUuid, dependantPersonUuid);
  return createDepandantRelationship(relationshipPayload);
}

function generateRelationshipPayload(hieDependant: HieDependant, patientUuid: string, dependantPersonUuid: string) {
  const payload = getPatientRelationshipPayload(hieDependant.relationship, patientUuid, dependantPersonUuid);

  return payload;
}

function createDepandantRelationship(relationshipPayload: CreateRelationshipDto) {
  return createRelationship(relationshipPayload);
}

export function getPatientRelationshipPayload(
  relationship: string,
  personAuuid: string,
  personBuUuid: string,
): CreateRelationshipDto {
  const startDate = new Date().toISOString();
  const patientRelationshipPayload = {
    personA: personAuuid,
    relationshipType: getAmrsRelationshipTypeUuid(relationship),
    personB: personBuUuid,
    startDate: startDate,
  };
  return patientRelationshipPayload;
}

function getAmrsRelationshipTypeUuid(relationshipType: string) {
  let relationShipTypeUuid = '';
  switch (relationshipType) {
    case 'Spouse':
      relationShipTypeUuid = RelationshipTypeUuids.SPOUSE_UUID;
      break;
    case 'Child':
      relationShipTypeUuid = RelationshipTypeUuids.PARENT_CHILD_UUID;
      break;
    default:
      relationShipTypeUuid = RelationshipTypeUuids.OTHER_NON_CODED_UUID;
  }

  return relationShipTypeUuid;
}
