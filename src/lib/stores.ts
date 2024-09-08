import { writable } from 'svelte/store';

export interface State {
    id: number;
    code: string;
    name: string;
    capital: string;
    motto: string;
    population: number;
}

export const visitedStates = writable<State[]>([]);
export const selectedStates = writable<State[]>([]);

const saveToLocalStorage = (key: string, value: any) => {
    localStorage.setItem(key, JSON.stringify(value));
};

const loadFromLocalStorage = (key: string) => {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : null;
};

export const saveVisitedStates = () => {
    visitedStates.subscribe((states) => saveToLocalStorage('visitedStates', states));
};

export const saveSelectedStates = () => {
    selectedStates.subscribe((states) => saveToLocalStorage('selectedStates', states));
};

export const loadVisitedStates = () => {
    const states = loadFromLocalStorage('visitedStates');
    if (states) {
        visitedStates.set(states);
    }
};

export const loadSelectedStates = () => {
    const states = loadFromLocalStorage('selectedStates');
    if (states) {
        selectedStates.set(states);
    }
};