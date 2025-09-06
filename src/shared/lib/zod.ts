import { z } from "zod";

export const jsonString = z
  .string()
  .optional()
  .refine(
    (val) => {
      if (!val || val.trim() === "") {
        return true;
      }
      try {
        JSON.parse(val);
        return true;
      } catch (e) {
        return false;
      }
    },
    { message: "Invalid JSON format" },
  );
