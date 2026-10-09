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

## Notas de fidelidad
Se trata de una **interpretación 3D hecha a mano con geometría procedural**, no de un escaneo 3D ni una reproducción fotogramétrica exacta del set. La distribución y los detalles están inspirados en lugares de la serie. Las viviendas no contienen interiores explorables; al acercarte se muestran fichas informativas. No incluye voces, música, clips ni otros materiales audiovisuales licenciados.

Proyecto creado para la exploración nostálgica y sin afiliación oficial con los titulares de la obra original.
