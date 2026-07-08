import { FunctionComponent } from "react";
import Input from "@/components/atoms/Input";
import { ActionError } from "@/lib/errors/ActionError";
import { AlertResponse } from "@/components/atoms/AlertResponse";
import { useForm } from "react-hook-form";
import { Button, ButtonLoading } from "@/components/atoms/Button";
import { SaveIcon, Trash2Icon } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { updateWaveSchema } from "../schema";
import { useUpdateWave } from "../hook";
import { Wave } from "../types";

export type UpdateWaveFormProps = {
  wave: Wave;
};

export const UpdateWaveForm: FunctionComponent<UpdateWaveFormProps> = ({
  wave,
}) => {
  const {
    register,
    handleSubmit,
    setError,
    reset,
    formState: { isSubmitting, errors, isSubmitSuccessful },
  } = useForm({
    resolver: zodResolver(updateWaveSchema),
  });

  const { mutateAsync: updateWave } = useUpdateWave(wave.id);

  const submit = handleSubmit(async (data) => {
    try {
      const wave = await updateWave(data);
    } catch (error) {
      if (error instanceof ActionError && error.statusCode === 409) {
        setError("startDate", {
          type: "manual",
          message: error.fieldsErrors?.startDate,
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
          message={"La vague a été modifié avec success"}
        />
      )}

      {errors.root?.message && (
        <AlertResponse type="error" message={errors.root.message} />
      )}
      <div className="flex flex-col gap-4">
        <div className="w-72">
          <Input type="date" label="Debut" {...register("startDate")} />
        </div>
        <div className="w-72">
          <Input type="number" label="quota" {...register("quota")} />
        </div>
        <div className="w-72">
          <Input type="number" label="prix" {...register("price")} />
        </div>
      </div>
      <div className="mt-5 flex flex-row gap-4 self-baseline-last">
        <ButtonLoading
          loadingComponent={<span className="loading"></span>}
          type="submit"
          disabled={isSubmitting}
          className="btn btn-warning text-white disabled:cursor-not-allowed"
        >
          <SaveIcon size={18} />
          {isSubmitting ? "Traitement..." : "Modifier"}
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
