"use client";

import { Button, ButtonLoading } from "@/components/atoms/Button";
import { FunctionComponent, ReactNode, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { Stepper } from "@/components/atoms/Stepper";
import { ArrowLeft } from "lucide-react";
import { InscriptionInput } from "../../schemas";
import { Step1PersonalInformation } from "./Step1PersonalInformations";
import { Step2ChooseTraining } from "./Step2ChooseTraining";
import { Step3Attachments } from "./Step3Attachments";
import { pickFields } from "@/lib/utils";

export type PersonalInformationInput = Pick<
  InscriptionInput,
  | "birthDate"
  | "birthPlace"
  | "email"
  | "numCNIPassport"
  | "name"
  | "secondName"
  | "residence"
>;

export type ChooseTrainingInput = Pick<
  InscriptionInput,
  "modality" | "trainingProgramId" | "motivations" | "otherMotivation"
>;

export type Attachments = Pick<
  InscriptionInput,
  "diploma" | "photo" | "cniPassport"
>;

export type Step<T> = {
  label: string;
  handle?: (data: T) => Promise<void>;
  component: ReactNode;
  fields: (keyof T)[];
};

const STEPS: [
  Step<PersonalInformationInput>,
  Step<ChooseTrainingInput>,
  Step<Attachments>,
] = [
  {
    label: "Informations personnelles",
    // handle: async (data) => {},
    component: <Step1PersonalInformation />,
    fields: [
      "birthDate",
      "birthPlace",
      "email",
      "name",
      "numCNIPassport",
      "residence",
      "secondName",
    ],
  },
  {
    label: "Choix de la formation",
    // handle: async () => {},
    component: <Step2ChooseTraining />,
    fields: ["modality", "motivations", "otherMotivation", "trainingProgramId"],
  },
  {
    label: "Pièces justificatives",
    // handle: async () => {},
    component: <Step3Attachments />,
    fields: ["cniPassport", "diploma", "photo"],
  },
];

export const InscriptionForm: FunctionComponent = () => {
  const methods = useForm<InscriptionInput>();
  const [currentStep, setStep] = useState(0);

  const previousStep = () => {
    setStep(currentStep === 0 ? currentStep : currentStep - 1);
  };

  const nextStep = async () => {
    const fields = STEPS[currentStep].fields as (keyof InscriptionInput)[];
    const isValid = await methods.trigger(fields);

    if (!isValid) return;

    const data = pickFields(
      methods.getValues(undefined, { touchedFields: true }),
      STEPS[currentStep].fields,
    );

    if (STEPS[currentStep].handle) {
      return await STEPS[currentStep]?.handle(data);
    }

    setStep(currentStep === STEPS.length - 1 ? currentStep : currentStep + 1);
  };

  return (
    <FormProvider {...methods}>
      <div className="mx-auto w-full max-w-4xl px-4 py-8 md:py-12">
        {/* En-tête */}
        <div className="mb-8 flex flex-col gap-2 text-center">
          <h1 className="font-heading text-3xl font-bold text-base-content md:text-4xl">
            Inscription à la formation
          </h1>
          <p className="text-base text-base-content/60">
            Renseignez vos informations en quelques étapes simples et rapides.
          </p>
        </div>

        {/* Stepper */}
        <div className="mb-8">
          <Stepper steps={STEPS} currentStep={currentStep} />
        </div>

        {/* Card principale */}
        <div className="rounded-2xl border border-base-300 bg-base-100 shadow-sm">
          <div className="flex flex-col gap-8 p-6 md:p-10">
            {STEPS[currentStep].component}
          </div>

          {/* Barre d'actions */}
          <div className="flex flex-row items-center justify-between gap-4 border-t border-base-300 px-6 py-4 md:px-10">
            <Button
              onClick={previousStep}
              type="button"
              className="btn btn-outline btn-secondary gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Retour
            </Button>
            <ButtonLoading
              onClick={nextStep}
              loadingComponent={
                <span className="loading loading-spinner loading-sm"></span>
              }
              type="submit"
              className="btn btn-primary gap-2 disabled:cursor-not-allowed"
            >
              Suivant
            </ButtonLoading>
          </div>
        </div>
      </div>
    </FormProvider>
  );
};
