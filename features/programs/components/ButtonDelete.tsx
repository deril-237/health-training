import { FunctionComponent } from "react";
import { useDeleteProgram } from "../hooks";
import { TrashIcon } from "lucide-react";
import { Button } from "@/components/atoms/Button";
import { toast } from "react-toastify";
import { SpinnerOverlay } from "@/components/atoms/Spinner";
import { useMessagePopup } from "@/components/molecules";

export const ButtonDelete: FunctionComponent<{ programId: string }> = ({
  programId,
}) => {
  const { isPending, mutateAsync } = useDeleteProgram(programId);
  const { openConfirm } = useMessagePopup();

  const deleteProgram = async () => {
    try {
      await mutateAsync();
      toast.success("Programme supprimé avec succès !");
    } catch (error) {
      console.error("Erreur lors de la suppression du programme :", error);
      toast.error(
        "Une erreur est survenue lors de la suppression du programme.",
      );
    }
  };
  const handleDelete = async () => {
    openConfirm({
      type: "danger",
      title: "Supprimer ?",
      message:
        "Cette action est irréversible. Êtes-vous sûr de vouloir supprimer ce parcours ?",
      onConfirm: deleteProgram,
      showBtnCancel: true,
    });
  };

  return (
    <>
      {isPending ? <SpinnerOverlay /> : null}
      <Button
        className="bg-error btn btn-error btn-sm p-2"
        onClick={handleDelete}
      >
        <TrashIcon className="size-6 text-base-100" />
      </Button>
    </>
  );
};
