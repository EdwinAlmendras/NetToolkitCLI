import inquirer from "inquirer";
import { mainMenu } from "../index.js";
// index.js
import browserSingleton from "../BrowserSingleton.js";
import {
  goToGoogle,
  loginPolar,
  getInfoOrder,
  getOrdersDay,
} from "../actions/polarActions.js";
import { askQuestion } from "../utils/askQuestion.js";

const options = [
  "GO TO GOOGLE",
  "OBTENER ORDENES DEL DIA + PASSWORDS",
  "OBTENER INFO ORDEN",
  "REALZIAR PRUEBAS HIT",
  "Volver ⬅️",
];

export const polarMenu = async () => {
  await browserSingleton.initialize();
  await loginPolar();
  const { option } = await inquirer.prompt([
    {
      type: "list",
      name: "option",
      message: "Polar ❄️",
      choices: options,
    },
  ]);

  switch (option) {
    case options[0]:
      await goToGoogle();
      break;
    case options[1]:
      const ordenes = await getOrdersDay();
      console.log("ordenes", ordenes);

    case options[2]:
      const codOrden = await askQuestion("Introduce el codigo de la orden: ");
      await getInfoOrder(codOrden);
      break;
    case options[3]:
      // Vuelve al menú principal
      await mainMenu();
      return;
    default:
      console.log("Opción no reconocida");
      break;
  }
  // Vuelve al menú de Flujo Polar
  await polarMenu();
};
