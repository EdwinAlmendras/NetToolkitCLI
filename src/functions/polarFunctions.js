
import {  POLAR_PAGE } from "../utils/constants.js";


// Navegar a la página de detalles de la orden
export const navigateToOrderPage = async (page, codOrden) => {
    await page.goto(`${POLAR_PAGE}DetalleOrden?codigoOt=${codOrden}`, {
      waitUntil: "networkidle0",
    });
  };
  
  // Extraer información primaria de la orden
  export const extractPrimaryOrderInfo = async (page) => {
    const selectors = {
      id: ".codigo",
      marca: ".marcaOt",
      fecha: ".dia",
      inicio: ".hora-asignacion",
      direccion: ".direccion",
      tipoOrden: ".tipoOt",
      segmento: ".segment",
    };
  
    const orderDetails = {};
  
    for (const [key, selector] of Object.entries(selectors)) {
      orderDetails[key] = await page.$eval(selector, (el) => el.textContent);
    }
  
    return orderDetails;
  };
  
  // Extraer información adicional de la orden
  export const extractAdditionalOrderInfo = async (page) => {
    await page.waitForSelector("#ico_instalacion");
    await page.evaluate(() => {
        document.querySelector("#ico_instalacion").click();
    })
    
    await page.waitForFunction(() => {
        const h6Elements = document.querySelectorAll(
          "h6.mB-0.pX-15.pY-10.bg-light.fw-400.d-flex.justify-content-between.align-items-center"
        );
        for (const h6 of h6Elements) {
          if (h6.textContent.includes("Datos de Red")) {
            return true;
          }
        }
        return false;
      });
  
    return await page.evaluate(() => {
      const mapping = {
        "Paquete contratado:": "contrato",
        "ONT password:": "ontPassword",
        "CTO:": "cto",
        "CTO dirección:": "ctoDireccion",
        "Procedimiento Reutilización:": "reutilizar",
        "Puerto CTO:": "puertoCto",
        "Tipo de Orden:": "tipoDeOrden",
        "IUA:": "iua",
      };
  
      const details = {};
      const listItems = document.querySelectorAll("li.list-group-item");
  
      listItems.forEach((item) => {
        const text = item.textContent.trim();
        const key = Object.keys(mapping).find((k) => text.includes(k));
        if (key) {
          details[mapping[key]] = text.split(": ")[1];
        }
      });
  
      return details;
    });
  };
  