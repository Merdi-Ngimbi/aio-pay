/**
 * ============================================================
 * AIO PAY - Composants de formulaire (design fintech soft)
 * ============================================================
 * Lib légère, accessible, compatible react-hook-form (forwardRef).
 * Pas de dépendance Radix/shadcn (absents du projet).
 * ============================================================
 */

"use client";

import {
  forwardRef,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  type InputHTMLAttributes,
  type SelectHTMLAttributes,
  type TextareaHTMLAttributes,
  type ButtonHTMLAttributes,
  type ReactNode,
} from "react";
import { Check, ChevronDown, Search, X, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import type { University } from "@/types";

/* ─────────────────────────────────────────────
 * Primitives texte
 * ───────────────────────────────────────────── */

export function FormLabel({
  htmlFor,
  required,
  children,
  className,
}: {
  htmlFor?: string;
  required?: boolean;
  children: ReactNode;
  className?: string;
}) {
  return (
    <label
      htmlFor={htmlFor}
      className={cn("block text-sm font-medium text-gray-700 mb-1.5", className)}
    >
      {children}
      {required && <span className="text-[var(--aio-bordeaux)] ml-0.5">*</span>}
    </label>
  );
}

export function FormHelper({
  children,
  className,
  id,
}: {
  children: ReactNode;
  className?: string;
  id?: string;
}) {
  return (
    <p id={id} className={cn("mt-1.5 text-xs text-gray-500 leading-relaxed", className)}>
      {children}
    </p>
  );
}

export function FormError({
  children,
  className,
  id,
}: {
  children?: ReactNode;
  className?: string;
  id?: string;
}) {
  if (!children) return null;
  return (
    <p
      id={id}
      role="alert"
      className={cn("mt-1.5 text-xs font-medium text-red-600", className)}
    >
      {children}
    </p>
  );
}

/** Enveloppe Label + contrôle + helper/erreur */
export function FormField({
  label,
  htmlFor,
  required,
  helperText,
  error,
  children,
  className,
}: {
  label?: string;
  htmlFor?: string;
  required?: boolean;
  helperText?: ReactNode;
  error?: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  const autoId = useId();
  const fieldId = htmlFor || autoId;
  const helperId = `${fieldId}-helper`;
  const errorId = `${fieldId}-error`;

  return (
    <div className={cn("w-full", className)}>
      {label && (
        <FormLabel htmlFor={fieldId} required={required}>
          {label}
        </FormLabel>
      )}
      {children}
      {error ? (
        <FormError id={errorId}>{error}</FormError>
      ) : helperText ? (
        <FormHelper id={helperId}>{helperText}</FormHelper>
      ) : null}
    </div>
  );
}

/* ─────────────────────────────────────────────
 * Input
 * ───────────────────────────────────────────── */

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  error?: boolean;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, error, leftIcon, rightIcon, id, ...props }, ref) => {
    return (
      <div className="relative w-full">
        {leftIcon && (
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-gray-400">
            {leftIcon}
          </div>
        )}
        <input
          ref={ref}
          id={id}
          className={cn(
            "block w-full rounded-2xl border-0 bg-white py-3.5 text-gray-900 placeholder:text-gray-400 sm:text-sm transition-shadow",
            "shadow-[inset_0_0_0_1px_#e5e7eb] focus:outline-none focus:ring-2 focus:ring-[var(--aio-bordeaux)] focus:shadow-none",
            "disabled:opacity-50 disabled:cursor-not-allowed",
            leftIcon ? "pl-11 pr-4" : "px-4",
            rightIcon && "pr-11",
            error && "shadow-[inset_0_0_0_1px_#ef4444] focus:ring-red-500",
            className
          )}
          aria-invalid={error || undefined}
          {...props}
        />
        {rightIcon && (
          <div className="absolute inset-y-0 right-0 flex items-center pr-3.5 text-gray-400">
            {rightIcon}
          </div>
        )}
      </div>
    );
  }
);
Input.displayName = "Input";

/** Input + FormField (label / helper / error) */
export const TextField = forwardRef<
  HTMLInputElement,
  InputProps & {
    label?: string;
    helperText?: ReactNode;
    fieldError?: ReactNode;
    required?: boolean;
  }
