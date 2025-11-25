import React, { useState } from 'react';
import { Button, TextInput, InlineLoading, InlineNotification, Dropdown, Modal, ModalBody } from '@carbon/react';
import { showSnackbar, useSession } from '@openmrs/esm-framework';
import { useFormikContext } from 'formik';
import styles from './client-registry-search.scss';
import { requestCustomOtp, validateCustomOtp, fetchClientRegistryData } from './client-registry.resource';
import NewClientTab from './new-client/new-client-tab.component';
import ExistingClientTab from './existing-client/existing-client-tab.component';
import { type IdentifierType, type HieClient, IDENTIFIER_TYPES } from './types';

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
  const [identifierValue, setIdentifierValue] = useState('');
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState<boolean>(false);
  const [loading, setLoading] = useState(false);
  const [sessionId, setSessionId] = useState('');
  const [error, setError] = useState<string>('');
  const { sessionLocation } = useSession();
  const [client, setClient] = useState<HieClient>();
  const locationUuid = sessionLocation?.uuid;

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

    setLoading(true);
    setError('');

    try {
      const payload = {
        identificationNumber: identifierValue,
        identificationType: identifierType,
        locationUuid,
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
      setLoading(false);
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

  return (
    <Modal
      open={open}
      size="md"
      onSecondarySubmit={onModalClose}
      onRequestClose={onModalClose}
      onRequestSubmit={registerOnAfyaYangu}
      primaryButtonText="Register on Afya Yangu"
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
                        selectedItem={identifierType}
                        onChange={({ selectedItem }) => setIdentifierType(selectedItem as IdentifierType)}
                        disabled={otpSent}
                      />
                    </div>

                    <div className={styles.formControl}>
                      <TextInput
                        id="identifier-value"
                        labelText={`${identifierType} Value`}
                        value={identifierValue}
                        onChange={(e) => setIdentifierValue(e.target.value)}
                        disabled={otpSent}
                        placeholder={`Enter ${identifierType.toLowerCase()} value`}
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
                          <Button kind="secondary" onClick={handleSendOtp} disabled={loading}>
                            {loading ? <InlineLoading description="Resending OTP..." /> : 'Resend OTP'}
                          </Button>
                        </div>
                        <div className={styles.actionBtn}>
                          <Button kind="tertiary" onClick={() => setOtpSent(false)}>
                            Back
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
