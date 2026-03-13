import { useVizijRuntime } from "@vizij/runtime-react";
import {
  type ChangeEvent,
  useCallback,
  useId,
  useMemo,
  useRef,
  useState,
} from "react";

type RigInputOption = {
  path: string;
  label: string;
  id?: string;
  min?: number;
  max?: number;
  defaultValue?: number;
};

export function RigControlPanel({
  unstyled = false,
}: {
  unstyled?: boolean;
} = {}) {
  const { ready, assetBundle, setInput, step } = useVizijRuntime();
  const rigSpec = assetBundle.rig?.spec;
  const runtimeNamespace = assetBundle.namespace ?? "vizij";
  const rigInputOptions = useMemo(
    () => extractRigInputOptions(rigSpec, runtimeNamespace),
    [rigSpec, runtimeNamespace],
  );

  const handleStageValue = useCallback(
    (path: string, value: number) => {
      setInput(path, { float: value });
      step(1 / 30);
    },
    [setInput, step],
  );

  return (
    <InputStager
      inputs={rigInputOptions}
      disabled={!ready}
      onStage={handleStageValue}
      constraintsCount={countWithConstraints(rigInputOptions)}
      unstyled={unstyled}
    />
  );
}

function countWithConstraints(options: RigInputOption[]): {
  total: number;
  resolved: number;
} {
  const total = options.length;
  const resolved = options.filter(
    (opt) =>
      opt.min !== undefined ||
      opt.max !== undefined ||
      opt.defaultValue !== undefined,
  ).length;
  return { total, resolved };
}

function namespaceTypedPath(path: string, namespace: string): string {
  const trimmed = path.trim();
  if (!trimmed) return trimmed;
  const prefix = `${namespace}/`;
  if (trimmed.startsWith(prefix)) return trimmed;
  return `${prefix}${trimmed}`;
}

type InputStagerProps = {
  inputs: RigInputOption[];
  disabled: boolean;
  onStage: (path: string, value: number) => void;
  constraintsCount: { total: number; resolved: number };
  unstyled: boolean;
};

