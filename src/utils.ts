import { FormulaPart } from "./types/types.ts";

export const evaluateFormula = (formulaParts: FormulaPart[], variables: Record<string, number>): number => {
    try {
        const formulaString = formulaParts
            .map((part) => {
                if (typeof part === 'string') return part;
                const value = variables[part.value] ?? part.value;
                return typeof value === 'string' ? eval(value) : value;
            })
            .join(' ');
        return eval(formulaString);
    } catch {
        return NaN;
    }
};