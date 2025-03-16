export type FormulaPart = string | { value: string; type: 'tag' };

export type FormulaStore = {
    formulaParts: FormulaPart[];
    setFormulaParts: (formula: FormulaPart[]) => void;
    variables: Record<string, number>;
    setVariableValue: (name: string, value: number) => void;
};

export type Suggestion = {
    id: string;
    name: string;
    category: string;
    value: string | number;
};
