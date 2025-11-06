import React from 'react';
import { PersonAttributeField } from '../field/person-attributes/person-attribute-field.component';
import { useConfig } from '@openmrs/esm-framework';
import { type RegistrationConfig } from '../../config-schema';

export const OccupationField = () => {
  const config = useConfig<RegistrationConfig>();

  const fieldDefinition = {
    id: 'occupation',
    type: 'person attribute',
    uuid: config.fieldConfigurations.academicOccupation.occupation.personAttributeUuid,
    validation: config.fieldConfigurations.academicOccupation.occupation.validation,
    showHeading: false,
    answerConceptSetUuid: null,
    customConceptAnswers: [
      {
        label: 'TEACHER',
        uuid: 'a8a09d0c-1350-11df-a1f1-0026b9348838',
      },
      {
        label: 'CASUAL WORKER',
        uuid: 'a8a09b90-1350-11df-a1f1-0026b9348838',
      },
      {
        label: 'HOUSEWIFE',
        uuid: 'a8a09dca-1350-11df-a1f1-0026b9348838',
      },
      {
        label: 'POLICE OFFICER',
        uuid: 'a8a09e92-1350-11df-a1f1-0026b9348838',
      },
      {
        label: 'OTHER NON-CODED',
        uuid: 'a8aaf3e2-1350-11df-a1f1-0026b9348838',
      },
      {
        label: 'FARMER',
        uuid: 'a8a09c4e-1350-11df-a1f1-0026b9348838',
      },
      {
        label: 'UNEMPLOYED',
        uuid: 'a8a09f50-1350-11df-a1f1-0026b9348838',
      },
      {
        label: 'NOT APPLICABLE',
        uuid: 'a89ad3a4-1350-11df-a1f1-0026b9348838',
      },
      {
        label: 'SEX WORKER',
        uuid: 'a89ff438-1350-11df-a1f1-0026b9348838',
      },
      {
        label: 'HEALTH CARE PROVIDER',
        uuid: 'a8aaf158-1350-11df-a1f1-0026b9348838',
      },
      {
        label: 'SELF EMPLOYMENT',
        uuid: 'a8b03294-1350-11df-a1f1-0026b9348838',
      },
      {
        label: 'TRUCK DRIVER',
        uuid: '5ebb18d6-8fab-43bc-898f-6428dcc24c1e',
      },
      {
        label: 'FISHING',
        uuid: '0ac89086-4751-4db8-96c5-cd62152d66ad',
      },
      {
        label: 'FORMAL EMPLOYMENT',
        uuid: '49c8583d-baa0-4b80-a719-8c5609129c15',
      },
      {
        label: 'CIVIL SERVANT',
        uuid: '529a8c73-617d-4aee-ac0c-5c22f38f4265',
      },
      {
        label: 'CONSULTANT',
        uuid: 'a8a8c96e-1350-11df-a1f1-0026b9348838',
      },
      {
        label: 'CLINICIAN',
        uuid: 'a89d1c68-1350-11df-a1f1-0026b9348838',
      },
      {
        label: 'NURSE',
        uuid: 'a8b02f92-1350-11df-a1f1-0026b9348838',
      },
      {
        label: 'STUDENT',
        uuid: '05b4c838-a185-4bb0-8c33-71f80ea7c4cf',
      },
      {
        label: 'LABORATORY TECHNOLOGIST',
        uuid: 'e77a5de0-22d7-424e-978d-d3464d4170aa',
      },
      {
        label: 'CLEANER',
        uuid: '3164799f-637a-45e7-82cf-19954710d0e8',
      },
      {
        label: 'VOLUNTARY TESTING AND COUNSELING CENTER COUNSELOR',
        uuid: '45de16c7-9f55-42c0-86ce-36ed6192842b',
      },
      {
        label: 'OTHER HEALTH WORKER',
        uuid: '7764a54b-3e5d-4c8a-b64b-4ed21ba217b0',
      },
      {
        label: 'EMPLOYED',
        uuid: 'a89ec338-1350-11df-a1f1-0026b9348838',
      },
      {
        label: 'MINER',
        uuid: '27aec389-175b-4c56-b992-8c48d4257467',
      },
      {
        label: 'INDUSTRIAL WORKER',
        uuid: 'd3610d6c-eb9c-43a0-8828-2d875c4ccc5c',
      },
      {
        label: 'MECHANIC',
        uuid: '42ba6ccd-81d5-436b-b244-b49fde95277e',
      },
      {
        label: 'BODA-BODA',
        uuid: '16281ca7-8cb2-4d80-851c-0485f3d55aaa',
      },
      {
        label: 'HAWKER',
        uuid: 'e37dcb06-07f5-49d4-8383-c8dea87e05c5',
      },
      {
        label: 'BUS CONDUCTOR',
        uuid: '202bc5f1-f337-4246-bed5-4030f114e7a0',
      },
      {
        label: 'HERDSMAN',
        uuid: '76cc0ab6-81e3-4040-b57f-fcf118b6173d',
      },
      {
        label: 'HOUSEKEEPER',
        uuid: '193211aa-9dbb-4602-a567-1b1b67f5827b',
      },
    ],
  };
  return <PersonAttributeField fieldDefinition={fieldDefinition} />;
};
