import { openmrsFetch, restBaseUrl } from '@openmrs/esm-framework';
import {
  type CreatePatientDto,
  type AmrsPerson,
  type ClientRegistrySearchRequest,
  type ClientRegistrySearchResponse,
  type RequestCustomOtpDto,
  type RequestCustomOtpResponse,
  type ValidateCustomOtpResponse,
  type ValidateHieCustomOtpDto,
  type CreateRelationshipDto,
  type CreatePersonDto,
} from '../client-registry/types';
import { mapAmrsPatientRelationship } from './map-client-registry-to-form-utils';
import { getHieBaseUrl } from '../../utils/get-base-url';

async function postJson<T>(url: string, payload: unknown): Promise<T> {
  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Request failed with ${response.status}: ${errorText}`);
  }

  return response.json() as Promise<T>;
}

export async function requestCustomOtp(payload: RequestCustomOtpDto): Promise<RequestCustomOtpResponse> {
  const hieBaseUrl = await getHieBaseUrl();
  const url = `${hieBaseUrl}/client/send-custom-otp`;
  const formattedPayload = {
    identificationNumber: payload.identificationNumber,
    identificationType: payload.identificationType,
    locationUuid: payload.locationUuid,
  };
  return postJson<RequestCustomOtpResponse>(url, formattedPayload);
}

export async function validateCustomOtp(payload: ValidateHieCustomOtpDto): Promise<ValidateCustomOtpResponse> {
  const hieBaseUrl = await getHieBaseUrl();
  const url = `${hieBaseUrl}/client/validate-custom-otp`;
  const formattedPayload = {
    sessionId: payload.sessionId,
    otp: payload.otp,
    locationUuid: payload.locationUuid,
  };
  return postJson<ValidateCustomOtpResponse>(url, formattedPayload);
}

export async function fetchClientRegistryData(
  payload: ClientRegistrySearchRequest,
): Promise<ClientRegistrySearchResponse> {
  const hieBaseUrl = await getHieBaseUrl();
  const url = `${hieBaseUrl}/client/search`;
  const formattedPayload = {
    identificationNumber: payload.identificationNumber,
    identificationType: payload.identificationType,
    locationUuid: payload.locationUuid,
  };
  return postJson<ClientRegistrySearchResponse>(url, formattedPayload);
}

export async function fetchAmrsPatientData(patientUuid: string) {
  return await openmrsFetch<AmrsPerson>(`${restBaseUrl}/patient/${patientUuid}?v=full`, {
    method: 'GET',
  }).catch((err) => {
    console.error(err);
  });
}

export async function updateAmrsPersonIdentifiers(
  patientUuid: string,
  identifierUuid: string,
  payload: unknown,
  fromDependant = false,
) {
  const resource = fromDependant ? 'person' : 'patient';
  return await openmrsFetch(`${restBaseUrl}/${resource}/${patientUuid}/identifier/${identifierUuid}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: payload,
  });
}

export async function fetchAmrsPersonData(personUuid: string) {
  return await openmrsFetch(`${restBaseUrl}/person/${personUuid}?v=full`, {
    method: 'GET',
  }).catch((err) => {
    console.error(err);
  });
}

export async function updatePerson(patientUuid: string, payload: unknown) {
  return await openmrsFetch<AmrsPerson>(`${restBaseUrl}/person/${patientUuid}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: payload,
  });
}

export async function createPerson(payload: CreatePersonDto) {
  return await openmrsFetch<AmrsPerson>(`${restBaseUrl}/person`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: payload,
  });
}

export async function createRelationship(payload: CreateRelationshipDto) {
  return await openmrsFetch(`${restBaseUrl}/relationship`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: payload,
  });
}

export async function getRelationships(patientUuid: string) {
  const response = await openmrsFetch(`${restBaseUrl}/relationship?person=${patientUuid}&v=full`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });
  if (response && response.data) {
    return mapAmrsPatientRelationship(patientUuid, response.data.results);
  }
  return [];
}

export async function createPatient(payload: CreatePatientDto) {
  return await openmrsFetch(`${restBaseUrl}/patient`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: payload,
  });
}
