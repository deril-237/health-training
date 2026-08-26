import { FileText } from "lucide-react";
import { SectionTitle } from "./SectionTitle";
import { InputFile } from "@/components/atoms/InputFile";
import Input from "@/components/atoms/Input";

export const Step3Attachments = () => {
  return (
    <form className="flex flex-col gap-8">
      <SectionTitle
        icon={FileText}
        title="Pièces justificatives"
        description="Formats acceptés : JPG, PNG, PDF."
      />

      <div className="flex flex-col gap-6">
        <InputFile
          showPreview={true}
          label="Photo"
          accept="image/*"
          multiple={false}
        />
        <InputFile label="Diplôme" showPreview={true} accept=".pdf" />
        <InputFile
          label="CNI/Passeport"
          showPreview={false}
          accept=".pdf,image/*"
        />
      </div>
    </form>
  );
};
