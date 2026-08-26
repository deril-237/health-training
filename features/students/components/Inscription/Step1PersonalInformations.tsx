import Input from "@/components/atoms/Input";
import { Button, ButtonLoading } from "@/components/atoms/Button";
import { SelectTraining, SelectTrainingProgram } from "@/features/trainings";
import { FunctionComponent, ReactNode, useState } from "react";
import { RadioModalityOptionGroup } from "../RadioModalityOptionGroup";
import { RadioMotivationOptionGroup } from "../RadioMotivationOptions";
import { InputFile } from "@/components/atoms/InputFile";
import { FormProvider, useForm, useFormContext } from "react-hook-form";
import { Stepper } from "@/components/atoms/Stepper";
import { UserRound } from "lucide-react";
import { SectionTitle } from "./SectionTitle";

export const Step1PersonalInformation = () => {
  return (
    <form className="flex flex-col gap-8">
      <SectionTitle
        icon={UserRound}
        title="Informations personnelles"
        description="Ces informations doivent correspondre à votre pièce d'identité."
      />

      <div className="flex flex-col gap-6">
        <Input
          label="Numéro de CNI/Passeport"
          placeholder="123456789"
          required
        />

        <div className="flex flex-col gap-6 md:flex-row">
          <Input label="Nom" type="text" placeholder="Jean" required />
          <Input label="Prénom" type="text" placeholder="Dupont" required />
        </div>

        <div className="flex flex-col gap-6 md:flex-row">
          <Input label="Date de naissance" type="date" required />
          <Input
            label="Lieu de naissance"
            type="text"
            placeholder="Ngaoundéré"
            required
          />
        </div>

        <div className="flex flex-col gap-6 md:flex-row">
          <Input
            label="Email"
            type="email"
            placeholder="jean@example.com"
            required
          />
          <Input
            label="Téléphone"
            type="tel"
            placeholder="6 99 99 99 99"
            required
          />
        </div>

        <div className="w-full md:w-1/2">
          <Input label="Résidence" type="text" placeholder="Yaoundé" />
        </div>
      </div>
    </form>
  );
};
