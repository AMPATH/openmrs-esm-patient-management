import dayjs from 'dayjs';
import { HieAttributeType, type HieClient, HieIdentificationType } from '../types';
import {
  type AmrsClient,
  type CustomRelationship,
  IdentifierTypesUuids,
  PersonAttributeTypeUuids,
  RelationshipTypeUuids,
} from './types';

export const nameFields = ['givenName', 'middleName', 'familyName'];

export const addressFields = [
  'country',
  'countyDistrict',
  'address2',
  'address7',
  'cityVillage',
  'longitude',
  'latitude',
];

export const personSyncFields = [...nameFields, 'gender', 'birthdate', ...addressFields];

export const identifiersSyncFields = () => Object.keys(HieIdentificationType);

export const attributesSyncFields = () => Object.keys(HieAttributeType);

export const getIdentifierUuid = (identifier: string) => {
  let val = '';
  switch (identifier) {
    case HieIdentificationType.AlienID:
      val = IdentifierTypesUuids.ALIEN_ID_UUID;
      break;
    case HieIdentificationType.HouseholdNumber:
      val = IdentifierTypesUuids.HOUSE_HOLD_NUMBER_UUID;
      break;
    case HieIdentificationType.MandateNumber:
      val = IdentifierTypesUuids.MANDATE_NUMBER_UUID;
      break;
    case HieIdentificationType.Cr:
      val = IdentifierTypesUuids.CLIENT_REGISTRY_NO_UUID;
      break;
    case HieIdentificationType.NationalID:
      val = IdentifierTypesUuids.NATIONAL_ID_UUID;
      break;
    case HieIdentificationType.RefugeeID:
      val = IdentifierTypesUuids.REFUGEE_ID_UUID;
      break;
    case HieIdentificationType.SHANumber:
      val = IdentifierTypesUuids.SHA_UUID;
      break;
    case HieIdentificationType.TemporaryDependantID:
      val = IdentifierTypesUuids.TEMPORARY_DEPENDANT_ID_UUID;
      break;
    default:
      val = '';
  }
  return val;
};

export const getAttributeUuid = (attribute: string) => {
  let val = '';
  switch (attribute) {
    case HieAttributeType.Citizenship:
      val = PersonAttributeTypeUuids.CITIZENSHIP_UUID;
      break;
    case HieAttributeType.CivilStatus:
      val = PersonAttributeTypeUuids.CIVIL_STATUS_UUID;
      break;
    case HieAttributeType.Email:
      val = PersonAttributeTypeUuids.CONTACT_EMAIL_ADDRESS_UUID;
      break;
    case HieAttributeType.KRAPin:
      val = PersonAttributeTypeUuids.KRA_PIN_UUID;
      break;
    case HieAttributeType.Phone:
      val = PersonAttributeTypeUuids.CONTACT_PHONE_NUMBER_UUID;
      break;
    case HieAttributeType.PlaceOfBirth:
      val = PersonAttributeTypeUuids.PLACE_OF_BIRTH_UUID;
      break;
    case HieAttributeType.Cr:
      val = PersonAttributeTypeUuids.CLIENT_REGISTRY_ID_UUID;
      break;
    default:
      val = '';
  }
  return val;
};

export const getAmrsRelationshipTypeUuid = (relationshipType: string) => {
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
};

export const patientObjFields = [...personSyncFields, ...identifiersSyncFields()];

const sanitizeValue = (value: unknown) => {
  if (value === null || value === undefined) {
    return '';
  }
  return value;
};