function InputStager({
  inputs,
  disabled,
  onStage,
  constraintsCount,
  unstyled,
}: InputStagerProps) {
  const FALLBACK_MIN = -1;
  const FALLBACK_MAX = 1;
  const FALLBACK_DEFAULT = 0;
  const [query, setQuery] = useState("");
  const [selectedPath, setSelectedPath] = useState("");
  const [stagedValues, setStagedValues] = useState<Record<string, number>>({});
  const [valueDraft, setValueDraft] = useState("");
  const listId = useId();
  const queryInputId = useId();
  const valueInputId = useId();
  const warnedMissingRef = useRef<Set<string>>(new Set());

  const getBounds = useCallback(
    (path: string) => {
      const option = inputs.find((opt) => opt.path === path);
      const min = option?.min ?? FALLBACK_MIN;
      const max = option?.max ?? FALLBACK_MAX;
      const defaultValue = option?.defaultValue ?? FALLBACK_DEFAULT;
      if (
        process.env.NODE_ENV !== "production" &&
        option?.min === undefined &&
        option?.max === undefined &&
        option?.defaultValue === undefined
      ) {
        if (!warnedMissingRef.current.has(path)) {
          warnedMissingRef.current.add(path);
          console.warn(
            "[vizij-demos] No constraints for path; using fallback range",
            {
              path,
              min,
              max,
              defaultValue,
            },
          );
        }
      }
      return { min, max, defaultValue };
    },
    [inputs],
  );

  const addPath = useCallback(
    (path: string) => {
      const existing = stagedValues[path];
      const { defaultValue, min, max } = getBounds(path);
      const clamped =
        existing != null
          ? existing
          : Math.min(max, Math.max(min, defaultValue));
      if (existing == null) {
        setStagedValues((prev) => ({ ...prev, [path]: clamped }));
        onStage(path, clamped);
      }
      setSelectedPath(path);
      setValueDraft(String(clamped));
      setQuery("");
    },
    [getBounds, onStage, stagedValues],
  );

  const handleQueryChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      const value = event.target.value;
      setQuery(value);
      const match = inputs.find((option) => option.path === value);
      if (match) {
        addPath(match.path);
      }
    },
    [inputs, addPath],
  );

  const clampValue = useCallback(
    (path: string, value: number) => {
      const { min, max } = getBounds(path);
      return Math.min(max, Math.max(min, value));
    },
    [getBounds],
  );

  const stageValue = useCallback(
    (path: string, numeric: number) => {
      const clamped = clampValue(path, numeric);
      setStagedValues((prev) => ({
        ...prev,
        [path]: clamped,
      }));
      onStage(path, clamped);
      if (path === selectedPath) {
        setValueDraft(String(clamped));
      }
    },
    [clampValue, onStage, selectedPath],
  );

  const handleValueChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      const nextValue = event.target.value;
      setValueDraft(nextValue);
      if (!selectedPath || nextValue.trim() === "") {
        return;
      }
      const numeric = Number(nextValue);
      if (!Number.isFinite(numeric)) {
        return;
      }
      stageValue(selectedPath, numeric);
    },
    [selectedPath, stageValue],
  );

  const handleReset = useCallback(
    (path: string) => {
      if (!path) {
        return;
      }
      setStagedValues((prev) => {
        if (!(path in prev)) {
          return prev;
        }
        const next = { ...prev };
        delete next[path];
        return next;
      });
      if (selectedPath === path) {
        setValueDraft("");
      }
      const { defaultValue, min, max } = getBounds(path);
      const clamped = Math.min(max, Math.max(min, defaultValue));
      onStage(path, clamped);
    },
    [onStage, selectedPath, getBounds],
  );

  const handleResetAll = useCallback(() => {
    const paths = Object.keys(stagedValues);
    if (paths.length === 0) {
      return;
    }
    for (const path of paths) {
      const { defaultValue, min, max } = getBounds(path);
      const clamped = Math.min(max, Math.max(min, defaultValue));
      onStage(path, clamped);
    }
    setStagedValues({});
    if (paths.includes(selectedPath)) {
      setValueDraft("");
    }
  }, [getBounds, onStage, stagedValues, selectedPath]);

  const filteredInputs = useMemo(() => {
    const term = query.trim().toLowerCase();
    if (!term) {
      return inputs.slice(0, 20);
    }
    return inputs
      .filter((option) => option.path.toLowerCase().includes(term))
      .slice(0, 20);
  }, [inputs, query]);

  const selectedLabel =
    inputs.find((option) => option.path === selectedPath)?.label ??
    selectedPath;

  return (
    <div
      className={
        unstyled
          ? "space-y-4"
          : "rounded-xl border border-accent-base/20 bg-surface-lighter/40 p-4 backdrop-blur-md"
      }
    >
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-accent-base/80">
            Direct feature overrides
          </p>
          <p className="mt-2 text-sm text-color-500">
            Search any path on the face and set exact values for transforms,
            colors, or blend parameters.
          </p>
          <p className="mt-2 text-xs text-color-500/90">
            Authored ranges resolved for {constraintsCount.resolved} of{" "}
            {constraintsCount.total} inputs.
          </p>
        </div>
        <button
          type="button"
          className="rounded-md border border-accent-base/25 bg-surface px-3 py-1.5 text-sm text-foreground transition-colors hover:border-accent-base/45 hover:bg-accent-base/10 disabled:cursor-not-allowed disabled:opacity-50"
          onClick={handleResetAll}
          disabled={disabled || Object.keys(stagedValues).length === 0}
        >
          Reset all
        </button>
      </div>

      <label
        className="mt-4 block text-xs font-semibold uppercase tracking-wider text-accent-base/80"
        htmlFor={queryInputId}
      >
        <span>Rig input path</span>
        <input
          id={queryInputId}
          name="rig-input-path"
          type="search"
          list={listId}
          className="mt-2 w-full rounded-md border border-accent-base/20 bg-surface px-3 py-2 text-sm text-foreground outline-none transition-colors focus:border-accent-base/50"
          placeholder={
            inputs.length > 0
              ? "Search feature path (e.g. rig/face/smile_left)"
              : "No feature paths available"
          }
          value={query}
          onChange={handleQueryChange}
          disabled={disabled || inputs.length === 0}
        />
        <datalist id={listId}>
          {filteredInputs.map((option) => (
            <option key={option.path} value={option.path}>
              {option.label}
            </option>
          ))}
        </datalist>
      </label>

      {selectedPath && (
        <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:items-end">
          <label
            className="grow text-xs font-semibold uppercase tracking-wider text-accent-base/80"
            htmlFor={valueInputId}
          >
            <span>Value for {selectedLabel || selectedPath}</span>
            <input
              id={valueInputId}
              name="rig-input-value"
              type="number"
              className="mt-2 w-full rounded-md border border-accent-base/20 bg-surface px-3 py-2 text-sm text-foreground outline-none transition-colors focus:border-accent-base/50"
              step="0.01"
              value={valueDraft}
              onChange={handleValueChange}
              disabled={disabled}
            />
          </label>
          <button
            type="button"
            className="rounded-md border border-accent-base/25 bg-surface px-3 py-2 text-sm text-foreground transition-colors hover:border-accent-base/45 hover:bg-accent-base/10 disabled:cursor-not-allowed disabled:opacity-50"
            onClick={() => handleReset(selectedPath)}
            disabled={disabled}
          >
            Reset
          </button>
        </div>
      )}

      {Object.keys(stagedValues).length > 0 && (
        <div className="mt-4">
          <p className="text-xs font-semibold uppercase tracking-wider text-accent-base/80">
            Staged overrides
          </p>
          <ul className="mt-2 space-y-2">
            {Object.entries(stagedValues).map(([path, value]) => (
              <li
                key={path}
                className="rounded-md border border-accent-base/15 bg-surface/70 p-3"
              >
                <div className="flex flex-wrap items-center gap-2 text-xs text-color-500">
                  <strong className="text-foreground">{path}</strong>
                  <span>→ {value.toFixed(2)}</span>
                </div>
                <div className="mt-2 flex items-center gap-3">
                  <input
                    type="range"
                    name={`staged-${path}`}
                    className="h-2 w-full accent-accent-base"
                    min={getBounds(path).min}
                    max={getBounds(path).max}
                    step={0.01}
                    value={value}
                    onChange={(event) =>
                      stageValue(path, Number(event.target.value))
                    }
                    disabled={disabled}
                  />
                  <button
                    type="button"
                    className="rounded-md border border-accent-base/20 bg-surface px-2 py-1 text-xs text-foreground transition-colors hover:border-accent-base/45 hover:bg-accent-base/10 disabled:cursor-not-allowed disabled:opacity-50"
                    onClick={() => handleReset(path)}
                    disabled={disabled}
                  >
                    Reset
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

function extractRigInputOptions(
  spec: unknown,
  namespace: string,
  constraints: Record<
    string,
    { min?: number; max?: number; defaultValue?: number }
  > = {},
): RigInputOption[] {
  if (!spec || typeof spec !== "object") {
    return [];
  }
  const nodes = Array.isArray((spec as { nodes?: unknown }).nodes)
    ? ((spec as { nodes?: unknown }).nodes as unknown[])
    : [];
  const options: RigInputOption[] = [];
  for (const node of nodes) {
    if (!node || typeof node !== "object") {
      continue;
    }
    const type = String((node as { type?: unknown }).type ?? "").toLowerCase();
    if (type !== "input") {
      continue;
    }
    const params = (node as { params?: unknown }).params;
    const path =
      params && typeof params === "object"
        ? (params as { path?: unknown }).path
        : undefined;
    if (typeof path !== "string") {
      continue;
    }
    const trimmed = path.trim();
    if (!trimmed) {
      continue;
    }
    const label =
      typeof (node as { label?: unknown }).label === "string"
        ? ((node as { label?: string }).label as string)
        : trimmed;
    const numericOrUndefined = (val: unknown): number | undefined => {
      const num = Number(val);
      return Number.isFinite(num) ? num : undefined;
    };
    const namespaced = namespaceTypedPath(trimmed, namespace);
    const stripped =
      trimmed.startsWith("rig/") && trimmed.split("/").length > 2
        ? trimmed.split("/").slice(2).join("/")
        : trimmed.startsWith("/")
          ? trimmed.slice(1)
          : trimmed;
    const namespacedStripped = namespaceTypedPath(stripped, namespace);
    const fromConstraints =
      constraints[trimmed] ??
      constraints[namespaced] ??
      constraints[stripped] ??
      constraints[namespacedStripped];
    options.push({
      path: trimmed,
      label,
      id:
        typeof (node as { id?: unknown }).id === "string"
          ? String((node as { id?: unknown }).id)
          : undefined,
      min:
        fromConstraints?.min ??
        (params && typeof params === "object"
          ? numericOrUndefined((params as { min?: unknown }).min)
          : undefined),
      max:
        fromConstraints?.max ??
        (params && typeof params === "object"
          ? numericOrUndefined((params as { max?: unknown }).max)
          : undefined),
      defaultValue:
        fromConstraints?.defaultValue ??
        (params && typeof params === "object"
          ? numericOrUndefined(
              (params as { default?: unknown; value?: unknown }).default ??
                (params as { value?: unknown }).value,
            )
          : undefined),
    });
  }
  return options.sort((a, b) => a.path.localeCompare(b.path));
}
