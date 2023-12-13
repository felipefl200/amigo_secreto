export const encryptMatch = (id: string): string => {
  return (
    `${process.env.DEFAULT_TOKEN}${id}` +
    process.env.DEFAULT_TOKEN?.split("").reverse().join("")
  );
};

export const decryptMatch = (match: string): string => {
  let idString: string = match
    .replace(process.env.DEFAULT_TOKEN as string, "")
    .replace(
      process.env.DEFAULT_TOKEN?.split("").reverse().join("") as string,
      ""
    );
  return idString;
};