>(({ label, helperText, fieldError, required, id, error, ...props }, ref) => {
  const autoId = useId();
  const fieldId = id || autoId;
  return (
    <FormField
      label={label}
      htmlFor={fieldId}
      required={required}
      helperText={helperText}
      error={fieldError}
    >
      <Input ref={ref} id={fieldId} error={error || !!fieldError} {...props} />
    </FormField>
  );
});
TextField.displayName = "TextField";

/* ─────────────────────────────────────────────
 * Textarea
 * ───────────────────────────────────────────── */

export interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: boolean;
  label?: string;
  helperText?: ReactNode;
  fieldError?: ReactNode;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, error, label, helperText, fieldError, id, required, ...props }, ref) => {
    const autoId = useId();
    const fieldId = id || autoId;
    return (
      <FormField
        label={label}
        htmlFor={fieldId}
        required={required}
        helperText={helperText}
        error={fieldError}
      >
        <textarea
          ref={ref}
          id={fieldId}
          required={required}
          aria-invalid={error || !!fieldError || undefined}
          className={cn(
            "block w-full min-h-[120px] rounded-2xl border-0 bg-white py-3.5 px-4 text-gray-900 placeholder:text-gray-400 sm:text-sm resize-y transition-shadow",
            "shadow-[inset_0_0_0_1px_#e5e7eb] focus:outline-none focus:ring-2 focus:ring-[var(--aio-bordeaux)] focus:shadow-none",
            "disabled:opacity-50 disabled:cursor-not-allowed",
            (error || fieldError) && "shadow-[inset_0_0_0_1px_#ef4444] focus:ring-red-500",
            className
          )}
          {...props}
        />
      </FormField>
    );
  }
);
Textarea.displayName = "Textarea";

/* ─────────────────────────────────────────────
 * Select classique
 * ───────────────────────────────────────────── */

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface SelectProps extends Omit<SelectHTMLAttributes<HTMLSelectElement>, "children"> {
  options: SelectOption[];
  placeholder?: string;
  error?: boolean;
  label?: string;
  helperText?: ReactNode;
  fieldError?: ReactNode;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  (
    {
      className,
      options,
      placeholder,
      error,
      label,
      helperText,
      fieldError,
      id,
      required,
      ...props
    },
    ref
  ) => {
    const autoId = useId();
    const fieldId = id || autoId;
    return (
      <FormField
        label={label}
        htmlFor={fieldId}
        required={required}
        helperText={helperText}
        error={fieldError}
      >
        <div className="relative">
          <select
            ref={ref}
            id={fieldId}
            required={required}
            aria-invalid={error || !!fieldError || undefined}
            className={cn(
              "block w-full appearance-none rounded-2xl border-0 bg-white py-3.5 pl-4 pr-10 text-gray-900 sm:text-sm transition-shadow",
              "shadow-[inset_0_0_0_1px_#e5e7eb] focus:outline-none focus:ring-2 focus:ring-[var(--aio-bordeaux)] focus:shadow-none",
              "disabled:opacity-50 disabled:cursor-not-allowed",
              (error || fieldError) && "shadow-[inset_0_0_0_1px_#ef4444] focus:ring-red-500",
              className
            )}
            {...props}
          >
            {placeholder && (
              <option value="" disabled={required}>
                {placeholder}
              </option>
            )}
            {options.map((opt) => (
              <option key={opt.value} value={opt.value} disabled={opt.disabled}>
                {opt.label}
              </option>
            ))}
          </select>
          <ChevronDown className="pointer-events-none absolute right-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400 stroke-[1.5]" />
        </div>
      </FormField>
    );
  }
);
Select.displayName = "Select";

/* ─────────────────────────────────────────────
 * Checkbox
 * ───────────────────────────────────────────── */

