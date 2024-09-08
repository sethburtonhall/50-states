import { supabase } from "$server";

export async function load() {
    let loading = true;
    let error = null;
    let states = [];

    try {
        const { data, error: fetchError } = await supabase.from("us_states").select();
        loading = false;

        if (fetchError) {
            console.error("Error fetching data:", fetchError);
            error = fetchError.message;
        } else {
            states = data ?? [];
        }
    } catch (err) {
        console.error("Unexpected error:", err);
        loading = false;
        error = (err as Error).message;
    }

    return {
        states,
        loading,
        error,
    };
}