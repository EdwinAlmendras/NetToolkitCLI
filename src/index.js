import inquirer from "inquirer";
import browserSingleton from "./BrowserSingleton.js";
import { routerMenu, polarMenu, ontConfigMenu } from "./menus/index.js";
import { askQuestion } from "./utils/askQuestion.js";

// Definición de acciones
const ACTIONS = {
  CONFIGURE_ONT: "Configurar Password Ont 🔐",
  GENERATE_PART_POSTS: "Generar parte de postes 📋",
  POLAR: "Polar ❄️",
  ROUTER: "Router 🌐",
  EXIT: "Salir 🚪",
};

// SHOW METRICS 

async function handleAction(action) {
  switch (action) {
    case ACTIONS.CONFIGURE_ONT:
      await ontConfigMenu();
      break;
    case ACTIONS.POLAR:
      await polarMenu();
      return;
    case ACTIONS.ROUTER:
      const routerPassword = await askQuestion("Write the router password: ");
      await routerMenu(routerPassword);
      return;
    case ACTIONS.EXIT:
      console.log("Exiting the program. Goodbye!");
      return;
  }
}

export async function mainMenu() {
  await browserSingleton.initialize();

  const { action } = await inquirer.prompt([
    {
      type: "list",
      name: "action",
      message: "TOOLS ROUTER V1\nWhat would you like to do?",
      choices: Object.values(ACTIONS),
    },
  ]);

  await handleAction(action);

  // Return to the main menu
  mainMenu();
}

// Start the program
mainMenu();
