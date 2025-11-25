import React, { useEffect, useMemo, useState } from 'react';
import {
  TableRow,
  TableCell,
  Checkbox,
  Table,
  TableHead,
  TableHeader,
  TableBody,
  Button,
  Row,
  InlineLoading,
} from '@carbon/react';
import { HieIdentificationType, type AmrsPerson, type ClientRegistryBody } from '../client-registry/types';
import {
  addressFields,
  getIdentifierUuid,
  identifiersSyncFields,
  mapFieldValue,
  nameFields,
  patientObjFields,
  personSyncFields,
} from './map-client-registry-to-form-utils';
import { updatePerson, updateAmrsPersonIdentifiers } from './client-registry.resource';
import { showSnackbar } from '@openmrs/esm-framework';

interface ClientRegistryPatientDetailsProps {
  hieData: ClientRegistryBody;
  amrsPerson: AmrsPerson;
  fromDependant?: boolean;
}

interface GetTableDataRowProps {
  field: string;
  label: string;
  amrsPerson: string;
  hiePatient: string;
  onChange?(e: boolean, field: string, value: string, multiple: boolean): void;
  allChecked: boolean;
}

const TableDataRow: React.FC<GetTableDataRowProps> = ({
  field,
  label,
  amrsPerson,
  hiePatient,
  onChange,
  allChecked,
}) => {
  const [checked, setChecked] = useState(false);
  const randomString = Math.random().toString(36).substring(2, 6).toUpperCase();
  useEffect(() => {
    onChange?.(allChecked, field, hiePatient, true);
    setChecked(allChecked);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [allChecked]);

  return (
    <TableRow>
      <TableCell>{label}</TableCell>
      <TableCell>{amrsPerson}</TableCell>
      <TableCell>{hiePatient}</TableCell>
      <TableCell>
        <Checkbox
          id={`cbox-${randomString}`}
          onChange={(e) => {
            onChange(e.target.checked, field, hiePatient, false);
            setChecked(e.target.checked);
          }}
          checked={checked}
        />
      </TableCell>
    </TableRow>
  );
};

const ClientRegistryPatientDetails: React.FC<ClientRegistryPatientDetailsProps> = ({
  hieData,
  amrsPerson,
  fromDependant,
}) => {
  const [syncFields, setSyncFields] = useState<Array<Record<string, string>>>([]);
  const [allChecked, setAllChecked] = useState(false);
  const [loading, setLoading] = useState(false);
  const locationUuid = '18c343eb-b353-462a-9139-b16606e6b6c2';
  const randomString = Math.random().toString(36).substring(2, 6).toUpperCase();

  const handleFieldChange = (checked: boolean, field: string, value: string, multiple: boolean) => {
    if (multiple) {
      if (checked) {
        setSyncFields((prev) => [...prev, { [field]: value }]);
      } else {
        setSyncFields([]);
      }
    } else {
      if (checked) {
        setSyncFields([...syncFields, { [field]: value }]);
      } else {
        setSyncFields((prev) => prev.filter((p) => !Object.keys(p).includes(field)));
      }
    }
  };

  const handleCheckAll = (e) => {
    setAllChecked(e.target.checked);
  };

  const handleSync = async () => {
    try {
      const payload = {};
      syncFields.forEach((field) => {
        let key = Object.keys(field)[0];
        payload[key] = field[key];
      });

      // Person
      const patientPayload = {};
      const names = {};
      const addresses = {};
      const otherFields = {};
      Object.entries(payload).forEach(([k, v]) => {
        if (personSyncFields.includes(k)) {
          // names
          if (nameFields.includes(k)) {
            names[k] = v;
          }
          // addresses
          else if (addressFields.includes(k)) {
            if (v) {
              addresses[k] = v;
            }
          } else {
            otherFields[k] = v;
          }
        }
      });
      Object.assign(patientPayload, otherFields, { addresses: [addresses] }, { names: [names] });
      await updatePerson(amrsPerson.person.uuid, patientPayload);
      showSnackbar({
        kind: 'success',
        title: 'Patient successfully synced.',
      });

      // Identifiers
      Object.entries(payload).forEach(async ([k, v]) => {
        if (identifiersSyncFields().includes(k)) {
          if (v) {
            const identifierUuid = getIdentifierUuid(HieIdentificationType[k]);
            const identifierPayload = {
              identifier: v,
              location: locationUuid,
              identifierType: identifierUuid,
            };
            try {
              // Check if the identifier exists
              if (amrsPerson?.person?.identifiers?.find((i) => i.identifierType.uuid === identifierUuid)) {
                // update to have the selected identifier
                await updateAmrsPersonIdentifiers(
                  amrsPerson.person.uuid,
                  identifierUuid + '',
                  identifierPayload,
                  fromDependant,
                );
              } else {
                // create to have the blank identifier
                await updateAmrsPersonIdentifiers(amrsPerson.person.uuid, '', identifierPayload, fromDependant);
              }
            } catch (err) {
              showSnackbar({
                kind: 'error',
                title: 'Error syncing patient identifiers.',
              });
            }
          }
        }
      });
      showSnackbar({
        kind: 'success',
        title: 'Patient identifiers successfully synced.',
      });

      setSyncFields([]);
    } catch (err) {
      showSnackbar({
        kind: 'error',
        title: 'Error syncing patient data.',
        subtitle: JSON.stringify(err?.error?.message),
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Row>
        {syncFields.length ? <Button onClick={handleSync}>Sync data</Button> : null}
        {loading ? <InlineLoading description="Syncing patient details..." /> : null}
      </Row>
      <Table>
        <TableHead>
          <TableRow>
            <TableHeader>Field</TableHeader>
            <TableHeader>AMRS Person</TableHeader>
            <TableHeader>HIE Patient</TableHeader>
            <TableHeader>
              <Checkbox id={`cbox-multiple-${randomString}`} onChange={(e) => handleCheckAll(e)} />
            </TableHeader>
          </TableRow>
        </TableHead>
        <TableBody>
          {patientObjFields.map((field) => {
            const fieldValue = mapFieldValue(field, hieData, amrsPerson);
            const amrsField = fieldValue[0];
            const hieField = fieldValue[1];

            return (
              <TableDataRow
                label={field}
                field={field}
                amrsPerson={amrsField}
                hiePatient={hieField}
                onChange={handleFieldChange}
                allChecked={allChecked}
              />
            );
          })}
        </TableBody>
      </Table>
    </>
  );
};

export default ClientRegistryPatientDetails;
