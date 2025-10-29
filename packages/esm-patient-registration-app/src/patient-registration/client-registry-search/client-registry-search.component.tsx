import React, { useState } from 'react';
import { Button, TextInput, InlineLoading } from '@carbon/react';
import { showSnackbar } from '@openmrs/esm-framework';
import { useFormikContext } from 'formik';
import styles from '../patient-registration.scss';
import { requestCustomOtp, validateCustomOtp, fetchClientRegistryData } from './client-registry.resource';
import { applyClientRegistryMapping } from './map-client-registry-to-form-utils';

export interface ClientRegistryLookupSectionProps {
  onClientVerified?: () => void;
}

const ClientRegistryLookupSection: React.FC<ClientRegistryLookupSectionProps> = ({ onClientVerified }) => {
  const { setFieldValue } = useFormikContext<any>();
  const [identifier, setIdentifier] = useState('');
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [loading, setLoading] = useState(false);
  const [sessionId, setSessionId] = useState('');
  const locationUuid = '18c343eb-b353-462a-9139-b16606e6b6c2';

  async function withTimeout<T>(promise: Promise<T>, ms = 10000): Promise<T> {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), ms);
    try {
      const response = await promise;
      return response;
    } finally {
      clearTimeout(timeout);
    }
  }

  const handleSendOtp = async () => {
    if (!identifier) {
      showSnackbar({
        kind: 'error',
        title: 'Missing Identifier',
        subtitle: 'Enter a valid National/Alien ID.',
      });
      return;
    }

    setLoading(true);
    try {
      const payload = {
        identificationNumber: identifier,
        identificationType: 'National ID',
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
    } catch (err) {
      showSnackbar({
        kind: 'error',
        title: 'Error sending OTP',
        subtitle: (err as Error).message,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (!otp) {
      showSnackbar({
        kind: 'error',
        title: 'Missing OTP',
        subtitle: 'Please enter the code sent to your phone.',
      });
      return;
    }

    setLoading(true);
    try {
      const payload = {
        sessionId,
        otp,
        locationUuid,
      };
      await withTimeout(validateCustomOtp(payload));

      setOtpVerified(true);
      onClientVerified?.();
      showSnackbar({
        kind: 'success',
        title: 'OTP Verified',
        subtitle: 'You can now fetch data from Client Registry.',
      });
    } catch (err) {
      showSnackbar({
        kind: 'error',
        title: 'OTP Verification Failed',
        subtitle: (err as Error).message,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleFetchCR = async () => {
    setLoading(true);

    try {
      const payload = {
        identificationNumber: identifier,
        identificationType: 'National ID',
        locationUuid,
      };
      const result = await withTimeout(fetchClientRegistryData(payload));
      const patients = Array.isArray(result) ? result : [];

      if (patients.length === 0) {
        throw new Error('No matching patient found.');
      }

      const patient = patients[0];
      applyClientRegistryMapping(patient, setFieldValue);

      showSnackbar({
        kind: 'success',
        title: 'Client Data Loaded',
        subtitle: `Patient ${patient.first_name} ${patient.last_name} fetched successfully.`,
      });
    } catch (err) {
      showSnackbar({
        kind: 'error',
        title: 'Fetch Failed',
        subtitle: (err as Error).message,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.section}>
      <h4 className={styles.sectionTitle}>Client Registry</h4>

      <div className={styles.fieldGroup}>
        <TextInput
          id="client-registry-id"
          labelText="e.g. National ID, Alien ID"
          value={identifier}
          onChange={(e) => setIdentifier(e.target.value)}
          disabled={otpSent}
        />
      </div>

      <div style={{ marginTop: '0.75rem' }}>
        {!otpSent ? (
          <Button kind="secondary" onClick={handleSendOtp} disabled={loading}>
            {loading ? <InlineLoading description="Sending..." /> : 'Send OTP'}
          </Button>
        ) : (
          <>
            <div style={{ marginTop: '0.75rem' }}>
              <TextInput
                id="otp-input"
                labelText="Enter OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                disabled={otpVerified}
              />
            </div>

            <div style={{ marginTop: '0.5rem' }}>
              {!otpVerified ? (
                <Button size="sm" kind="secondary" onClick={handleVerifyOtp} disabled={loading}>
                  {loading ? <InlineLoading description="Verifying..." /> : 'Verify OTP'}
                </Button>
              ) : (
                <Button kind="primary" onClick={handleFetchCR} disabled={loading}>
                  {loading ? <InlineLoading description="Fetching..." /> : 'Fetch Client Registry Data'}
                </Button>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ClientRegistryLookupSection;
