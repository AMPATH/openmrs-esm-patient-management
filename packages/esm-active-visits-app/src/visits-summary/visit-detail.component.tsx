import React, { useState, useMemo } from 'react';
import Button from 'carbon-components-react/es/components/Button';
import { useTranslation } from 'react-i18next';
import { Encounter, useVisit } from './visit.resource';
import dayjs from 'dayjs';
import styles from './visit-detail-overview.scss';
import EncounterList from './visits-components/encounter-list.component';
import VisitSummary from './visits-components/visit-summary.component';
import DataTableSkeleton from 'carbon-components-react/es/components/DataTableSkeleton';

interface VisitDetailComponentProps {
  visitUuid: string;
  patientUuid: string;
}

const VisitDetailComponent: React.FC<VisitDetailComponentProps> = ({ visitUuid, patientUuid }) => {
  const { t } = useTranslation();
  const [listView, setView] = useState(true);

  const { data: visit, isError, isLoading, isValidating } = useVisit(visitUuid);

  const encounters = useMemo(
    () =>
      visit
        ? visit?.encounters?.map((encounter: Encounter) => ({
            id: encounter.uuid,
            time: dayjs(encounter.encounterDateTime).format('hh:mm'),
            encounterType: encounter.encounterType.display,
            provider: encounter.encounterProviders.length > 0 ? encounter.encounterProviders[0].display : '',
            obs: encounter.obs,
          }))
        : [],
    [visit],
  );

  if (isLoading) {
    return <DataTableSkeleton role="progressbar" />;
  }
  if (visit) {
    return (
      <div className={styles.visitsDetailWidgetContainer}>
        <div className={styles.visitsDetailHeaderContainer}>
          <h4 className={styles.productiveHeading02}>
            {visit?.visitType?.display}
            <br />
            <p className={`${styles.bodyLong01} ${styles.text02}`}>{formatDateTime(visit?.startDatetime)}</p>
          </h4>
          <div className={styles.toggleButtons}>
            <Button
              className={`${styles.toggle} ${listView ? styles.toggleActive : ''}`}
              size="small"
              kind="ghost"
              onClick={() => setView(true)}>
              {t('allEncounters', 'All Encounters')}
            </Button>
            <Button
              className={`${styles.toggle} ${!listView ? styles.toggleActive : ''}`}
              size="small"
              kind="ghost"
              onClick={() => setView(false)}>
              {t('visitSummary', 'Visit Summary')}
            </Button>
          </div>
        </div>
        {listView && visit?.encounters && <EncounterList visitUuid={visit.uuid} encounters={encounters} />}
        {!listView && <VisitSummary encounters={visit.encounters} patientUuid={patientUuid} />}
      </div>
    );
  }
};

function formatDateTime(date) {
  return date ? dayjs(date).format('MMM DD, YYYY - hh:mm') : null;
}

export default VisitDetailComponent;