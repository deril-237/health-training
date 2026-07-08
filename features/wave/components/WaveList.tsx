import { FunctionComponent } from "react";
import { FilterWave } from "../types";
import { DataTable } from "@/components/molecules";

const waveList: FunctionComponent<FilterWave> = () => {
  return <DataTable />;
};
