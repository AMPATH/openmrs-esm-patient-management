import React, { useState } from 'react';
import { Button, TextInput, InlineLoading } from '@carbon/react';
import { showSnackbar } from '@openmrs/esm-framework';
import { useFormikContext } from 'formik';
import styles from '../patient-registration.scss';
import { sendOtp, verifyOtp, fetchClientRegistryData } from './client-registry.resource';

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

  // const handleSendOtp = async () => {
  //   if (!identifier) {
  //     showSnackbar({ kind: 'error', title: 'Missing Identifier', subtitle: 'Enter a valid National/Alien ID.' });
  //     return;
  //   }
  //   setLoading(true);
  //   try {
  //     const res = await sendOtp(identifier);
  //     if (!res.ok) throw new Error(res?.data?.error || 'Failed to send OTP');
  //     setOtpSent(true);
  //     showSnackbar({ kind: 'success', title: 'OTP sent', subtitle: 'Check your phone for the verification code.' });
  //   } catch (err) {
  //     showSnackbar({ kind: 'error', title: 'Error sending OTP', subtitle: (err as Error).message });
  //   } finally {
  //     setLoading(false);
  //   }
  // };

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
      // Simulate API delay with setTimeout
      await new Promise((resolve, reject) => {
        setTimeout(() => {
          // Mock success or failure randomly
          const success = Math.random() > 0.2; // 80% success rate
          if (success) {
            resolve({ ok: true });
          } else {
            reject(new Error('Failed to send OTP (mock error)'));
          }
        }, 2000); // 2-second mock delay
      });

      setOtpSent(true);
      showSnackbar({
        kind: 'success',
        title: 'OTP sent',
        subtitle: 'Check your phone for the verification code.',
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

  // const handleVerifyOtp = async () => {
  //   if (!otp) {
  //     showSnackbar({ kind: 'error', title: 'Missing OTP', subtitle: 'Please enter the code sent to your phone.' });
  //     return;
  //   }
  //   setLoading(true);
  //   try {
  //     const res = await verifyOtp(identifier, otp);
  //     if (!res.ok) throw new Error(res?.data?.error || 'Invalid OTP');
  //     setOtpVerified(true);
  //     onClientVerified?.();
  //     showSnackbar({
  //       kind: 'success',
  //       title: 'OTP Verified',
  //       subtitle: 'You can now fetch data from Client Registry.',
  //     });
  //   } catch (err) {
  //     showSnackbar({ kind: 'error', title: 'OTP Verification Failed', subtitle: (err as Error).message });
  //   } finally {
  //     setLoading(false);
  //   }
  // };

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
      // Simulate API delay
      await new Promise((resolve, reject) => {
        setTimeout(() => {
          const success = Math.random() > 0.2; // 80% success rate
          if (success) {
            resolve({ ok: true });
          } else {
            reject(new Error('Invalid OTP (mock error)'));
          }
        }, 2000);
      });

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
      const data = await new Promise((resolve, reject) => {
        setTimeout(() => {
          const success = Math.random() > 0.1; // 90% success rate
          if (success) {
            // Mocked patient data
            resolve({
              ok: true,
              data: {
                person: {
                  givenName: 'John',
                  familyName: 'Doe',
                  gender: 'M',
                  birthdate: '1990-01-15',
                },
              },
            });
          } else {
            reject(new Error('Unable to fetch client data (mock error)'));
          }
        }, 2500);
      });

      // Populate the form fields
      setFieldValue('givenName', (data as any)?.data?.person?.givenName ?? '');
      setFieldValue('familyName', (data as any)?.data?.person?.familyName ?? '');
      setFieldValue('gender', (data as any)?.data?.person?.gender ?? '');
      setFieldValue('birthdate', (data as any)?.data?.person?.birthdate ?? '');

      showSnackbar({
        kind: 'success',
        title: 'Client Data Loaded',
        subtitle: 'Patient form updated successfully.',
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

  // const handleFetchCR = async () => {
  //   setLoading(true);
  //   try {
  //     const res = await fetchClientRegistryData(identifier);
  //     if (!res.ok) throw new Error(res?.data?.error || 'Unable to fetch client data');
  //     const data = res.data;
  //     setFieldValue('givenName', data?.person?.givenName ?? '');
  //     setFieldValue('familyName', data?.person?.familyName ?? '');
  //     setFieldValue('gender', data?.person?.gender ?? '');
  //     setFieldValue('birthdate', data?.person?.birthdate ?? '');
  //     // Add other mappings (addresses, phone, identifiers) etc

  //     showSnackbar({ kind: 'success', title: 'Client Data Loaded', subtitle: 'Patient form updated successfully.' });
  //   } catch (err) {
  //     showSnackbar({ kind: 'error', title: 'Fetch Failed', subtitle: (err as Error).message });
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  return (
    <div className={styles.section}>
      <h4 className={styles.sectionTitle}>Client Registry</h4>

      <div className={styles.fieldGroup}>
        <TextInput
          id="client-registry-id"
          labelText="National ID / Alien ID"
          value={identifier}
          onChange={(e) => setIdentifier(e.target.value)}
          disabled={otpSent}
        />
      </div>

      <div style={{ marginTop: '0.75rem' }}>
        {!otpSent ? (
          <Button size="sm" kind="secondary" onClick={handleSendOtp} disabled={loading}>
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
                <Button size="sm" kind="primary" onClick={handleFetchCR} disabled={loading}>
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
