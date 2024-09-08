<script lang="ts">
	// @ts-nocheck
	import { onMount, createEventDispatcher } from 'svelte';
	import * as am5 from '@amcharts/amcharts5?client';
	import * as am5map from '@amcharts/amcharts5/map?client';
	import am5geodata_usaHigh from '@amcharts/amcharts5-geodata/usaHigh?client';
	import {
		visitedStates,
		selectedStates,
		loadVisitedStates,
		loadSelectedStates
	} from '$lib/stores';

	const dispatch = createEventDispatcher();
	export let data;

	onMount(() => {
		loadVisitedStates();
		loadSelectedStates();
		const root = am5.Root.new('mapdiv');
		const chart = root.container.children.push(
			am5map.MapChart.new(root, {
				projection: am5map.geoMercator(),
				minZoomLevel: 1,
				maxZoomLevel: 1
			})
		);

		// Modify the GeoJSON data
		const modifiedGeoJSON = JSON.parse(JSON.stringify(am5geodata_usaHigh));

		modifiedGeoJSON.features.forEach((feature) => {
			if (feature.properties.name === 'Alaska') {
				feature.geometry.coordinates = feature.geometry.coordinates.map((polygon) =>
					polygon.map((coordinate) => [
						coordinate[0] * 0.2 + 50, // Scale and adjust longitude
						coordinate[1] * 0.2 - 30 // Scale and adjust latitude
					])
				);
			} else if (feature.properties.name === 'Hawaii') {
				feature.geometry.coordinates = feature.geometry.coordinates.map((polygon) =>
					polygon.map((coordinate) => [
						coordinate[0] * 1.5 - 10, // Scale and adjust longitude
						coordinate[1] * 1.5 - 130 // Scale and adjust latitude
					])
				);
			}
		});

		const polygonSeries = chart.series.push(
			am5map.MapPolygonSeries.new(root, {
				geoJSON: modifiedGeoJSON
			})
		);

		polygonSeries.mapPolygons.template.setAll({
			tooltipText: '{name}',
			interactive: true
		});

		polygonSeries.mapPolygons.template.states.create('hover', {
			fill: am5.color(0x64748b)
		});

		polygonSeries.mapPolygons.template.states.create('active', {
			fill: am5.color(0x475569)
		});

		polygonSeries.mapPolygons.template.events.on('click', (event) => {
			const target = event.target;
			const isActive = target.get('active');
			target.set('active', !isActive);
			const stateName = target.dataItem.dataContext.name;
			const state = data.states.find((s) => s.name === stateName);
			if (state) {
				dispatch('stateClick', { state });
			}
		});

		polygonSeries.events.on('datavalidated', () => {
			// console.log('polygonSeries:', polygonSeries);
			// console.log('Modified GeoJSON:', modifiedGeoJSON);

			const updateActiveStates = () => {
				polygonSeries.mapPolygons.values.forEach((polygon) => {
					const stateName = polygon.dataItem.dataContext.name;
					const isSelected = $selectedStates.some((s) => s.name === stateName);
					polygon.set('active', isSelected);
				});
			};

			// Listen for custom event to update active states
			window.addEventListener('updateActiveStates', (event) => {
				updateActiveStates();
			});

			modifiedGeoJSON.features.forEach((feature) => {
				const stateName = feature.properties.name;
				const visitedState = $visitedStates.find((s) => s.name === stateName);
				if (visitedState) {
					console.log('Visited states in Map:', visitedStates);
					const polygon = polygonSeries.mapPolygons.values.find(
						(p) => p.dataItem.dataContext.name === stateName
					);
					if (polygon) {
						console.log('Found polygon for state:', stateName, polygon);
						polygon.set('active', true);
					} else {
						console.warn('Polygon not found for state:', stateName);
					}
				}
			});
		});

		console.log('Map initialized and event listener added.');
		chart.appear(1000, 100);
	});
</script>

<div id="mapdiv" style="height: 450px;" class="mb-12"></div>
