"use client";

import { useState, ReactNode, useCallback } from "react";
import { FieldValues, Path, useForm } from "react-hook-form";
import { pickFields } from "@/lib/utils";

export type Step<T = unknown> = {
  label: string;
  handle?: (data: T) => Promise<void>;
  component: ReactNode;
  fields: (keyof T)[];
};

export function useMultiStep<T extends FieldValues>(steps: Step[]) {
  const methods = useForm<T>();
  const [currentStep, setStep] = useState(0);

  const previousStep = useCallback(() => {
    setStep(currentStep === 0 ? currentStep : currentStep - 1);
  }, [currentStep]);

  const nextStep = useCallback(async () => {
    const fields = steps[currentStep].fields as Path<T>[];
    const isValid = await methods.trigger(fields);

    if (!isValid) return;

    const data = pickFields(
      methods.getValues(undefined, { touchedFields: true }),
      steps[currentStep].fields,
    );

    if (steps[currentStep].handle) {
      return await steps[currentStep]?.handle(data);
    }

    setStep(currentStep === steps.length - 1 ? currentStep : currentStep + 1);
  }, [currentStep]);

  return {
    ...methods,
    nextStep,
    previousStep,
  };
}
