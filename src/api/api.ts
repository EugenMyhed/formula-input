const ENDPOINT_URL = 'https://652f91320b8d8ddac0b2b62b.mockapi.io/autocomplete';

// @ts-ignore
export const fetchAllSuggestions = async (): Promise<Suggestion[]> => {
    const response = await fetch(ENDPOINT_URL);
    if (!response.ok) throw new Error('Failed to fetch suggestions');
    return response.json();
};
