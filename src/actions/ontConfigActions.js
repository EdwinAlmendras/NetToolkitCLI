// Funciones de utilidad para la configuración de ONT
import { mainMenu } from "../index.js"; // Asegúrate de importar mainMenu desde su ubicación correcta
import axios from "axios";
import inquirer from "inquirer";
import browserSingleton from "../BrowserSingleton.js";
import { askQuestion } from "../utils/askQuestion.js";

// Configurar la contraseña para ONT L6
export async function configureLivebox6() {
  try {
    const { password } = await inquirer.prompt([
      {
        type: "password",
        name: "password",
        message: "Please enter the ONT password:",
        mask: "*",
      },
    ]);

    const url = "http://192.168.1.1/sysbus/NeMo/Intf/veip0:setFirstParameter";
    const headers = {
      Accept: "text/javascript",
      "Accept-Language": "es-419,es;q=0.9",
      Connection: "keep-alive",
      "Content-type": "application/x-sah-ws-1-call+json; charset=UTF-8",
    };
    const data = {
      parameters: {
        name: "RegistrationID",
        value: password,
      },
    };

    const response = await axios.post(url, data, { headers });
    console.log("Password configured successfully:", response.data);
  } catch (error) {
    console.error("Error configuring password:", error);
  }

  mainMenu();
}

export async function configureOntZteF601() {
  const passwordOnt = await askQuestion("Escrba la password ONT: ");
  // Iniciar el navegador y abrir una nueva página
  const page = browserSingleton.getPage();

  // Navegar a la página de inicio del router
  await page.goto("http://192.168.1.1/");

  // Esperar a que los campos de "Username" y "Password" estén disponibles
  await page.waitForSelector("#Frm_Username");
  await page.waitForSelector("#Frm_Password");

  // Rellenar los campos de "Username" y "Password"
  await page.type("#Frm_Username", "admin");
  await page.type("#Frm_Password", "admin");

  // Hacer clic en el botón "Login"
  await page.click("#LoginId");

  // Aquí puedes continuar con el resto de las acciones que necesitas realizar en la página
  // Navegar a la sección "Network"
  // Suponiendo que el elemento HTML que representa la opción "Network" tiene un id "mmNet"

  // Espera a que el iframe esté cargado
  await page.waitForSelector("iframe");

  // Obtén el handle del iframe
  const topFrameHandle = await page.$("#topFrame");
  const topFrame = await topFrameHandle.contentFrame();

  // Ahora, dentro del iframe, espera y haz clic en el elemento
  await topFrame.waitForSelector("#mmNet");
  await topFrame.click("#mmNet");

  const mainFrameHandle = await page.$("#mainFrame");
  const mainFrame = await mainFrameHandle.contentFrame();

  // Espera a que el iframe y los elementos estén completamente cargados
  await mainFrame.waitForSelector("#Frm_Pwd");
  await mainFrame.waitForSelector("#Frm_Real_Password");

  await mainFrame.click("#Frm_OxEnable");

  // Encuentra y escribe en el campo de texto visible
  const passwordField = await mainFrame.$("#Frm_Pwd");
  if (passwordField) {
    await passwordField.focus();
    // Simula los eventos del teclado para "escribir" la contraseña
    await page.keyboard.type(passwordOnt);
  } else {
    console.log("Campo de contraseña no encontrado.");
    return;
  }
  // Hacer clic en el botón de enviar
  await mainFrame.click("#Btn_Submit");
  // Cerrar el navegador
}
