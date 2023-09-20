import inquirer from "inquirer";
import browserSingleton from "../BrowserSingleton.js";

const ROUTER_URL = "http://192.168.1.1";
// http://192.168.1.1/index.htm
const options = ["Login"];
export const routerMenu = async (routerPassword) => {
  const { option } = await inquirer.prompt([
    {
      type: "list",
      name: "option",
      message: "Router",
      choices: options,
    },
  ]);

  switch (option) {
    case options[0]:
      await enterToRouter(routerPassword);
      break;
    default:
      console.log("Opción no reconocida");
      break;
  }
  // Vuelve al menú de Flujo Polar
  await routerMenu();
};

async function enterToRouter() {
  const page = browserSingleton.getPage();
  await page.goto(`${ROUTER_URL}/index.htm`);
  // Rellenar la contraseña
  // Esperar hasta que el selector esté disponible
  await page.waitForSelector('input[name="ui_pws"]');
  await page.type('input[name="ui_pws"]', "2Uv9ATka");

  // Hacer clic en el botón de enviar
  await page.click('input[type="submit"]');

  // Esperar a que la página se cargue completamente
  await page.waitForNavigation();
}

// netsh wlan show profile name="MiFibra-4D56-5G" key=clear
