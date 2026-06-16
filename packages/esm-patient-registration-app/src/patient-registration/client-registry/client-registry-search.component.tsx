import React, { useEffect, useMemo, useState } from 'react';
import { Button, TextInput, InlineLoading, InlineNotification, Dropdown, Modal, ModalBody } from '@carbon/react';
import { type PatientIdentifier, type PersonAttribute, showSnackbar, usePatient, useSession } from '@openmrs/esm-framework';
import { useFormikContext } from 'formik';
import styles from './client-registry-search.scss';
import {
  requestCustomOtp,
  validateCustomOtp,
  fetchClientRegistryData,
  fetchPatientAttributes,
  fetchPatientIdentifiers,
} from './client-registry.resource';
import NewClientTab from './new-client/new-client-tab.component';
import ExistingClientTab from './existing-client/existing-client-tab.component';
import {
  type IdentifierType,
  type HieClient,
  IDENTIFIER_TYPES,
  PersonAttributeTypeUuids,
  HieIdentificationType,
  IdentifierTypesUuids,
} from './types';

export interface ClientRegistryLookupSectionProps {
  onClientVerified?: () => void;
  onModalClose: () => void;
  open: boolean;
  isNewClient: boolean;
}

const ClientRegistryLookupSection: React.FC<ClientRegistryLookupSectionProps> = ({
  onClientVerified,
  open,
  onModalClose,
  isNewClient = true,
}) => {
  const { setFieldValue } = useFormikContext<any>();
  const [identifierType, setIdentifierType] = useState<IdentifierType>('National ID');
  const [identifierValue, setIdentifierValue] = useState<string>('');
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState<boolean>(false);
  const [loading, setLoading] = useState(false);
  const [isSendingOtp, setIsSendingOtp] = useState(false);
  const [sessionId, setSessionId] = useState('');
  const [error, setError] = useState<string>('');
  const { sessionLocation } = useSession();
  const [client, setClient] = useState<HieClient>();
  const locationUuid = sessionLocation?.uuid ?? '';
  const [patientAttributes, setPatientAttributes] = useState<PersonAttribute[]>([]);
  const [patientIdentifiers, setPatientIdentifiers] = useState<PatientIdentifier[]>([]);
  const { patient } = usePatient();

  useEffect(() => {
    if (patient) {
      getPatientAttributes(patient.id);
      getPatientIdentifiers(patient.id);
    }
  }, [patient]);

  const phoneNumber = useMemo(
    () => getPatientAttribute(patientAttributes, PersonAttributeTypeUuids.CONTACT_PHONE_NUMBER_UUID),
    [patientAttributes],
  );

  async function withTimeout<T>(promise: Promise<T>, ms = 10000): Promise<T> {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), ms);
    try {
      const response = await promise;
      return response;
    } catch (err: any) {
      if (err.name === 'AbortError') throw new Error('Request timeout');
      throw err;
    } finally {
      clearTimeout(timeout);
    }
  }

  const handleFetchCR = async () => {
    setLoading(true);
    setError('');

    try {
      const payload = {
        identificationNumber: identifierValue,
        identificationType: identifierType,
        locationUuid,
      };

      const result = await withTimeout(fetchClientRegistryData(payload));
      const patients = Array.isArray(result) ? result : [];

      if (patients.length === 0) throw new Error('No matching patient found in Client Registry.');

      const patient = patients[0];
      setClient(patient);
      showSnackbar({
        kind: 'success',
        title: 'Client Data Loaded',
        subtitle: `Patient ${patient.first_name} ${patient.last_name} fetched successfully.`,
      });
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to fetch client data';
      setError(errorMessage);
      showSnackbar({
        kind: 'error',
        title: 'Fetch Failed',
        subtitle: errorMessage,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSendOtp = async () => {
    if (!identifierValue.trim()) {
      setError('Please enter a valid ID value');
      return;
    }
    if (!phoneNumber) {
      setError('No phone number set. Please add the phone number patient attribute');
      return;
    }

    setIsSendingOtp(true);
    setError('');

    try {
      const payload = {
        identificationNumber: identifierValue,
        identificationType: identifierType,
        phoneNumber: phoneNumber ? (phoneNumber.value ?? '') : '',
        locationUuid: locationUuid ?? '',
      };

      const response = await withTimeout(requestCustomOtp(payload));
      setSessionId(response.sessionId);
      setOtpSent(true);

      showSnackbar({
        kind: 'success',
        title: 'OTP sent successfully',
        subtitle: `A code was sent to ${response.maskedPhone}`,
      });
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to send OTP';
      setError(errorMessage);
      showSnackbar({
        kind: 'error',
        title: 'Error sending OTP',
        subtitle: errorMessage,
      });
    } finally {
      setIsSendingOtp(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (!otp.trim()) {
      setError('Please enter the OTP code');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const payload = { sessionId, otp, locationUuid };
      await withTimeout(validateCustomOtp(payload));

      setOtpVerified(true);
      onClientVerified?.();

      showSnackbar({
        kind: 'success',
        title: 'OTP Verified',
        subtitle: 'You can now fetch data from Client Registry.',
      });
    } catch (err: any) {
      const errorMessage = err.message || 'OTP verification failed';
      setError(errorMessage);
      showSnackbar({
        kind: 'error',
        title: 'OTP Verification Failed',
        subtitle: errorMessage,
      });
    } finally {
      setLoading(false);
    }
  };
  const registerOnAfyaYangu = () => {
    window.open('https://afyayangu.go.ke/', '_blank');
  };
  async function getPatientAttributes(patientUuid: string) {
    const data = await fetchPatientAttributes(patientUuid);
    if (data) {
      setPatientAttributes(data);
    }
  }
  function getPatientAttribute(patientAttributes: PersonAttribute[], attributeTypeUuid: string) {
    if (!patientAttributes || !attributeTypeUuid) {
      return null;
    }
    return patientAttributes.find((a) => {
      return a.attributeType?.uuid === attributeTypeUuid;
    });
  }
  async function getPatientIdentifiers(patientUuid: string) {
    const data = await fetchPatientIdentifiers(patientUuid);
    if (data) {
      setPatientIdentifiers(data);
    }
  }
  function handleIdentifierChange(value: { selectedItem: IdentifierType }) {
    const selectedValue = value.selectedItem;
    setIdentifierType(selectedValue);
    const identifier = getPatientIdentifier(selectedValue);
    setIdentifierValue(identifier?.identifier ?? '');
  }
  function getPatientIdentifier(selectedIdentifierType: IdentifierType) {
    let identifier: PatientIdentifier | undefined;
    switch (selectedIdentifierType) {
      case HieIdentificationType.NationalID:
        identifier = getIdentifier(patientIdentifiers, IdentifierTypesUuids.NATIONAL_ID_UUID);
        break;
      case HieIdentificationType.MandateNumber:
        identifier = getIdentifier(patientIdentifiers, IdentifierTypesUuids.MANDATE_NUMBER_UUID);
        break;
      case HieIdentificationType.AlienID:
        identifier = getIdentifier(patientIdentifiers, IdentifierTypesUuids.ALIEN_ID_UUID);
        break;
      case HieIdentificationType.RefugeeID:
        identifier = getIdentifier(patientIdentifiers, IdentifierTypesUuids.REFUGEE_ID_UUID);
        break;
      default:
        identifier = getIdentifier(patientIdentifiers, IdentifierTypesUuids.NATIONAL_ID_UUID);
    }
    return identifier;
  }
  function getIdentifier(patientIdentifiers: PatientIdentifier[], identifierTypeUuid: string) {
    return patientIdentifiers.find((i) => {
      return i.identifierType?.uuid === identifierTypeUuid;
    });
  }

  return (
    <Modal
      open={open}
      size="md"
      onSecondarySubmit={onModalClose}
      onRequestClose={onModalClose}
      onRequestSubmit={isNewClient ? registerOnAfyaYangu : null}
      primaryButtonText={isNewClient ? 'Register on Afya Yangu' : null}
      secondaryButtonText="Cancel">
      <ModalBody>
        <div className={styles.modalVerificationLayout}>
          <h4 className={styles.sectionTitle}>Client Registry Verification</h4>

          {error && (
            <div className={styles.notificationSpacing}>
              <InlineNotification title="Error" subtitle={error} kind="error" lowContrast />
            </div>
          )}
          {!client ? (
            <div className={styles.formSection}>
              {!otpSent ? (
                <>
                  <div className={styles.formRow}>
                    <div className={styles.formControl}>
                      <Dropdown
                        id="identifier-type-dropdown"
                        label="Identifier Type"
                        titleText="Select Identifier Type"
                        items={IDENTIFIER_TYPES}
                        onChange={handleIdentifierChange}
                        disabled={otpSent}
                      />
                    </div>
                    <div className={styles.formControl}>
                      <TextInput
                        id="identifier-value"
                        labelText={`${identifierType} Value`}
                        value={identifierValue}
                        readonly={true}
                      />
                    </div>
                  </div>
                  <div className={styles.formRow}>
                    <div className={styles.formControl}>
                      <Button kind="primary" onClick={handleSendOtp} disabled={loading}>
                        {loading ? <InlineLoading description="Sending..." /> : 'Send OTP'}
                      </Button>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  {!otpVerified ? (
                    <>
                      <div className={styles.formRow}>
                        <div className={styles.formControl}>
                          <TextInput
                            id="otp-input"
                            labelText="Enter OTP"
                            value={otp}
                            onChange={(e) => setOtp(e.target.value)}
                            disabled={otpVerified}
                            placeholder="Enter the code sent to your phone"
                          />
                        </div>
                      </div>
                      <div className={styles.formRow}>
                        <div className={styles.actionBtn}>
                          <Button kind="primary" onClick={handleVerifyOtp} disabled={loading}>
                            {loading ? <InlineLoading description="Verifying..." /> : 'Verify OTP'}
                          </Button>
                        </div>
                        <div className={styles.actionBtn}>
                          <Button kind="secondary" onClick={handleSendOtp} disabled={isSendingOtp}>
                            {isSendingOtp ? <InlineLoading description="Resending OTP..." /> : 'Resend OTP'}
                          </Button>
                        </div>
                        <div className={styles.actionBtn}>
                          <Button kind="tertiary" onClick={() => setOtpSent(false)}>
                            Back
                          </Button>
                        </div>
                        <div className={styles.actionBtn}>
                          <Button kind="primary" onClick={() => setOtpVerified(true)}>
                            Skip OTP
                          </Button>
                        </div>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className={styles.formRow}>
                        <div className={styles.formControl}>
                          <Button kind="primary" onClick={handleFetchCR} disabled={loading}>
                            {loading ? <InlineLoading description="Fetching..." /> : 'Fetch Client Registry Data'}
                          </Button>
                        </div>
                      </div>
                    </>
                  )}
                </>
              )}
            </div>
          ) : (
            <></>
          )}

          {otpVerified && client ? (
            <div className="clientDataSection">
              {isNewClient ? <NewClientTab client={client} /> : <ExistingClientTab hieClient={client} />}
            </div>
          ) : (
            <></>
          )}
        </div>
      </ModalBody>
    </Modal>
  );
};

export default ClientRegistryLookupSection;
