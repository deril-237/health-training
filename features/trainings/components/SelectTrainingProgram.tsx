"use client";

import { useMemo } from "react";
import Select, {
  type SelectOption,
  type SelectValue,
} from "@/components/atoms/Select";
import { useGetTrainingProgramList } from "../hooks";

type SelectTrainingProgramProps = {
  trainingId: string;
  label?: string;
  placeholder?: string;
  name?: string;
  className?: string;
  disabled?: boolean;
  inputId?: string;
  value?: string | null;
  error?: string;
  isClearable?: boolean;
  isSearchable?: boolean;
  onChange?: (value: string | null) => void;
};

type TrainingProgramWithProgram = {
  id: string;
  program?: { id?: string; duration?: number | null } | null;
};

function toProgramOption(
  trainingProgram: TrainingProgramWithProgram,
): SelectOption {
  const programLabel = trainingProgram.program?.duration
    ? `parcours de ${trainingProgram.program.duration} mois`
    : "Programme";

  return {
    label: programLabel,
    value: trainingProgram.id,
  };
}

export function SelectTrainingProgram({
  trainingId,
  label = "Programme",
  placeholder = "Sélectionner un programme",
  name,
  className,
  disabled = false,
  inputId,
  value,
  error,
  isClearable = true,
  isSearchable = true,
  onChange,
}: SelectTrainingProgramProps) {
  const {
    data = [],
    isLoading,
    isError,
  } = useGetTrainingProgramList(trainingId);

  const options = useMemo(() => data.map(toProgramOption), [data]);

  const handleChangeValue = (nextValue: SelectValue | SelectValue[] | null) => {
    const singleValue = Array.isArray(nextValue)
      ? (nextValue[0] ?? null)
      : nextValue;

    onChange?.(singleValue != null ? String(singleValue) : null);
  };

  return (
    <Select
      label={label}
      placeholder={placeholder}
      name={name}
      className={className}
      inputId={inputId}
      options={options}
      value={value ?? null}
      onChangeValue={handleChangeValue}
      isLoading={isLoading}
      disabled={disabled || !trainingId}
      isClearable={isClearable}
      isSearchable={isSearchable}
      error={
        error ?? (isError ? "Impossible de charger les programmes" : undefined)
      }
      noOptionsMessage={() => "Aucun programme disponible"}
    />
  );
}

export default SelectTrainingProgram;
