export type FacilitySearchFilter = {
  filterType: string;
  filterValue: string;
  locationUuid: string;
};

export type HieFacility = {
  id: string;
  facility_name: string;
  registration_number: string;
  facility_code: string;
  regulator: string;
  facility_level: string;
  facility_category: string;
  facility_owner: string;
  facility_type: string;
  county: string;
  sub_county: string;
  ward: string;
  found: number;
  approved: number;
  operational_status: string;
  current_license_expiry_date: string;
};

export type HieFacilitySearchResponse = {
  message: HieFacility;
};
