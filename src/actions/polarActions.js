// browser.js
import browserSingleton from "../BrowserSingleton.js";
import { navigateToOrderPage, extractPrimaryOrderInfo, extractAdditionalOrderInfo } from '../functions/polarFunctions.js';
import { POLAR_USER, POLAR_PASSWORD, POLAR_PAGE } from "../utils/constants.js";

// Navegar a Google
export const goToGoogle = async () => {
  const page = browserSingleton.getPage();
  await page.goto("https://www.google.com");
};

// Iniciar sesión en Polar
export const loginPolar = async () => {
  const page = browserSingleton.getPage();
  await page.goto(POLAR_PAGE);
  await page.type("#usuario", POLAR_USER);
  await page.type("#password", POLAR_PASSWORD);
  await page.click("#bt_login");
  await page.waitForNavigation();
  console.log("Logged In");
};

// Obtener órdenes del día especificado
export const fetchOrders = async (day) => {
  const page = browserSingleton.getPage();
  await navigateToDay(page, day);
  await page.waitForSelector(".item-ot-listado");
  return await extractOrderInfo(page);
};

// Navegar al día especificado en el calendario
const navigateToDay = async (page, day) => {
  await page.click("#calendar-button");
  await page.waitForSelector(".datepicker");
  const dayElement = await page.$x(`//td[contains(@class, 'day') and not(contains(@class, 'old')) and not(contains(@class, 'new')) and contains(text(), '${day}')]`);
  if (dayElement.length > 0) {
    await dayElement[0].click();
    await page.waitForSelector("#ordenes-list");
  } else {
    console.log(`El día ${day} no se encontró en el datepicker.`);
  }
};

// Extraer información de las órdenes
const extractOrderInfo = async (page) => {
  return await page.$$eval("#ordenes-list .row.mbm", (rows) => {
    return rows.map((row) => {
      const codigo = row.querySelector(".codigo")?.innerText.trim();
      const direccion = row.querySelector(".direccion")?.innerText.trim();
      const tipo = row.querySelector(".tipo-ot")?.innerText.trim();
      const horaAsignacion = row.querySelector(".hora-asignacion")?.innerText.trim();
      return { codigo, direccion, tipo, horaAsignacion };
    });
  });
};

// Obtener información detallada de una orden específica
export const getInfoOrder = async (codOrden) => {
  const page = browserSingleton.getPage();
  const browser = browserSingleton.getBrowser();

  // Navegar a la página de detalles de la orden
  await navigateToOrderPage(page, codOrden);

  // Extraer información primaria de la orden
  const primaryInfo = await extractPrimaryOrderInfo(page);

  // Extraer información adicional de la orden
  const additionalInfo = await extractAdditionalOrderInfo(page);

  // Combinar la información primaria y adicional en un solo objeto
  const completeOrderInfo = { ...primaryInfo, ...additionalInfo };

  console.log(completeOrderInfo);
  return Promise.resolve(completeOrderInfo);
};


// Obtener órdenes del día actual
export const getOrdersDay = async () => {
  let ordenesInfo = [];
  const ordenes = await fetchOrders(14);
  for await (const orden of ordenes) {
    const info = await getInfoOrder(orden.codigo);
    ordenesInfo.push(info);
  }
  return Promise.resolve(ordenesInfo);
};