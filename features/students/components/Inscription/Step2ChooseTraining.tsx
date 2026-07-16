import { SelectTraining, SelectTrainingProgram } from "@/features/trainings";
import { RadioModalityOptionGroup } from "../RadioModalityOptionGroup";
import { RadioMotivationOptionGroup } from "../RadioMotivationOptions";
import { useFormContext } from "react-hook-form";
import { GraduationCap } from "lucide-react";
import { SectionTitle } from "./SectionTitle";
import TextArea from "@/components/atoms/TextArea";

export const Step2ChooseTraining = () => {
  const {} = useFormContext();
  return (
    <form className="flex flex-col gap-8">
      <SectionTitle
        icon={GraduationCap}
        title="Choix de la formation"
        description="Sélectionnez la formation et le parcours qui vous correspondent."
      />

      <fieldset className="w-full  fieldset bg-base-100 md:border-base-300 md:rounded-box md:border p-4">
        <legend className="label text-sm font-sans font-semibold text-base-content/80 first-letter:capitalize ml-1">
          Quel formation souhaites suivre ?
        </legend>
        <div className="flex flex-col gap-6 md:flex-row">
          <SelectTraining
            label="Formation"
            placeholder="Choisissez une formation"
          />
          <SelectTrainingProgram
            trainingId=""
            disabled={true}
            label="Parcours"
            placeholder="Choisissez un parcours"
          />
        </div>
      </fieldset>

      <fieldset className="w-full fieldset bg-base-100 md:border-base-300 md:rounded-box md:border p-4">
        <legend className="label text-wrap text-sm font-sans font-semibold text-base-content/80 first-letter:capitalize ml-1">
          Comment souhaitez-vous suivre la formation ?
        </legend>
        <RadioModalityOptionGroup name="modality" />
      </fieldset>

      <fieldset className="fieldset bg-base-100 md:border-base-300 md:rounded-box md:border p-4">
        <legend className="label  text-wrap text-sm font-sans font-semibold text-base-content/80 first-letter:capitalize ml-1">
          Qu'est-ce qui vous amène à vous former dans l'action humanitaire ?
        </legend>
        <div className="space-y-4">
          <RadioMotivationOptionGroup />

          <TextArea label="Autres" rows={4} />
        </div>
      </fieldset>
    </form>
  );
};
