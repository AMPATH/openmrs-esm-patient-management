import { defineConfigSchema, getAsyncLifecycle, getSyncLifecycle } from '@openmrs/esm-framework';
import { configSchema } from './config-schema';
import homeNavMenuComponent from './side-menu/side-menu.component';
import rootComponent from './root.component';

const moduleName = '@openmrs/esm-home-app';
const pageName = 'home';

const options = {
  featureName: pageName,
  moduleName,
};

export const importTranslation = require.context('../translations', true, /.json$/, 'lazy');

export const root = getSyncLifecycle(rootComponent, options);

export const homeNavMenu = getSyncLifecycle(homeNavMenuComponent, options);

export const facilityRegistryLink = getAsyncLifecycle(
  () => import('./widgets/facility-registry/facility-registry-link.extension'),
  {
    featureName: 'facility-registry-link',
    moduleName,
  },
);

export function startupApp() {
  defineConfigSchema(moduleName, configSchema);
}