export interface CheckboxProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "type"> {
  label?: ReactNode;
  helperText?: ReactNode;
  fieldError?: ReactNode;
}

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, label, helperText, fieldError, id, ...props }, ref) => {
    const autoId = useId();
    const fieldId = id || autoId;
    return (
      <div className="w-full">
        <label htmlFor={fieldId} className="flex items-start gap-3 cursor-pointer group">
          <span className="relative mt-0.5 flex h-5 w-5 flex-shrink-0">
            <input
              ref={ref}
              id={fieldId}
              type="checkbox"
              className={cn(
                "peer h-5 w-5 appearance-none rounded-md border border-gray-300 bg-white transition-colors",
                "checked:bg-[var(--aio-bordeaux)] checked:border-[var(--aio-bordeaux)]",
                "focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-[var(--aio-bordeaux)]",
                "disabled:opacity-50 disabled:cursor-not-allowed",
                fieldError && "border-red-500",
                className
              )}
              {...props}
            />
            <Check className="pointer-events-none absolute inset-0 m-auto h-3.5 w-3.5 text-white opacity-0 peer-checked:opacity-100 stroke-[2.5]" />
          </span>
          {label && (
            <span className="text-sm text-gray-700 group-hover:text-gray-900 leading-snug">
              {label}
            </span>
          )}
        </label>
        {fieldError ? (
          <FormError>{fieldError}</FormError>
        ) : helperText ? (
          <FormHelper className="ml-8">{helperText}</FormHelper>
        ) : null}
      </div>
    );
  }
);
Checkbox.displayName = "Checkbox";

/* ─────────────────────────────────────────────
 * Switch / Toggle
 * ───────────────────────────────────────────── */

export interface SwitchProps
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "onChange"> {
  checked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  label?: ReactNode;
  helperText?: ReactNode;
}

export function Switch({
  checked = false,
  onCheckedChange,
  label,
  helperText,
  className,
  disabled,
  id,
  ...props
}: SwitchProps) {
  const autoId = useId();
  const fieldId = id || autoId;

  return (
    <div className="w-full">
      <div className="flex items-center justify-between gap-4">
        {label && (
          <label htmlFor={fieldId} className="text-sm text-gray-700 cursor-pointer flex-1">
            {label}
          </label>
        )}
        <button
          type="button"
          role="switch"
          id={fieldId}
          aria-checked={checked}
          disabled={disabled}
          onClick={() => onCheckedChange?.(!checked)}
          className={cn(
            "relative inline-flex h-7 w-12 flex-shrink-0 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--aio-bordeaux)] disabled:opacity-50",
            checked ? "bg-[var(--aio-bordeaux)]" : "bg-gray-200",
            className
          )}
          {...props}
        >
          <span
            className={cn(
              "inline-block h-5 w-5 transform rounded-full bg-white shadow-soft transition-transform",
              checked ? "translate-x-6" : "translate-x-1"
            )}
          />
        </button>
      </div>
      {helperText && <FormHelper>{helperText}</FormHelper>}
    </div>
  );
}

/* ─────────────────────────────────────────────
 * Combobox générique (select + recherche)
 * ───────────────────────────────────────────── */

export interface ComboboxOption {
  value: string;
  label: string;
  description?: string;
  keywords?: string;
}

export interface ComboboxProps {
  options: ComboboxOption[];
  value?: string | null;
  onChange: (value: string | null, option?: ComboboxOption | null) => void;
  placeholder?: string;
  searchPlaceholder?: string;
  emptyMessage?: string;
  label?: string;
  helperText?: ReactNode;
  fieldError?: ReactNode;
  required?: boolean;
  disabled?: boolean;
  loading?: boolean;
  className?: string;
  id?: string;
}

