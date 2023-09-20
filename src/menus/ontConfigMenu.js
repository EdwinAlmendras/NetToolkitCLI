import inquirer from "inquirer";
import { configureLivebox6, configureOntZteF601 } from "../actions/ontConfigActions.js";

// Definición de opciones de ONT
const ONT_OPTIONS = {
  LIVEBOX_6: "Livebox 6",
  ZTE_F601: "ZTE F601",
  ARCADYAN_FIBRA: "Arcadyan Fibra",
  NOKIA_G010G_P: "Nokia-ONT G-010G",
  BACK: "Back to Main Menu",
};

async function handleOntOption(option) {
  switch (option) {
    case ONT_OPTIONS.LIVEBOX_6:
      await configureLivebox6();
      break;
    case ONT_OPTIONS.ZTE_F601:
      await configureOntZteF601();
      break;
    case ONT_OPTIONS.ARCADYAN_FIBRA:
      // Tu código para Arcadyan Fibra
      break;
    case ONT_OPTIONS.NOKIA_G010G_P:
      // Tu código para ONT G10P
      break;
    case ONT_OPTIONS.BACK:
      console.log("Returning to the main menu...");
      return;
  }
}

export async function ontConfigMenu() {
  const { option } = await inquirer.prompt([
    {
      type: "list",
      name: "option",
      message: "ONT Configuration Menu\nSelect an option:",
      choices: Object.values(ONT_OPTIONS),
    },
  ]);

  await handleOntOption(option);

  // Regresar al menú de configuración de ONT
  ontConfigMenu();
}
