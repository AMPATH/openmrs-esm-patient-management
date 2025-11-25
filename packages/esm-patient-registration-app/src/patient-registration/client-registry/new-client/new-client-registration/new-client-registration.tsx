import { navigate, showSnackbar, useLocations, useSession } from '@openmrs/esm-framework';
import React, { useRef, useState } from 'react';
import { t } from 'i18next';
import { Select, SelectItem, Button, InlineLoading } from '@carbon/react';
import { EducationOptions, MaritalOptions, OccupationOptions, ReligionOptions } from '../registration-form-data';
import {
  createPatientDependantRelationsips,
  generateAmrsCreatePatientIdentifiersPayload,
  generateAmrsPersonPayload,
} from '../../hie-client-adapter';
import { type AmrsErrorResponse, IdentifierTypesUuids, PersonAttributeTypeUuids, type HieClient } from '../../types';
import { generateAmrsUniversalIdentifier } from '../../../patient-registration.resource';
import { createPatient } from '../../../client-registry-search/client-registry.resource';
import styles from './new-client-registration.scss';

interface NewClientRegistrationProps {
  client: HieClient;
}

const NewClientRegistration: React.FC<NewClientRegistrationProps> = ({ client }) => {
  const [loading, setLoading] = useState<boolean>(false);
  const { sessionLocation } = useSession();
  const occupationRef = useRef<{ value: string }>();
  const educationRef = useRef<{ value: string }>();
  const religionRef = useRef<{ value: string }>();
  const maritalStatusRef = useRef<{ value: string }>();
  const locationRef = useRef<{ value: string }>();
  const locations = useLocations();
  const registerPatient = async () => {
    setLoading(true);
    const attributes = generatePatientAttributes();
    if (!isValidateAttributesPayload(attributes)) {
      setLoading(false);
      return false;
    }
    const createPersonPayload = generateAmrsPersonPayload(client);
    createPersonPayload['attributes'] = attributes;
    const identifiers = await generatePatientIdentifiers();

    try {
      const resp = await createPatient({
        person: createPersonPayload,
        identifiers: identifiers,
      });

      const res = await resp.json();
      const patientUuid = res.uuid;

      if (patientUuid) {
        showAlertMessage('success', 'Patient Successfully registered', 'Patient created');
      }

      // add relationship/dependant data
      if (client.dependants.length > 0) {
        createPatientDependantRelationsips(patientUuid, client.dependants);

        if (patientUuid) {
          showAlertMessage('success', 'Patient Depandants crreated', 'Patient Depandants and relationships created');
        }
      }
      navigateToPatientSummary(patientUuid);
    } catch (e) {
      const errorResp = e['responseBody'] ?? e.message;
      showAlertMessage('error', 'Error Creating Patient', '');
      const errors = getErrorMessages(errorResp);
      if (errors && errors.length > 0) {
        for (let error of errors) {
          showAlertMessage('error', error, '');
        }
      }
    } finally {
      setLoading(false);
    }
  };
  const navigateToPatientSummary = (patientUuid: string) => {
    navigate({ to: `${window.spaBase}/patient/${patientUuid}/chart/PatientSummary` });
  };
  const generatePatientIdentifiers = async () => {
    const amrsUniverSalId = await generateAmrsUniversalIdentifier();
    if (amrsUniverSalId) {
      showAlertMessage('success', 'AMRS Universal ID Successfully generated', `${amrsUniverSalId}`);
    }
    const identifierLocation = locationRef.current?.value ?? sessionLocation.uuid;
    if (!identifierLocation) {
      showAlertMessage('error', 'Please select the identifier Location', '');
      return;
    }
    const identifiers = generateAmrsCreatePatientIdentifiersPayload(client, identifierLocation);
    identifiers.push({
      identifierType: IdentifierTypesUuids.AMRS_UNIVERSAL_ID_UUID,
      identifier: amrsUniverSalId,
      location: identifierLocation,
      preferred: true,
    });
    return identifiers;
  };
  const generatePatientAttributes = () => {
    const maritalStatus = maritalStatusRef.current?.value;
    const highestLevelOfEducation = educationRef.current?.value;
    const religion = religionRef.current?.value;
    const occupation = occupationRef.current?.value;
    const attributes = [];
    if (maritalStatus) {
      attributes.push({
        value: maritalStatus,
        attributeType: PersonAttributeTypeUuids.CIVIL_STATUS_UUID,
      });
    }
    if (highestLevelOfEducation) {
      attributes.push({
        value: highestLevelOfEducation,
        attributeType: PersonAttributeTypeUuids.HIGHEST_LEVEL_OF_EDUCATION_UUID,
      });
    }
    if (religion) {
      attributes.push({
        value: religion,
        attributeType: PersonAttributeTypeUuids.RELIGION_UUID,
      });
    }
    if (occupation) {
      attributes.push({
        value: occupation,
        attributeType: PersonAttributeTypeUuids.OCCUPATION_UUID,
      });
    }
    return attributes;
  };
  const isValidateAttributesPayload = (attributes: { value: string; attributeType: string }[]): boolean => {
    if (attributes.length === 0) {
      showAlertMessage('error', 'Please select the patient attributes', '');
      return false;
    }
    if (!hasAttribute(attributes, PersonAttributeTypeUuids.HIGHEST_LEVEL_OF_EDUCATION_UUID)) {
      showAlertMessage('error', 'Missing Education Level', '');
      return false;
    }
    if (!hasAttribute(attributes, PersonAttributeTypeUuids.OCCUPATION_UUID)) {
      showAlertMessage('error', 'Missing Occupation Data', '');
      return false;
    }

    if (!hasAttribute(attributes, PersonAttributeTypeUuids.RELIGION_UUID)) {
      showAlertMessage('error', 'Missing religion Data', '');
      return false;
    }
    if (!hasAttribute(attributes, PersonAttributeTypeUuids.CIVIL_STATUS_UUID)) {
      showAlertMessage('error', 'Missing Marital Status Data', '');
      return false;
    }

    return true;
  };
  const hasAttribute = (attributes: { value: string; attributeType: string }[], attributeTypeUuid): boolean => {
    return attributes.some((attr) => {
      return attr.attributeType === attributeTypeUuid;
    });
  };
  const showAlertMessage = (alertType: 'success' | 'error', title: string, message: string) => {
    showSnackbar({
      kind: alertType,
      title: title,
      subtitle: message,
    });
  };
  const getErrorMessages = (error: AmrsErrorResponse) => {
    const errors = [];
    if (error && error.error) {
      if (error.error.error) {
        const globalErrors = error.error.error.globalErrors || null;
        if (globalErrors) {
          for (const err of globalErrors) {
            errors.push(err.message);
          }
        }
      } else if (error.error) {
        if (error.error['globalErrors']) {
          const globalErrors = error.error['globalErrors'] || null;
          if (globalErrors) {
            for (const err of globalErrors) {
              errors.push(err.message);
            }
          }
        } else if (error.error['message']) {
          errors.push(error.error['message']);
        }
      } else {
        errors.push(
          error.error.error.message ||
            'An error occurred while creating the patient. Please try again or contact support',
        );
      }
    }
    return errors;
  };
  return (
    <>
      <div className={styles.registrationHeader}>
        <h4>Registration Details</h4>
      </div>
      <div className={styles.extraRegQuestions}>
        <div className={styles.formRow}>
          <div className={styles.formGroup}>
            <Select id="occupation" labelText="Occupation" ref={occupationRef}>
              <SelectItem text="Choose occupation" value="" />
              {OccupationOptions?.length > 0 &&
                OccupationOptions.map((o) => (
                  <SelectItem key={o.uuid} text={o.label} value={o.uuid}>
                    {o.label}
                  </SelectItem>
                ))}
            </Select>
          </div>
          <div className={styles.formGroup}>
            <Select id="education" labelText="Highest Level of Education" ref={educationRef}>
              <SelectItem text="Choose education level" value="" />
              {EducationOptions?.length > 0 &&
                EducationOptions.map((e) => (
                  <SelectItem key={e.uuid} text={e.label} value={e.uuid}>
                    {e.label}
                  </SelectItem>
                ))}
            </Select>
          </div>
        </div>
        <div className={styles.formRow}>
          <div className={styles.formGroup}>
            <Select id="religion" labelText="Religion" ref={religionRef}>
              <SelectItem text="Choose religion" value="" />
              {ReligionOptions?.length > 0 &&
                ReligionOptions.map((r) => (
                  <SelectItem key={r.uuid} text={r.label} value={r.uuid}>
                    {r.label}
                  </SelectItem>
                ))}
            </Select>
          </div>
          <div className={styles.formGroup}>
            <Select id="maritalStatus" labelText="Marital Status" ref={maritalStatusRef}>
              <SelectItem text="Choose status" value="" />
              {MaritalOptions?.length > 0 &&
                MaritalOptions.map((r) => (
                  <SelectItem key={r.uuid} text={r.label} value={r.uuid}>
                    {r.label}
                  </SelectItem>
                ))}
            </Select>
          </div>
        </div>
        <div className={styles.formRow}>
          <div className={styles.formGroup}>
            <Select id="location" labelText="Identifier Location" ref={locationRef}>
              <SelectItem text={t('chooseLocation', 'Choose a location')} value="" />
              {locations?.length > 0 &&
                locations.map((location) => (
                  <SelectItem key={location.uuid} text={location.display} value={location.uuid}>
                    {location.display}
                  </SelectItem>
                ))}
            </Select>
          </div>
        </div>
        <div className={styles.formRow}>
          <Button kind="primary" onClick={registerPatient} disabled={loading}>
            {loading ? <InlineLoading description="Registering patient..." /> : 'Register Patient'}
          </Button>
        </div>
      </div>
    </>
  );
};
export default NewClientRegistration;
