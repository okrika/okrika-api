export const toFixed = (input: number | string) => {
  if (isNaN(input as number)) {
    throw new Error("Number cannot be converted");
  }

  if (typeof input === "string") {
    input = Number(input);
  }

  return Number(input.toFixed(2));
};
