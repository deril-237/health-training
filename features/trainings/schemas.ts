import zod from "zod";

const createTrainingSchema = zod.object({
  name: zod.string(),
  description: zod.string(),
  objective: zod.string(),
  image: zod.file(),
  programs: zod.array(zod.cuid2()),
});


