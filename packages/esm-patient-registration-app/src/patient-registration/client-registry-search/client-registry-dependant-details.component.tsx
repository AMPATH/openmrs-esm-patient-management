import {
  Column,
  Row,
  Select,
  SelectItem,
  Button,
  ExpandableTile,
  TileAboveTheFoldContent,
  TileBelowTheFoldContent,
  Accordion,
  AccordionItem,
  ButtonSet,
} from '@carbon/react';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  type CustomRelationship,
  HieIdentificationType,
  type AmrsPerson,
  type ClientRegistryDependantBody,
} from '../client-registry/types';
import {
  createPerson,
  createRelationship,
  fetchAmrsPersonData,
  updateAmrsPersonIdentifiers,
} from './client-registry.resource';
import ClientRegistryPatientDetails from './client-registry-patient-details.component';
import {
  addressFields,
  getIdentifierUuid,
  getPatientAttributes,
  getPatientRelationshipPayload,
  identifiersSyncFields,
  mapFieldValue,
  nameFields,
  patientObjFields,
  personSyncFields,
} from './map-client-registry-to-form-utils';
import { showSnackbar } from '@openmrs/esm-framework';

interface ClientRegistryDependantDetailsProps {
  hieDependants: Array<ClientRegistryDependantBody>;
  amrsPerson: AmrsPerson;
  patientRelationships: Array<CustomRelationship>;
}

interface ClientDependantTileProps {
  dependant: ClientRegistryDependantBody;
  patientRelationships: Array<CustomRelationship>;
  amrsPerson: AmrsPerson;
}

const ClientDependantTile: React.FC<ClientDependantTileProps> = ({ dependant, patientRelationships, amrsPerson }) => {
  const { t } = useTranslation();
  const [amrsRelationExists, setAmrsRelationExists] = useState(false);
  const [amrsDependantData, setAmrsDependantData] = useState<AmrsPerson>();
  const [selectedRelationship, setSelectedRelationship] = useState('');
  const locationUuid = '18c343eb-b353-462a-9139-b16606e6b6c2';

  const handleCreateDependant = async (dependantBody: ClientRegistryDependantBody) => {
    try {
      const syncFields = {};
      patientObjFields.forEach((field) => {
        let fieldArr = mapFieldValue(field, dependantBody.result[0], amrsPerson);
        const hieFieldValue = fieldArr[1];
        syncFields[field] = hieFieldValue;
      });

      // Person
      const patientPayload = {};
      const names = {};
      const addresses = {};
      const otherFields = {};
      const attributes = getPatientAttributes(dependantBody.result[0]);
      Object.entries(syncFields).forEach(([k, v]) => {
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
      Object.assign(
        patientPayload,
        otherFields,
        { addresses: [addresses] },
        { names: [names] },
        { attributes: attributes },
      );
      const response = await createPerson(patientPayload);
      if (response && response.data) {
        showSnackbar({
          kind: 'success',
          title: 'Dependant created successfully.',
        });
        const relationshipPayload = getPatientRelationshipPayload(
          amrsPerson,
          dependantBody.relationship,
          response.data.uuid,
        );
        await createRelationship(relationshipPayload);
        showSnackbar({
          kind: 'success',
          title: 'Dependant relationship created successfully.',
        });
      }
    } catch (err) {
      showSnackbar({
        kind: 'error',
        title: 'Error syncing patient data.',
        subtitle: JSON.stringify(err),
      });
    }
  };

  const handleSelectAmrsDependant = async (e: any) => {
    const uuid = e.target.value;
    if (!uuid) {
      setAmrsRelationExists(false);
      setAmrsDependantData(null);
    }
    const response = await fetchAmrsPersonData(uuid);
    if (response && response.data) {
      setAmrsRelationExists(true);
      setAmrsDependantData((prev) => ({ ...prev, person: response.data }));
    } else {
      setAmrsRelationExists(false);
      setAmrsDependantData(null);
      const relationshipUuid = patientRelationships.find((v) => v.relatedPersonUuid === uuid);
      if (relationshipUuid && relationshipUuid.relationshipType) {
        setSelectedRelationship(relationshipUuid.relationshipType);
      }
    }
  };

  const getDependantName = () => {
    const name = dependant.result[0];
    return `${name.first_name} ${name.middle_name} ${name.last_name} (${dependant.relationship})`;
  };

  return (
    <>
      <AccordionItem title={getDependantName()}>
        <Row>
          <Column>
            <Select labelText={t('amrsDependants', 'AMRS dependants')} onChange={handleSelectAmrsDependant}>
              <SelectItem text={t('selectAmrsRelation', 'Select AMRS relation')} value="" />
              {patientRelationships.map((relationship) => (
                <SelectItem
                  text={`${relationship.display} (${relationship.relationshipType})`}
                  value={relationship.relatedPerson.uuid}
                />
              ))}
            </Select>
          </Column>
          {!amrsRelationExists ? (
            <Column>
              <Button onClick={() => handleCreateDependant(dependant)}>
                {t('createDependant', 'Create dependant in AMRS')}
              </Button>
            </Column>
          ) : null}
        </Row>
        <Row>
          <ClientRegistryPatientDetails
            hieData={dependant.result[0]}
            amrsPerson={amrsDependantData}
            fromDependant={true}
          />
        </Row>
      </AccordionItem>
      {/* <ExpandableTile
        tileCollapsedIconText="Expand to view dependant details"
        tileExpandedIconText="Click to collapse dependant details">
        <TileAboveTheFoldContent>{dependant.relationship}</TileAboveTheFoldContent>
        <TileBelowTheFoldContent>
          <Row>
            <Column>
              <Select labelText={t('amrsDependants', 'AMRS dependants')} onChange={handleSelectAmrsDependant}>
                <SelectItem text={t('selectAmrsRelation', 'Select AMRS relation')} value="" />
                {patientRelationships.map((relationship) => (
                  <SelectItem
                    text={`${relationship.display} (${relationship.relationshipType})`}
                    value={relationship.relatedPerson.uuid}
                  />
                ))}
              </Select>
            </Column>
            {!amrsRelationExists ? (
              <Column>
                <Button onClick={() => handleCreateDependant(dependant)}>
                  {t('createDependant', 'Create dependant in AMRS')}
                </Button>
              </Column>
            ) : null}
          </Row>
          <Row>
            {amrsRelationExists ? (
              <ClientRegistryPatientDetails hieData={dependant.result[0]} amrsPerson={amrsDependantData} />
            ) : null}
          </Row>
        </TileBelowTheFoldContent>
      </ExpandableTile> */}
    </>
  );
};

const ClientRegistryDependantDetails: React.FC<ClientRegistryDependantDetailsProps> = ({
  hieDependants,
  amrsPerson,
  patientRelationships,
}) => {
  return (
    <div>
      <Accordion size="lg">
        {hieDependants.map((dependant) => (
          <ClientDependantTile
            dependant={dependant}
            amrsPerson={amrsPerson}
            patientRelationships={patientRelationships}
          />
        ))}
      </Accordion>
    </div>
  );
};

export default ClientRegistryDependantDetails;
