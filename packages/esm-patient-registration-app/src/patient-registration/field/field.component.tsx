import React from 'react';
import { reportError, useConfig } from '@openmrs/esm-framework';
import { builtInFields, type RegistrationConfig } from '../../config-schema';
import { AddressComponent } from './address/address-field.component';
import { CauseOfDeathField } from './cause-of-death/cause-of-death.component';
import { CustomField } from './custom-field.component';
import { DateAndTimeOfDeathField } from './date-and-time-of-death/date-and-time-of-death.component';
import { DobField } from './dob/dob.component';
import { GenderField } from './gender/gender-field.component';
import { Identifiers } from './id/id-field.component';
import { NameField } from './name/name-field.component';
import { PhoneField } from './phone/phone-field.component';
import ClientRegistryLookupSection from '../client-registry-search/client-registry-search.component';
import { EmailField } from './email/email-field.component';
import { NextOfKinRelationshipField } from './next-of-kin/relationship/next-of-kin-relationship-field.component';
import { NextOfKinPhoneField } from './next-of-kin/phone/next-of-kin-phone-field.component';
import { NextOfKinResidenceField } from './next-of-kin/residence/next-of-kin-residence-field.component';
import { NextOfKinNameField } from './next-of-kin/name/next-of-kin-name-field.component';
import { HighestLevelOfEducationField } from '../education/highest-level-of-education-field.component';
import { OccupationField } from '../occupation/occupation-field.component';

export interface FieldProps {
  name: string;
}

export function Field({ name }: FieldProps) {
  const config = useConfig<RegistrationConfig>();
  if (
    !(builtInFields as ReadonlyArray<string>).includes(name) &&
    !config.fieldDefinitions.some((def) => def.id == name)
  ) {
    reportError(
      `Invalid field name '${name}'. Valid options are '${config.fieldDefinitions
        .map((def) => def.id)
        .concat(builtInFields)
        .join("', '")}'.`,
    );
    return null;
  }

  switch (name) {
    case 'name':
      return <NameField />;
    case 'gender':
      return <GenderField />;
    case 'dob':
      return <DobField />;
    case 'dateAndTimeOfDeath':
      return <DateAndTimeOfDeathField />;
    case 'causeOfDeath':
      return <CauseOfDeathField />;
    case 'address':
      return <AddressComponent />;
    case 'id':
      return <Identifiers />;
    case 'phone':
      return <PhoneField />;
    case 'clientRegistrySearch':
      return <ClientRegistryLookupSection />;
    case 'nextOfKinName':
      return <NextOfKinNameField />;
    case 'nextOfKinRelationship':
      return <NextOfKinRelationshipField />;
    case 'nextOfKinPhoneNumber':
      return <NextOfKinPhoneField />;
    case 'nextOfKinResidence':
      return <NextOfKinResidenceField />;
    case 'email':
      return <EmailField />;
    case 'highestLevelEducation':
      return <HighestLevelOfEducationField />;
    case 'occupation':
      return <OccupationField />;
    default:
      return <CustomField name={name} />;
  }
}
