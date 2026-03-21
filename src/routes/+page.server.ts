import statesData from '../data/us-states.json';
import type { State } from '../types/state';

export async function load() {
	const loading = false;
	let error = null;
	let states: State[] = [];

	try {
		states = statesData;
	} catch (err) {
		console.error('Error loading data:', err);
		error = (err as Error).message;
	}

	return {
		states,
		loading,
		error
	};
}
