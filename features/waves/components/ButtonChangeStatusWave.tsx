import { FunctionComponent } from "react";
import { ArchiveIcon, CirclePlay, TrashIcon } from "lucide-react";
import { ButtonLoading } from "@/components/atoms/Button";
import { toast } from "react-toastify";
import { SpinnerOverlay } from "@/components/atoms/Spinner";
import { useLockWaveCourse, useUnlockWaveCourse } from "../hooks";

export const ButtonLockCourseWave: FunctionComponent<{ waveId: string }> = ({
  waveId: programId,
}) => {
  const { isPending, mutateAsync } = useLockWaveCourse();
  const lockWaveCourse = async () => {
    const result = await mutateAsync(programId);

    if (result.success === false) {
      toast.error(
        "Une erreur est survenue lors de le traitement. S'il vous réssayer",
      );

      return;
    }
    toast.success("La vague a été bloqué avec success");
  };

  return (
    <>
      {isPending ? <SpinnerOverlay /> : null}
      <ButtonLoading
        className=" bg-red-600  btn btn-sm p-2"
        onClick={lockWaveCourse}
      >
        <ArchiveIcon className="size-6 text-base-100" />
      </ButtonLoading>
    </>
  );
};

export const ButtonUnlockCourseWave: FunctionComponent<{
  waveId: string;
}> = ({ waveId: programId }) => {
  const { isPending, mutateAsync } = useUnlockWaveCourse();
  const lockWaveCourse = async () => {
    const result = await mutateAsync(programId);

    if (result.success === false) {
      toast.error(
        "Une erreur est survenue lors de le traitement. S'il vous réssayer",
      );

      return;
    }
    toast.success("Les cours de la vague ont été debloqué  avec success");
  };

  return (
    <>
      {isPending ? <SpinnerOverlay /> : null}
      <ButtonLoading
        className="btn btn-info btn-sm p-2"
        onClick={lockWaveCourse}
      >
        <CirclePlay className="size-6 text-base-100" />
      </ButtonLoading>
    </>
  );
};
