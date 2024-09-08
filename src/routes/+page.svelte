<script lang="ts">
	import { onMount } from 'svelte';
	import { get, derived } from 'svelte/store';
	import { cn } from '$lib/utils';
	import { Map } from '$components';
	import { Card, CardContent } from '$components/ui/card';
	import { Checkbox } from '$components/ui/checkbox';
	import { Progress } from '$components/ui/progress';
	import { Button } from '$components/ui/button';
	import { MapPinIcon, FlagIcon, UsersIcon } from 'lucide-svelte';

	import {
		type State,
		visitedStates,
		selectedStates,
		loadVisitedStates,
		loadSelectedStates,
		saveVisitedStates,
		saveSelectedStates
	} from '$lib/stores';

	// data from +page.server.ts
	export let data;

	const formattedPopulation = (population: number) => {
		return population.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
	};

	const sortedVisitedStates = derived(visitedStates, ($visitedStates) =>
		$visitedStates.sort((a, b) => a.name.localeCompare(b.name))
	);

	function handleClick(event: { detail: { state: State } }) {
		const state = event.detail.state;
		toggleSelectedState(state);
	}

	const dispatchUpdateActiveStates = () => {
		const event = new CustomEvent('updateActiveStates', {
			detail: { selectedStates: get(selectedStates) }
		});
		window.dispatchEvent(event);
	};

	const toggleSelectedState = (state: State) => {
		selectedStates.update((states) =>
			states.some((s) => s.id === state.id)
				? states.filter((s) => s.id !== state.id)
				: [...states, state]
		);
		visitedStates.update((states) =>
			states.some((s) => s.id === state.id)
				? states.filter((s) => s.id !== state.id)
				: [...states, state]
		);
		saveVisitedStates();
		saveSelectedStates();
		dispatchUpdateActiveStates();
	};

	onMount(() => {
		loadVisitedStates();
		loadSelectedStates();
		dispatchUpdateActiveStates();
	});

	const totalStates = 50;
	const visitedPercentage = derived(
		visitedStates,
		($visitedStates) => ($visitedStates.length / totalStates) * 100
	);
</script>

<div class="flex flex-col">
	{#if data.loading}
		<p>Loading...</p>
	{:else if data.error}
		<p>Error: {data.error}</p>
	{:else}
		<div
			class={cn(
				'grid grid-cols-1 grid-rows-1 justify-center gap-12 md:grid-cols-8',
				$visitedStates.length && 'mb-12'
			)}
		>
			<div class="md:col-span-2">
				<div class="sticky top-[88px]">
					<div class="flex flex-col gap-4">
						<div class="flex items-center justify-between">
							<h3>U.S. States</h3>
							<button
								class="text-sm text-muted-foreground underline"
								on:click={() => {
									selectedStates.set([]);
									visitedStates.set([]);
									saveVisitedStates();
									saveSelectedStates();
									dispatchUpdateActiveStates();
								}}
							>
								Clear All
							</button>
						</div>
						<p class="mb-4 text-sm italic text-muted-foreground">
							(select the states that you've visited)
						</p>
					</div>
					<div class="grid h-96 flex-1 grid-cols-1 gap-4 overflow-y-auto">
						{#each data.states.sort((a, b) => a.name.localeCompare(b.name)) as state (state)}
							<div class="flex items-center justify-between">
								<div class="flex items-center gap-2">
									<Checkbox
										checked={$selectedStates.some((s) => s.id === state.id)}
										on:click={() => toggleSelectedState(state)}
									/>
									<span class="font-semibold">{state.name}</span>
								</div>
							</div>
						{/each}
					</div>
				</div>
			</div>
			<div class="md:col-span-6">
				<Map {data} on:stateClick={handleClick} />
				<div class="sticky top-[88px]">
					<div class="mb-4 flex flex-col items-center gap-4 md:flex-row">
						<div class="flex w-full items-center justify-between gap-4 md:w-1/3">
							<h2 class="text-2xl font-bold">States Visited</h2>
							<p
								class={cn(
									'hidden text-sm italic text-muted-foreground',
									$visitedStates.length && 'flex'
								)}
							>
								(click cards to remove)
							</p>
						</div>
						<div class="w-ful flex items-center gap-2 md:w-2/3">
							<p class="text-xl text-muted-foreground">{$visitedStates.length}</p>
							<Progress value={$visitedPercentage} />
						</div>
					</div>
					<div class="h-[555px] overflow-y-auto">
						<div class="grid grid-cols-1 gap-4 md:grid-cols-2">
							{#each $sortedVisitedStates as state (state)}
								<button type="button" on:click={() => toggleSelectedState(state)}>
									<Card class="h-full cursor-pointer bg-muted p-1">
										<CardContent class="flex h-full flex-col p-0">
											<!-- State Name -->
											<div
												class="flex items-center justify-between gap-4 rounded-t-md bg-background pr-4"
											>
												<div class="flex h-12 w-12 items-center justify-center p-2">
													<MapPinIcon class="h-7 w-7 text-muted-foreground" />
												</div>
												<h2 class="text-muted-foreground">{state.name}</h2>
											</div>
											<div
												class="flex h-full flex-col gap-4 rounded-b-md border-4 border-background p-4"
											>
												<div class="self-end text-right">
													<div class="text-lg italic text-muted-foreground">"{state.motto}"</div>
												</div>
												<!-- State Capital -->
												<div class="mt-auto flex items-center gap-4">
													<div
														class="flex h-12 w-12 items-center justify-center rounded-md bg-muted p-2"
													>
														<FlagIcon class="h-7 w-7 text-muted-foreground" />
													</div>
													<div>
														<div class="text-lg font-semibold">Capital</div>
														<div class="text-muted-foreground">{state.capital}</div>
													</div>
												</div>
												<!-- State Population -->
												<div class="flex items-center gap-4">
													<div
														class="flex h-12 w-12 items-center justify-center rounded-md bg-muted p-2"
													>
														<UsersIcon class="h-7 w-7 text-muted-foreground" />
													</div>
													<div>
														<div class="text-lg font-semibold">Population</div>
														<div class="text-muted-foreground">
															{formattedPopulation(state.population)}
														</div>
													</div>
												</div>
											</div>
										</CardContent>
									</Card>
								</button>
							{/each}
						</div>
					</div>
				</div>
			</div>
		</div>
	{/if}
</div>
