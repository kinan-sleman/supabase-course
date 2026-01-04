import { useActionState } from "react";
import supabase from "./supabase-client";

type ActionState =
    | { error?: string; success?: boolean }
    | null;

export default function Form({ metrics }: { metrics: any[] }) {
    const handleAddDeal = async (_prevState: ActionState, formData: FormData): Promise<ActionState> => {
        const newDeal = {
            name: formData.get("name"),
            value: Number(formData.get("value")),
        };

        const { error } = await supabase
            .from("sales_deals")
            .insert(newDeal);

        if (error) {
            console.error("Error Adding Deal:", error.message);
            return { error: "Failed to add deal" };
        }

        return { success: true };
    };

    const [state, submitAction, isPending] = useActionState<ActionState, FormData>(
        handleAddDeal,
        null
    );

    return (
        <div className="add-form-container">
            <form
                action={submitAction}
                aria-label="Add new sales deal"
                aria-describedby="form-description"
            >
                <div id="form-description" className="sr-only">
                    Use this form to add new deal. Select the amount.
                </div>

                <select
                    name="name"
                    defaultValue={metrics?.[0]?.name || ""}
                    disabled={isPending}
                    aria-invalid={state?.error ? "true" : "false"}
                >
                    {metrics.map((metric) => (
                        <option key={metric.name} value={metric.name}>
                            {metric.name}
                        </option>
                    ))}
                </select>

                <input
                    type="number"
                    name="value"
                    defaultValue={0}
                    min={0}
                    step={10}
                    disabled={isPending}
                />

                <button disabled={isPending} aria-busy={isPending}>
                    {isPending ? "Adding..." : "Add Deal"}
                </button>
            </form>

            {state?.error && (
                <div role="alert" className="error-message">
                    {state.error}
                </div>
            )}
        </div>
    );
}