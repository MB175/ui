<script lang="ts">
  import { page } from '$app/stores';

  import Icon from '$lib/holocene/icon/icon.svelte';
  import {
    Menu,
    MenuButton,
    MenuContainer,
    MenuItem,
  } from '$lib/holocene/menu';
  import type { MenuButtonVariant } from '$lib/holocene/menu/menu-button.svelte';
  import { translate } from '$lib/i18n/translate';
  import {
    allEventTypeOptions,
    compactEventTypeOptions,
  } from '$lib/models/event-history/get-event-categorization';
  import { eventCategoryFilter } from '$lib/stores/filters';
  import { temporalVersion } from '$lib/stores/versions';
  import { updateQueryParameters } from '$lib/utilities/update-query-parameters';
  import { isVersionNewer } from '$lib/utilities/version-check';

  export let compact = false;
  export let variant: MenuButtonVariant = 'table-header';

  $: id = $page.params.id;
  $: label = compact
    ? translate('events.event-type')
    : translate('events.workflow-events');

  let parameter = 'category';
  let options = compact ? compactEventTypeOptions : allEventTypeOptions;

  $: {
    if (isVersionNewer('1.21', $temporalVersion)) {
      options = options.filter(({ option }) => option !== 'update');
    }
  }

  $: visibleOption = options.find(
    ({ option }) => option === $page.url?.searchParams?.get(parameter),
  );
  $: $eventCategoryFilter = visibleOption?.option?.toString() ?? undefined;

  const onOptionClick = (value: string) => {
    updateQueryParameters({
      parameter: parameter,
      value,
      url: $page.url,
    });
  };
</script>

<MenuContainer>
  <MenuButton
    active={!!$eventCategoryFilter}
    {variant}
    data-testid="event-category-filter"
    controls="event-category-filter-menu"
    disabled={!!id}
  >
    {label}
    <Icon name="filter" slot="trailing" />
  </MenuButton>
  <Menu class="w-48" id="event-categroy-filter-menu">
    {#each options as { label, option }}
      <MenuItem
        data-testid="event-category-option"
        selected={$eventCategoryFilter === option}
        on:click={() => onOptionClick(option)}
      >
        {translate(label)}
      </MenuItem>
    {/each}
  </Menu>
</MenuContainer>