export const mapFieldValue = (field: string, hieData: HieClient, amrsPerson: AmrsClient): Array<string> => {
  let arr = [];
  switch (field) {
    case 'givenName':
      arr = [sanitizeValue(amrsPerson?.person?.preferredName?.givenName), sanitizeValue(hieData?.first_name)];
      break;
    case 'middleName':
      arr = [sanitizeValue(amrsPerson?.person?.preferredName?.middleName), sanitizeValue(hieData?.middle_name)];
      break;
    case 'familyName':
      arr = [sanitizeValue(amrsPerson?.person?.preferredName?.familyName), sanitizeValue(hieData?.last_name)];
      break;
    case 'gender':
      arr = [sanitizeValue(amrsPerson?.person?.gender), sanitizeValue(hieData?.gender === 'Female' ? 'F' : 'M')];
      break;
    case 'birthdate':
      arr = [
        dayjs(sanitizeValue(amrsPerson?.person?.birthdate) + '', 'YYYY-MM-DD', true).isValid()
          ? dayjs(sanitizeValue(amrsPerson?.person?.birthdate) + '').format('YYYY-MM-DD')
          : sanitizeValue(amrsPerson?.person?.birthdate),
        sanitizeValue(hieData?.date_of_birth),
      ];
      break;
    case 'country':
      arr = [sanitizeValue(amrsPerson?.person?.preferredAddress?.country), sanitizeValue(hieData?.country)];
      break;
    case 'countyDistrict':
      arr = [sanitizeValue(amrsPerson?.person?.preferredAddress?.countyDistrict), sanitizeValue(hieData?.county)];
      break;
    case 'address2':
      arr = [sanitizeValue(amrsPerson?.person?.preferredAddress?.address2), sanitizeValue(hieData?.sub_county)];
      break;
    case 'address7':
      arr = [sanitizeValue(amrsPerson?.person?.preferredAddress?.address7), sanitizeValue(hieData?.ward)];
      break;
    case 'cityVillage':
      arr = [sanitizeValue(amrsPerson?.person?.preferredAddress?.cityVillage), sanitizeValue(hieData?.village_estate)];
      break;
    case 'longitude':
      arr = [sanitizeValue(amrsPerson?.person?.preferredAddress?.longitude), sanitizeValue(hieData?.longitude)];
      break;
    case 'latitude':
      arr = [sanitizeValue(amrsPerson?.person?.preferredAddress?.latitude), sanitizeValue(hieData?.latitude)];
      break;
    case 'NationalID':
      arr = [
        sanitizeValue(
          amrsPerson?.person?.identifiers?.find(
            (v) => v.identifierType.uuid === getIdentifierUuid(HieIdentificationType.NationalID),
          )?.identifier,
        ),
        sanitizeValue(
          hieData?.other_identifications.find((v) => v.identification_type === HieIdentificationType.NationalID)
            ?.identification_number,
        ),
      ];
      break;
    case 'SHANumber':
      arr = [
        sanitizeValue(
          amrsPerson?.person?.identifiers?.find(
            (v) => v.identifierType.uuid === getIdentifierUuid(HieIdentificationType.SHANumber),
          )?.identifier,
        ),
        sanitizeValue(
          hieData?.other_identifications.find((v) => v.identification_type === HieIdentificationType.SHANumber)
            ?.identification_number,
        ),
      ];
      break;
    case 'HouseholdNumber':
      arr = [
        sanitizeValue(
          amrsPerson?.person?.identifiers?.find(
            (v) => v.identifierType.uuid === getIdentifierUuid(HieIdentificationType.HouseholdNumber),
          )?.identifier,
        ),
        sanitizeValue(
          hieData?.other_identifications?.find((v) => v.identification_type === HieIdentificationType.HouseholdNumber)
            ?.identification_number,
        ),
      ];
      break;
    case 'RefugeeID':
      arr = [
        sanitizeValue(
          amrsPerson?.person?.identifiers?.find(
            (v) => v.identifierType.uuid === getIdentifierUuid(HieIdentificationType.RefugeeID),
          )?.identifier,
        ),
        sanitizeValue(
          hieData?.other_identifications.find((v) => v.identification_type === HieIdentificationType.RefugeeID)
            ?.identification_number,
        ),
      ];
      break;
    case 'AlienID':
      arr = [
        sanitizeValue(
          amrsPerson?.person?.identifiers?.find(
            (v) => v.identifierType.uuid === getIdentifierUuid(HieIdentificationType.AlienID),
          )?.identifier,
        ),
        sanitizeValue(
          hieData?.other_identifications.find((v) => v.identification_type === HieIdentificationType.AlienID)
            ?.identification_number,
        ),
      ];
      break;
    case 'MandateNumber':
      arr = [
        sanitizeValue(
          amrsPerson?.person?.identifiers?.find(
            (v) => v.identifierType.uuid === getIdentifierUuid(HieIdentificationType.MandateNumber),
          )?.identifier,
        ),
        sanitizeValue(
          hieData?.other_identifications.find((v) => v.identification_type === HieIdentificationType.MandateNumber)
            ?.identification_number,
        ),
      ];
      break;
    case 'Cr':
      arr = [
        sanitizeValue(
          amrsPerson?.person?.identifiers?.find(
            (v) => v.identifierType.uuid === getIdentifierUuid(HieIdentificationType.Cr),
          )?.identifier,
        ),
        sanitizeValue(hieData?.id),
      ];
      break;
    case 'TemporaryDependantID':
      arr = [
        sanitizeValue(
          amrsPerson?.person?.identifiers?.find(
            (v) => v.identifierType.uuid === getIdentifierUuid(HieIdentificationType.TemporaryDependantID),
          )?.identifier,
        ),
        sanitizeValue(
          hieData?.other_identifications.find(
            (v) => v.identification_type === HieIdentificationType.TemporaryDependantID,
          )?.identification_number,
        ),
      ];
      break;
    case 'PlaceOfBirth':
      arr = [
        sanitizeValue(
          amrsPerson?.person?.attributes.find(
            (v) => v.attributeType.uuid === getAttributeUuid(HieAttributeType.PlaceOfBirth),
          )?.value,
        ),
        sanitizeValue(hieData?.place_of_birth),
      ];
      break;
    case 'CivilStatus':
      arr = [
        sanitizeValue(
          amrsPerson?.person?.attributes.find(
            (v) => v.attributeType.uuid === getAttributeUuid(HieAttributeType.CivilStatus),
          )?.value,
        ),
        sanitizeValue(hieData?.civil_status),
      ];
      break;
    case 'Email':
      arr = [
        sanitizeValue(
          amrsPerson?.person?.attributes.find((v) => v.attributeType.uuid === getAttributeUuid(HieAttributeType.Email))
            ?.value,
        ),
        sanitizeValue(hieData?.email),
      ];
      break;
    case 'Phone':
      arr = [
        sanitizeValue(
          amrsPerson?.person?.attributes.find((v) => v.attributeType.uuid === getAttributeUuid(HieAttributeType.Phone))
            ?.value,
        ),
        sanitizeValue(hieData?.phone),
      ];
      break;
    case 'KRAPin':
      arr = [
        sanitizeValue(
          amrsPerson?.person?.attributes.find((v) => v.attributeType.uuid === getAttributeUuid(HieAttributeType.KRAPin))
            ?.value,
        ),
        sanitizeValue(hieData?.kra_pin),
      ];
      break;
    case 'Citizenship':
      arr = [
        sanitizeValue(
          amrsPerson?.person?.attributes.find(
            (v) => v.attributeType.uuid === getAttributeUuid(HieAttributeType.Citizenship),
          )?.value,
        ),
        sanitizeValue(hieData?.citizenship),
      ];
      break;
    default:
      arr = ['', ''];
  }
  return arr;
};

