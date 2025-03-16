import { create } from 'zustand';

type FormulaPart = string | { value: string; type: 'tag' };

type FormulaStore = {
    formulaParts: FormulaPart[];
    setFormulaParts: (formula: FormulaPart[]) => void;
    variables: Record<string, number>;
    setVariableValue: (name: string, value: number) => void;
};

export const useFormulaStore = create<FormulaStore>((set) => ({
    formulaParts: [],
    setFormulaParts: (formulaParts) => set({ formulaParts }),
    variables: {},
    setVariableValue: (name, value) =>
        set((state) => ({ variables: { ...state.variables, [name]: value } })),
}));
