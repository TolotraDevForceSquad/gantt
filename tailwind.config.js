
const { nextui } = require("@nextui-org/react");

export const content = [
  "./index.html",
  "./src/**/*.{vue,js,ts,jsx,tsx}",

  "./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}"
];
export const theme = {
  extend: {},
};
export const plugins = [nextui()];