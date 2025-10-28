import { openmrsFetch } from '@openmrs/esm-framework';

const CR_BASE_URL = 'http://0.0.0.0:9000/hie';

export async function sendOtp(identifier: string) {
  const abortController = new AbortController();
  return openmrsFetch(`${CR_BASE_URL}/otp/send`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ identifier }),
    signal: abortController.signal,
  });
}

export async function verifyOtp(identifier: string, otp: string) {
  const abortController = new AbortController();
  return openmrsFetch(`${CR_BASE_URL}/otp/verify`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ identifier, otp }),
    signal: abortController.signal,
  });
}

export async function fetchClientRegistryData(identifier: string) {
  const abortController = new AbortController();
  return openmrsFetch(`${CR_BASE_URL}/client/search`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ identifier }),
    signal: abortController.signal,
  });
}
