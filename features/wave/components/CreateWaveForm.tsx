"use client";

import Input from "@/components/atoms/Input";
import SelectTraining from "@/features/trainings/components/SelectTraining";
import SelectTrainingProgram from "@/features/trainings/components/SelectTrainingProgram";
import { FunctionComponent } from "react";
import { useForm, Controller } from "react-hook-form";
import { createWaveSchema } from "../schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCreateWave } from "../hook";
import zod from "zod";
import { ActionError } from "@/lib/errors/ActionError";
import { Button, ButtonLoading } from "@/components/atoms/Button";
import { SaveIcon, Trash2Icon } from "lucide-react";
import { AlertResponse } from "@/components/atoms/AlertResponse";
import Select from "@/components/atoms/Select";

const createWaveFormSchema = createWaveSchema.extend({
  trainingId: zod.cuid2({
    error: (error) => {
      error;
    },
  }),
});

export const CreateWaveForm: FunctionComponent = () => {
  const {
    register,
    handleSubmit,
    watch,
    reset,
    control,
    formState: { isSubmitting, isSubmitSuccessful, errors },
    setError,
  } = useForm({
    resolver: zodResolver(createWaveFormSchema),
  });

  const trainingId = watch("trainingId");

  const { mutateAsync: createWave } = useCreateWave();

  const submit = handleSubmit(async (data) => {
    try {
      await createWave({ ...data });
      reset();
    } catch (error) {
      if (error instanceof ActionError && error.statusCode === 409) {
        // business error
        setError("root", {
          type: "manual",
          message: error.global,
        });
        return;
      }

      setError("root", {
        type: "manual",
        message:
          "Une erreur est survenue. S'il vous plaît, réessayez plus tard ou contacté l'administrateur.",
      });
    }
  });

  return (
    <form className="flex flex-col gap-4" onSubmit={submit}>
      {isSubmitSuccessful && (
        <AlertResponse
          type="success"
          message={"la vague a été crée avec sucess"}
        />
      )}

      {errors.root?.message && (
        <AlertResponse type="error" message={errors.root.message} />
      )}
      <div className="w-full">
        <Select
          options={[
            { label: "test", value: "12" },
            { label: "test", value: "1" },
          ]}
          onChangeValue={() => {}}
        />
        <Input
          type="date"
          label="Début"
          {...register("startDate")}
          error={errors.startDate?.message}
        />
      </div>
      <div className="w-full">
        <Input
          type="number"
          label="quota"
          {...register("quota")}
          error={errors.quota?.message}
        />
      </div>
      <div className="w-full">
        <Input
          type="number"
          label="prix"
          {...register("price")}
          error={errors.price?.message}
        />
      </div>
      <Controller
        name="trainingId"
        control={control}
        render={({ field: { onChange, value } }) => (
          <SelectTraining
            label="Formation"
            onChange={onChange}
            value={value}
            error={errors.trainingId?.message}
          />
        )}
      />
      {trainingId ? (
        <div className="w-full">
          <Controller
            name="trainingProgramId"
            control={control}
            render={({ field: { onChange, value } }) => (
              <SelectTrainingProgram
                trainingId={trainingId}
                label="Parcours"
                onChange={onChange}
                value={value}
                error={errors.trainingProgramId?.message}
              />
            )}
          />
        </div>
      ) : (
        <div className="w-full">
          <Input
            type="text"
            placeholder="Choisesz d'abord une formation"
            label="Parcours"
            disabled={true}
          />
        </div>
      )}

      <div className="mt-5 flex flex-row gap-4 self-baseline-last">
        <ButtonLoading
          loadingComponent={<span className="loading"></span>}
          type="submit"
          disabled={isSubmitting}
          className="btn btn-success text-white disabled:cursor-not-allowed"
        >
          <SaveIcon size={18} />
          {isSubmitting ? "Traitement..." : "Enregistrer"}
        </ButtonLoading>
        <Button
          type="button"
          onClick={() => {
            reset();
          }}
          className="btn btn-error text-white"
        >
          <Trash2Icon size={18} />
          Annuler
        </Button>
      </div>
    </form>
  );
};

declare module "@/store/useModalStore" {
  interface ModalRegistry {
    createWave: undefined;
  }
}
