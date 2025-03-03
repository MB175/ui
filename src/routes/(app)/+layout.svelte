<script lang="ts">
  import { afterNavigate, goto } from '$app/navigation';
  import { page, updated } from '$app/stores';

  import DataEncoderSettings from '$lib/components/data-encoder-settings.svelte';
  import SideNavigation from '$lib/components/side-nav.svelte';
  import SkipNavigation from '$lib/components/skip-nav.svelte';
  import TopNavigation from '$lib/components/top-nav.svelte';
  import { ErrorBoundary } from '$lib/holocene/error-boundary';
  import MainContentContainer from '$lib/holocene/main-content-container.svelte';
  import Toaster from '$lib/holocene/toaster.svelte';
  import { translate } from '$lib/i18n/translate';
  import { clearAuthUser } from '$lib/stores/auth-user';
  import { lastUsedNamespace, namespaces } from '$lib/stores/namespaces';
  import { toaster } from '$lib/stores/toaster';
  import type { NamespaceListItem } from '$lib/types/global';
  import {
    routeForArchivalWorkfows,
    routeForBatchOperations,
    routeForEventHistoryImport,
    routeForLoginPage,
    routeForNamespaces,
    routeForSchedules,
    routeForWorkflows,
  } from '$lib/utilities/route-for';

  import type { DescribeNamespaceResponse as Namespace } from '$types';

  let namespaceList: NamespaceListItem[];

  $: isCloud = $page.data?.settings?.runtimeEnvironment?.isCloud;
  $: activeNamespaceName = $page.params?.namespace ?? $lastUsedNamespace;
  $: activeNamespace = $namespaces.find(
    (namespace: Namespace) =>
      namespace?.namespaceInfo?.name === activeNamespaceName,
  );
  $: namespaceNames = isCloud
    ? [$page.params.namespace]
    : $namespaces.map((namespace: Namespace) => namespace?.namespaceInfo?.name);
  $: namespaceList = namespaceNames.map((namespace: string) => {
    const getHref = (namespace: string) =>
      isCloud ? routeForWorkflows({ namespace }) : getCurrentHref(namespace);
    return {
      namespace,
      onClick: (namespace: string) => {
        $lastUsedNamespace = namespace;
        goto(getHref(namespace));
      },
    };
  });

  $: linkList = {
    home: routeForWorkflows({ namespace: activeNamespaceName }),
    archive: routeForArchivalWorkfows({ namespace: activeNamespaceName }),
    namespaces: routeForNamespaces(),
    schedules: routeForSchedules({ namespace: activeNamespaceName }),
    workflows: routeForWorkflows({ namespace: activeNamespaceName }),
    batchOperations: routeForBatchOperations({
      namespace: activeNamespaceName,
    }),
    import: routeForEventHistoryImport(),
    feedback:
      $page.data?.settings?.feedbackURL ||
      'https://github.com/temporalio/ui/issues/new/choose',
  };

  function getCurrentHref(namespace: string) {
    const namespacePages = [
      {
        subPath: 'schedules',
        fullRoute: routeForSchedules({ namespace }),
      },
      {
        subPath: 'batch-operations',
        fullRoute: routeForBatchOperations({ namespace }),
      },
    ];

    for (const { subPath, fullRoute } of namespacePages) {
      if ($page.url.pathname.endsWith(subPath)) {
        return fullRoute;
      }
    }

    return routeForWorkflows({ namespace });
  }

  const logout = () => {
    clearAuthUser();
    goto(routeForLoginPage());
  };

  updated.subscribe(async (value) => {
    if (value) {
      // Hard refresh when version does not match
      window.location.reload();
    }
  });

  afterNavigate(() => {
    document.getElementById('content')?.scrollTo(0, 0);
  });
</script>

<SkipNavigation />
<div class="flex w-screen flex-row">
  <Toaster
    closeButtonLabel={translate('common.close')}
    pop={toaster.pop}
    toasts={toaster.toasts}
  />
  <div class="sticky top-0 z-30 h-screen w-auto">
    <SideNavigation {activeNamespace} {linkList} {isCloud} />
  </div>
  <MainContentContainer>
    <DataEncoderSettings />
    <TopNavigation {logout} {namespaceList} />
    <div
      slot="main"
      class="flex h-[calc(100%-2.5rem)] w-full flex-col gap-4 p-8"
    >
      <ErrorBoundary onError={() => {}}>
        <slot />
      </ErrorBoundary>
    </div>
  </MainContentContainer>
</div>
