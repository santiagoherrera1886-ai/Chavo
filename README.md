# La Vecindad · Experiencia 3D
Una visita en primera persona a una **recreación artística, no oficial** de la vecindad de *El Chavo del 8*, hecha con **Three.js** y JavaScript moderno.

## ¿Qué hay?
- Patio principal con puertas **14, 71, 72 y 23**, escalera, plantas, lavadero y barril.
- Pasillo transitable que conduce al **segundo patio con fuente**.
- Escenario 3D en tiempo real: geometrías modeladas, materiales con texturas procedurales, sombras, día y noche.
- Movimiento con **WASD / flechas**, mouse para mirar, **Shift** para acelerar, **E** para explorar, **M** para el mapa y **Esc** para salir de la captura del mouse.
- En móviles: control táctil tipo joystick y vista deslizable.
- Mapa de teletransporte, ocho fichas de descubrimiento, visita guiada y capturas PNG.

## Puesta en marcha
No necesita instalación. Es una app estática y no utiliza ningún token, base de datos ni backend.

Para verla localmente abre la carpeta con un servidor web (los módulos de JavaScript no funcionan desde `file://`):

```bash
python3 -m http.server 4173
```

Entra a `http://localhost:4173`. Requiere Internet para cargar `three.module.js` desde jsDelivr y las tipografías de Google.

## Despliegue en Vercel
Importa este repositorio en un proyecto de Vercel; usa **Framework Preset: Other**. No se necesita comando de build; se sirve `index.html` desde la raíz. Cada commit sobre `main` puede disparar un nuevo despliegue si conectas GitHub.

## Casas e interiores visitables
- **14 — Doña Florinda y Quico**: sala con muebles de época, comedor, telas florales, aparador, ventanas y cuadros.
- **71 — Doña Clotilde**: interiores clásicos con sillones y mobiliario antiguo, recreados artísticamente por las pocas tomas disponibles.
- **72 — Don Ramón y la Chilindrina**: paredes verde menta, mantel verde cuadriculado, dos sillones reparados con bloques, mesa, televisor de época, fotografías, banderines, calendario de 1976, guitarra, ventana al pasillo y alcoba con cama y ropero.
- Acércate a una puerta para que se abra y **entra caminando**; también puedes elegir el apartamento en el mapa para llegar directamente al interior.
- El **23**, por las escaleras, conserva la fachada. Su interior no está abierto en esta versión.

## Fuentes y alcance
Las decisiones se basan en la fotografía de referencia aportada por el usuario y en descripciones del set:
- https://blog.chespirito.com/la_vecindad_segunda-parte/
- https://www.lasestrellas.tv/programas/el-chavo/don-ramon-hace-la-fiesta-de-la-amistad-en-su-casa-video
- https://elchavo.fandom.com/es/wiki/Vecindad

**Importante**: no existió un registro fotográfico consistente de todos los decorados de los primeros años; algunos colores y objetos cambiaban según temporada. Por eso esta es una interpretación artesanal y navegable con Three.js, no un gemelo digital ni un escaneo fotorrealista del decorado original. No incluye fotos de la serie ni archivos audiovisuales de terceros en el sitio.

## Notas de fidelidad
Se trata de una **interpretación 3D hecha a mano con geometría procedural**, no de un escaneo 3D ni una reproducción fotogramétrica exacta del set. La distribución y los detalles están inspirados en lugares de la serie. Los departamentos 14, 71 y 72 contienen interiores visitables; el departamento 23 mantiene únicamente la fachada. Las fichas informativas siguen disponibles al explorar cada punto. No incluye voces, música, clips ni otros materiales audiovisuales licenciados.

Proyecto creado para la exploración nostálgica y sin afiliación oficial con los titulares de la obra original.
