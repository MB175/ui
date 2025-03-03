<script lang="ts">
  import { getContext } from 'svelte';

  import Icon from '$lib/holocene/icon/icon.svelte';
  import Input from '$lib/holocene/input/input.svelte';
  import {
    Menu,
    MenuButton,
    MenuContainer,
    MenuItem,
  } from '$lib/holocene/menu';
  import { translate } from '$lib/i18n/translate';
  import type { WorkflowFilter } from '$lib/models/workflow-filters';
  import { workflowFilters } from '$lib/stores/filters';
  import { sortedSearchAttributeOptions } from '$lib/stores/search-attributes';
  import type { SearchAttributesValue } from '$lib/types/workflows';
  import {
    getFocusedElementId,
    isListFilter,
  } from '$lib/utilities/query/filter-search';
  import { emptyFilter } from '$lib/utilities/query/to-list-workflow-filters';

  import { FILTER_CONTEXT, type FilterContext } from './index.svelte';

  const { filter, activeQueryIndex, focusedElementId } =
    getContext<FilterContext>(FILTER_CONTEXT);

  function isOptionDisabled(value: string, filters: WorkflowFilter[]) {
    return filters.some(
      (filter) =>
        (filter.conditional === '=' || filter.conditional === '!=') &&
        filter.attribute === value,
    );
  }

  function handleNewQuery(value: string, type: SearchAttributesValue) {
    searchAttributeValue = '';
    filter.set({ ...emptyFilter(), attribute: value, conditional: '=', type });
    $focusedElementId = getFocusedElementId({ attribute: value, type });
  }

  let searchAttributeValue = '';
  //  TODO: Add KeywordList support
  $: options = $sortedSearchAttributeOptions.filter(
    ({ value, type }) => !isListFilter({ attribute: value, type }),
  );

  $: filteredOptions = !searchAttributeValue
    ? options
    : options.filter((option) =>
        option.value.toLowerCase().includes(searchAttributeValue.toLowerCase()),
      );
</script>

<MenuContainer>
  <MenuButton
    controls="search-attribute-menu"
    unroundRight={Boolean($filter.attribute)}
    disabled={$activeQueryIndex !== null}
    count={$filter.attribute ? 0 : $workflowFilters.length}
    on:click={() => (searchAttributeValue = '')}
  >
    <svelte:fragment slot="leading">
      {#if !$filter.attribute}
        <Icon name="filter" />
      {/if}
    </svelte:fragment>
    {$filter.attribute || translate('workflows.filter')}
  </MenuButton>
  <Menu id="search-attribute-menu">
    <Input
      label={translate('common.search')}
      labelHidden
      id="filter-search"
      noBorder
      bind:value={searchAttributeValue}
      icon="search"
      placeholder={translate('common.search')}
      class="mb-1"
    />

    {#each filteredOptions as { value, label, type }}
      {@const disabled = isOptionDisabled(value, $workflowFilters)}
      <MenuItem
        on:click={() => {
          handleNewQuery(value, type);
        }}
        {disabled}
      >
        {label}
      </MenuItem>
    {:else}
      <MenuItem class="whitespace-nowrap" disabled
        >{translate('common.no-results')}</MenuItem
      >
    {/each}
  </Menu>
</MenuContainer>