export function getPatientRelationshipPayload(amrsPerson: AmrsClient, relationshipType: string, dependantUuid: string) {
  const startDate = dayjs().format('YYYY-MM-DDTHH:mm:ss.SSSZZ');
  const patientRelationshipPayload = {
    personA: amrsPerson.person.uuid,
    relationshipType: getAmrsRelationshipTypeUuid(relationshipType),
    personB: dependantUuid,
    startDate: startDate,
  };
  return patientRelationshipPayload;
}

export function mapAmrsPatientRelationship(uuid: string, relationships: Array<any>) {
  const relationshipsArr: Array<CustomRelationship> = [];
  if (relationships) {
    for (const relationship of relationships) {
      if (uuid === relationship?.personA?.uuid) {
        const relation = {
          uuid: relationship?.uuid,
          display: relationship?.personB?.display,
          relative: relationship?.personB?.display,
          relatedPersonUuid: relationship?.personB?.uuid,
          relationshipType: relationship?.relationshipType?.bIsToA,
          relationshipTypeUuId: relationship?.relationshipType?.uuid,
          relationshipTypeName: relationship?.relationshipType?.display,
          relatedPerson: relationship?.personB,
        };
        relationshipsArr.push(relation);
      } else {
        const relation = {
          uuid: relationship?.uuid,
          display: relationship?.personA?.display,
          relative: relationship?.personA?.display,
          relatedPersonUuid: relationship?.personA?.uuid,
          relationshipType: relationship?.relationshipType?.aIsToB,
          relatedPerson: relationship?.personA,
          relationshipTypeUuId: relationship?.relationshipType?.uuid,
          relationshipTypeName: relationship?.relationshipType?.display,
        };
        relationshipsArr.push(relation);
      }
    }
  }
  return relationshipsArr;
}

export function getPatientAttributes(hieClient: HieClient) {
  const attributes = [];
  if (hieClient.place_of_birth.length > 0) {
    attributes.push({
      value: hieClient.place_of_birth,
      attributeType: getAttributeUuid(HieAttributeType.PlaceOfBirth),
    });
  }
  if (hieClient.phone.length > 0) {
    attributes.push({
      value: hieClient.phone,
      attributeType: getAttributeUuid(HieAttributeType.Phone),
    });
  }
  if (hieClient.email.length > 0) {
    attributes.push({
      value: hieClient.email,
      attributeType: getAttributeUuid(HieAttributeType.Email),
    });
  }
  if (hieClient.kra_pin.length > 0) {
    attributes.push({
      value: hieClient.kra_pin,
      attributeType: getAttributeUuid(HieAttributeType.KRAPin),
    });
  }
  if (hieClient.civil_status.length > 0) {
    attributes.push({
      value: this.getAmrsConceptUuidFromField(hieClient.civil_status),
      attributeType: getAttributeUuid(HieAttributeType.CivilStatus),
    });
  }
  if (hieClient.id) {
    attributes.push({
      value: hieClient.id,
      attributeType: getAttributeUuid(HieAttributeType.Cr),
    });
  }
  if (hieClient.citizenship) {
    attributes.push({
      value: hieClient.citizenship,
      attributeType: getAttributeUuid(HieAttributeType.Citizenship),
    });
  }
  return attributes;
}
