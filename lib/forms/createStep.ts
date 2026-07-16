// packages/multistep-form/src/createStep.ts
import type { UseFormReturn, FieldPath } from "react-hook-form";
import type { ReactNode } from "react";

function pickFields<T extends object, K extends keyof T>(
  obj: T,
  keys: readonly K[],
): Pick<T, K> {
  const result = {} as Pick<T, K>;
  for (const key of keys) result[key] = obj[key];
  return result;
}

type StepConfig<Root, F extends readonly (keyof Root)[]> = {
  label: string;
  fields: F;
  component: ReactNode;
  handle: (data: Pick<Root, F[number]>) => Promise<void> | void;
};

// export function createStep<Root, F extends readonly (keyof Root)[]>(
//   config: StepConfig<Root, F>,
// ) {
//   return {
//     label: config.label,
//     component: config.component,
//     fields: config.fields,
//     async submit(methods: UseFormReturn) {
//       const isValid = await methods.trigger(config.fields);
//       if (!isValid) return false;
//       const data = pickFields(methods.getValues(config.fields), config.fields);
//       await config.handle(data);
//       return true;
//     },
//   };
// }
