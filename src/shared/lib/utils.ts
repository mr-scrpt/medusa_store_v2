"use client";

export const cleanObject = (obj: any) => {
  const newObj = {};
  for (const key in obj) {
    if (obj[key] !== null && obj[key] !== undefined) {
      newObj[key] = obj[key];
    }
  }
  return newObj;
};
