"use server";

import { action } from "@/lib/callAction";
import { getMotivationList, checkNumCniPassportAndEmail } from "./services";

export const getMotivationOptionsAction = action(getMotivationList);

export const checkNumCniPassportAndEmailAction = action(async () => {
  checkNumCniPassportAndEmail();
});
