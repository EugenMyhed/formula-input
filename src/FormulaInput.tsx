import React, { useState, useRef, useMemo } from "react";
import { useQuery } from '@tanstack/react-query';
import {
    TextField,
    MenuItem,
    Menu,
    IconButton,
    Chip,
    Box
} from '@mui/material';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import { useFormulaStore } from "./store/useFormulaStore.ts";
import { fetchAllSuggestions} from "./api/api.ts";
import { FormulaPart, Suggestion } from "./types/types.ts";
import { evaluateFormula } from "./utils.ts";

const FormulaInput: React.FC = () => {
    const { formulaParts, setFormulaParts, variables, setVariableValue } = useFormulaStore();
    const [inputValue, setInputValue] = useState('');
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    const { data: allSuggestions } = useQuery<Suggestion[]>({
        queryKey: ['autocomplete'],
        queryFn: fetchAllSuggestions,
    });

    const suggestions = useMemo(() => allSuggestions?.filter((suggestion) =>
        suggestion.name.toLowerCase().includes(inputValue.toLowerCase())
    ), [allSuggestions, inputValue]) || [];


    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setInputValue(event.target.value);
        if (event.target.value.length > 0 && suggestions.length > 0) {
            setAnchorEl(inputRef.current);
        }
    };

    const handleInputKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Enter' && inputValue.trim()) {
            const tokens = inputValue.split(/([+\-*/()^])/).filter(Boolean);
            const newParts: FormulaPart[] = tokens.map((token) =>
                //@ts-ignore
                isNaN(Number(token)) && !['+', '-', '*', '/', '(', ')', '^'].includes(token)
                    ? { value: token, type: 'tag' }
                    : token
            );
            setFormulaParts([...formulaParts, ...newParts]);
            setInputValue('');
        } else if (event.key === 'Backspace' && inputValue === '' && formulaParts.length > 0) {
            setFormulaParts(formulaParts.slice(0, -1));
        }
    };

    const handleMenuOpen = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    const handleSuggestionSelect = (suggestion: Suggestion) => {
        setFormulaParts([...formulaParts, { value: suggestion.name, type: 'tag' }]);
        setVariableValue(suggestion.name, typeof suggestion.value === 'string' ? eval(suggestion.value) : Number(suggestion.value) || 0);
        setInputValue('');
        handleMenuClose();
    };
    const handleOnBlur = (e: React.FocusEvent<HTMLInputElement>) => {
        if (anchorEl) {
            requestAnimationFrame(() => e.target.focus());
        }
    };

    const result = useMemo(() => evaluateFormula(formulaParts, variables), [formulaParts, variables]);

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', border: '1px solid #ccc', padding: '8px', borderRadius: '4px' }}>
                {formulaParts.map((part, index) =>
                    typeof part === 'string' ? (
                        <span key={index} style={{ margin: '0 4px' }}>{part}</span>
                    ) : (
                        <Chip key={index} label={part.value} onDelete={() => setFormulaParts(formulaParts.filter((_, i) => i !== index))} style={{ margin: '0 4px' }} />
                    )
                )}
                <TextField
                    inputRef={inputRef}
                    value={inputValue}
                    onChange={handleInputChange}
                    onKeyDown={handleInputKeyDown}
                    onBlur={handleOnBlur}
                    placeholder="Enter formula..."
                    variant="standard"
                    sx={{ minWidth: '100px' }}
                />
                {suggestions.length > 0 && (
                    <>
                        <IconButton onClick={handleMenuOpen}>
                            <ArrowDropDownIcon />
                        </IconButton>
                        <Menu
                            anchorEl={anchorEl}
                            open={Boolean(anchorEl)}
                            onClose={handleMenuClose}
                            disableEnforceFocus
                        >
                            {suggestions.map((suggestion) => (
                                <MenuItem key={Math.random()} onClick={() => handleSuggestionSelect(suggestion)}>
                                    {suggestion.name} ({suggestion.value})
                                </MenuItem>
                            ))}
                        </Menu>
                    </>
                )}
            </Box>
            <Box>
                <strong>Result:</strong> {isNaN(result) ? 'Invalid formula' : result}
            </Box>
        </Box>
    );
};

export default FormulaInput