export function Combobox({
  options,
  value,
  onChange,
  placeholder = "Sélectionner…",
  searchPlaceholder = "Rechercher…",
  emptyMessage = "Aucun résultat",
  label,
  helperText,
  fieldError,
  required,
  disabled,
  loading,
  className,
  id,
}: ComboboxProps) {
  const autoId = useId();
  const fieldId = id || autoId;
  const listId = `${fieldId}-listbox`;
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [highlight, setHighlight] = useState(0);

  const selected = useMemo(
    () => options.find((o) => o.value === value) || null,
    [options, value]
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return options;
    return options.filter((o) => {
      const hay = `${o.label} ${o.description || ""} ${o.keywords || ""}`.toLowerCase();
      return hay.includes(q);
    });
  }, [options, query]);

  useEffect(() => {
    if (!open) return;
    const onDoc = (e: MouseEvent) => {
      if (!containerRef.current?.contains(e.target as Node)) {
        setOpen(false);
        setQuery("");
      }
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, [open]);

  useEffect(() => {
    setHighlight(0);
  }, [query, open]);

  const selectOption = (opt: ComboboxOption | null) => {
    onChange(opt?.value ?? null, opt);
    setOpen(false);
    setQuery("");
  };

  const displayValue = open ? query : selected?.label || "";

  return (
    <FormField
      label={label}
      htmlFor={fieldId}
      required={required}
      helperText={helperText}
      error={fieldError}
      className={className}
    >
      <div ref={containerRef} className="relative">
        <div className="relative">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400 stroke-[1.5]" />
          <input
            ref={inputRef}
            id={fieldId}
            role="combobox"
            aria-expanded={open}
            aria-controls={listId}
            aria-autocomplete="list"
            aria-invalid={!!fieldError || undefined}
            disabled={disabled || loading}
            placeholder={selected ? selected.label : placeholder}
            value={displayValue}
            onChange={(e) => {
              setQuery(e.target.value);
              if (!open) setOpen(true);
            }}
            onFocus={() => {
              setOpen(true);
              setQuery("");
            }}
            onKeyDown={(e) => {
              if (e.key === "ArrowDown") {
                e.preventDefault();
                setOpen(true);
                setHighlight((h) => Math.min(h + 1, Math.max(filtered.length - 1, 0)));
              } else if (e.key === "ArrowUp") {
                e.preventDefault();
                setHighlight((h) => Math.max(h - 1, 0));
              } else if (e.key === "Enter") {
                e.preventDefault();
                if (open && filtered[highlight]) selectOption(filtered[highlight]);
                else setOpen(true);
              } else if (e.key === "Escape") {
                setOpen(false);
                setQuery("");
              }
            }}
            className={cn(
              "block w-full rounded-2xl border-0 bg-white py-3.5 pl-11 pr-20 text-gray-900 placeholder:text-gray-400 sm:text-sm transition-shadow",
              "shadow-[inset_0_0_0_1px_#e5e7eb] focus:outline-none focus:ring-2 focus:ring-[var(--aio-bordeaux)] focus:shadow-none",
              "disabled:opacity-50 disabled:cursor-not-allowed",
              fieldError && "shadow-[inset_0_0_0_1px_#ef4444] focus:ring-red-500"
            )}
          />
          <div className="absolute inset-y-0 right-2 flex items-center gap-0.5">
            {loading && (
              <Loader2 className="h-4 w-4 animate-spin text-gray-400" />
            )}
            {selected && !loading && (
              <button
                type="button"
                aria-label="Effacer"
                className="p-1.5 rounded-full text-gray-400 hover:bg-gray-100 hover:text-gray-600"
                onClick={(e) => {
                  e.stopPropagation();
                  selectOption(null);
                  inputRef.current?.focus();
                }}
              >
                <X className="h-4 w-4 stroke-[1.5]" />
              </button>
            )}
            <button
              type="button"
              tabIndex={-1}
              aria-label="Ouvrir la liste"
              disabled={disabled || loading}
              className="p-1.5 rounded-full text-gray-400 hover:bg-gray-100"
              onClick={() => {
                setOpen((o) => !o);
                inputRef.current?.focus();
              }}
            >
              <ChevronDown
                className={cn(
                  "h-4 w-4 stroke-[1.5] transition-transform",
                  open && "rotate-180"
                )}
              />
            </button>
          </div>
        </div>

        {open && !disabled && (
          <ul
            id={listId}
            role="listbox"
            className="absolute z-50 mt-2 max-h-60 w-full overflow-auto rounded-2xl bg-white py-2 shadow-soft-lg ring-1 ring-black/5"
          >
            {filtered.length === 0 ? (
              <li className="px-4 py-3 text-sm text-gray-500">{emptyMessage}</li>
            ) : (
              filtered.map((opt, idx) => {
                const isSelected = opt.value === value;
                const isActive = idx === highlight;
                return (
                  <li
                    key={opt.value}
                    role="option"
                    aria-selected={isSelected}
                    className={cn(
                      "flex cursor-pointer items-center gap-3 px-4 py-2.5 text-sm transition-colors",
                      isActive && "bg-[var(--aio-cream)]",
                      isSelected && "font-medium text-[var(--aio-bordeaux)]"
                    )}
                    onMouseEnter={() => setHighlight(idx)}
                    onMouseDown={(e) => {
                      e.preventDefault();
                      selectOption(opt);
                    }}
                  >
                    <div className="flex-1 min-w-0">
                      <p className="truncate text-gray-900">{opt.label}</p>
                      {opt.description && (
                        <p className="truncate text-xs text-gray-500 mt-0.5">
                          {opt.description}
                        </p>
                      )}
                    </div>
                    {isSelected && (
                      <Check className="h-4 w-4 flex-shrink-0 text-[var(--aio-bordeaux)] stroke-[1.5]" />
                    )}
                  </li>
                );
              })
            )}
          </ul>
        )}
      </div>
    </FormField>
  );
}

/* ─────────────────────────────────────────────
 * Combobox Université (métier AIO Pay)
 * ───────────────────────────────────────────── */

export const DEMO_UNIVERSITIES: University[] = [
  { id: "unikin-001", name: "Université de Kinshasa (UNIKIN)", code: "UNIKIN", isActive: true, createdAt: new Date().toISOString() },
  { id: "upc-001", name: "Université Protestante au Congo (UPC)", code: "UPC", isActive: true, createdAt: new Date().toISOString() },
  { id: "upn-001", name: "Université Pédagogique Nationale (UPN)", code: "UPN", isActive: true, createdAt: new Date().toISOString() },
  { id: "ufasic-001", name: "Université Francophone Afrique-Sicile (UFASIC)", code: "UFASIC", isActive: true, createdAt: new Date().toISOString() },
  { id: "aba-001", name: "Académie des Beaux-Arts (ABA)", code: "ABA", isActive: true, createdAt: new Date().toISOString() },
  { id: "isau-001", name: "Institut Supérieur d'Architecture et d'Urbanisme (ISAU)", code: "ISAU", isActive: true, createdAt: new Date().toISOString() },
  { id: "isp-gombe-001", name: "Institut Supérieur Pédagogique de la Gombe (ISP GOMBE)", code: "ISP-GOMBE", isActive: true, createdAt: new Date().toISOString() },
  { id: "hec-001", name: "Hautes Études Commerciales (HEC)", code: "HEC", isActive: true, createdAt: new Date().toISOString() },
];

export interface UniversityComboboxProps {
  universities: University[];
  value: University | null;
  onChange: (university: University | null) => void;
  label?: string;
  helperText?: ReactNode;
  fieldError?: ReactNode;
  required?: boolean;
  disabled?: boolean;
  loading?: boolean;
  className?: string;
  id?: string;
}

export function UniversityCombobox({
  universities,
  value,
  onChange,
  label = "Université",
  helperText = "Tapez pour rechercher ou choisissez dans la liste.",
  fieldError,
  required,
  disabled,
  loading,
  className,
  id,
}: UniversityComboboxProps) {
  const options: ComboboxOption[] = useMemo(
    () =>
      universities.map((u) => ({
        value: u.id,
        label: u.name,
        description: u.code,
        keywords: `${u.code} ${u.name}`,
      })),
    [universities]
  );

  return (
    <Combobox
      id={id}
      options={options}
      value={value?.id ?? null}
      onChange={(idVal) => {
        const uni = universities.find((u) => u.id === idVal) || null;
        onChange(uni);
      }}
      placeholder="Rechercher une université…"
      searchPlaceholder="Ex: UPC, UNIKIN…"
      emptyMessage="Aucune université trouvée"
      label={label}
      helperText={helperText}
      fieldError={fieldError}
      required={required}
      disabled={disabled}
      loading={loading}
      className={className}
    />
  );
}
