<script lang="ts">
  import { page } from '$app/stores';

  import DataEncoderStatus from '$lib/components/data-encoder-status.svelte';
  import TimezoneSelect from '$lib/components/timezone-select.svelte';
  import Combobox from '$lib/holocene/combobox/combobox.svelte';
  import {
    Menu,
    MenuButton,
    MenuContainer,
    MenuItem,
  } from '$lib/holocene/menu';
  import { translate } from '$lib/i18n/translate';
  import { authUser } from '$lib/stores/auth-user';
  import { dataEncoder } from '$lib/stores/data-encoder';
  import { lastUsedNamespace } from '$lib/stores/namespaces';
  import type { NamespaceListItem } from '$lib/types/global';

  export let logout: () => void;
  export let namespaceList: NamespaceListItem[] = [];
  export let userEmaiLink = '';

  let screenWidth: number;

  $: namespace = $page.params.namespace;
  $: pathNameSplit = $page.url.pathname.split('/');
  $: showNamespaceSpecificNav =
    namespace &&
    (pathNameSplit.includes('workflows') ||
      pathNameSplit.includes('schedules') ||
      pathNameSplit.includes('batch-operations') ||
      pathNameSplit.includes('task-queues') ||
      pathNameSplit.includes('import'));

  let showProfilePic = true;

  function fixImage() {
    showProfilePic = false;
  }

  const handleNamespaceSelect = (event: CustomEvent<NamespaceListItem>) => {
    const namespaceListItem = event.detail;
    $lastUsedNamespace = namespaceListItem.namespace;
    namespaceListItem?.onClick(namespaceListItem.namespace);
  };
</script>

<svelte:window bind:innerWidth={screenWidth} />

<nav
  class="sticky top-0 z-40 flex w-full flex-col items-center justify-end border-b-2 bg-gray-100 p-1 px-4 md:flex-row md:px-8"
  data-testid="top-nav"
  class:bg-red-50={$dataEncoder.hasError && showNamespaceSpecificNav}
  aria-label={translate('common.main')}
>
  <div class="flex grow items-center">
    {#if showNamespaceSpecificNav}
      <Combobox
        label={translate('namespaces.namespace-label', { namespace })}
        toggleLabel={translate('common.namespaces')}
        noResultsText={translate('common.no-results')}
        labelHidden
        value={namespace}
        id="namespace-switcher"
        leadingIcon="namespace-switcher"
        options={namespaceList}
        optionValueKey="namespace"
        on:change={handleNamespaceSelect}
        minSize={32}
      />
    {/if}
  </div>
  <div class="flex items-center gap-2">
    <TimezoneSelect position={screenWidth < 768 ? 'left' : 'right'} />
    {#if showNamespaceSpecificNav}
      <DataEncoderStatus />
    {/if}
    {#if $authUser.accessToken}
      <MenuContainer>
        <MenuButton variant="ghost" hasIndicator controls="user-menu">
          <img
            src={$authUser?.picture}
            alt={$authUser?.profile ?? translate('common.user-profile')}
            class="h-[24px] w-[24px] cursor-pointer rounded-md"
            on:error={fixImage}
            class:hidden={!showProfilePic}
          />
          <div
            class="aspect-square h-full w-[24px] rounded-md bg-blue-200 p-0.5"
            class:hidden={showProfilePic}
          >
            {#if $authUser?.name}
              <div class="text-center text-sm text-black">
                {$authUser?.name.trim().charAt(0)}
              </div>
            {/if}
          </div>
        </MenuButton>
        <Menu id="user-menu" position="right">
          <MenuItem href={userEmaiLink} disabled={!userEmaiLink}>
            {$authUser.email}
          </MenuItem>
          <MenuItem on:click={logout}>{translate('common.log-out')}</MenuItem>
        </Menu>
      </MenuContainer>
    {/if}
  </div>
</nav>
