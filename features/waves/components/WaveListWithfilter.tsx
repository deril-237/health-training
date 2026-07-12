"use client";

import { SelectTraining, SelectTrainingProgram } from "@/features/trainings";
import { WaveListComponent } from "./WaveList";
import { useState } from "react";
import EmptyState from "@/components/atoms/EmptyState";
import { Folder } from "lucide-react";

export const WaveListWIthFilter = () => {
  const [selectedTrainingId, setSelectTraining] = useState<string | null>(null);
  const [selectedTrainingProgramId, setSelectTrainingProgram] = useState<
    string | null
  >(null);

  return (
    <>
      <div className="flex flex-col gap-4 md:flex-row">
        <SelectTraining
          onChange={setSelectTraining}
          label="Formation"
          placeholder="Selectionner une formation"
          value={selectedTrainingId}
        />
        <SelectTrainingProgram
          onChange={setSelectTrainingProgram}
          trainingId={selectedTrainingId ?? ""}
          disabled={Boolean(!selectedTrainingId)}
          value={selectedTrainingProgramId}
        />
      </div>

      {selectedTrainingProgramId ? (
        <WaveListComponent trainingProgramId={selectedTrainingProgramId} />
      ) : (
        <EmptyState
          title=""
          icon={<Folder />}
          description={
            !selectedTrainingId
              ? "Choissez une formation, ensuite le parcours"
              : "Choissez un parcours"
          }
        />
      )}
    </>
  );
};
