# La Vecindad · Experiencia 3D
Una visita en primera persona a una **recreación artística, no oficial** de la vecindad de *El Chavo del 8*, hecha con **Three.js** y JavaScript moderno.

## Plano maestro de tres patios — Versión de maqueta (octubre 2026)

Tomando las **tres imágenes aportadas por el usuario** como guía de relación entre volúmenes, rehíce la distribución. Ya no aparecen 14, 71 y 72 en la misma pared:

- **Patio 1**: escaleras al 23 a la izquierda; puerta 14 al fondo; puerta 71 a la derecha de 14; **puerta 72 sobre el costado derecho, con fachada azul**. Su interior completo fue rotado/trasladado al lateral derecho sin perder los muebles. Barril en el patio.
- **Patio 2**: patio separado con fuente, conectado por corredor en L; se puede explorar a pie.
- **Patio 3**: recinto independiente conectado desde el patio 2 mediante un corredor; viviendas 15, 16, 8, 87 representadas como fachadas (sin interiores).
- El mapa tiene botones para visitar los tres patios y muestra la casa 72 en el lateral.
- Las proporciones son **interpretativas**, derivadas del croquis del usuario, la maqueta y las imágenes del modelo 3D; no son medidas oficiales de un decorado de Televisa.

## Plano y recorrido corregido (octubre 2026)

La app **ya no ubica los patios uno detrás del otro como una plaza continua**. Ahora la visita recorre:

1. **Patio 1 — Patio clásico (1975)**: barril, escaleras al apartamento 23, lavadero, plantas, puerta 14 de Doña Florinda, puerta 71 de Doña Clotilde, puerta 72 de Don Ramón y portón.
2. **Pasillo cubierto entre 71 y 72**: entrar al corredor, caminar hacia el fondo hasta la pared y girar **a la derecha**. El giro evita la visión directa del segundo patio desde la puerta de entrada.
3. **Patio 2 — Fuente**: patio físicamente independiente, desplazado hacia un costado, con otros departamentos y galería alta inspirados en el decorado televisivo.
4. **Casas visitables**: se conserva el acceso en primera persona a 14, 71 y 72; se pueden seleccionar en el mapa.
5. **Tercer patio**: la serie lo menciona, pero las referencias no proporcionan un plano completo y consistente. No se presenta como reconstrucción exacta ni como estancia explorada.

**Importante:** el giro y las proporciones del pasillo son un recurso de diseño interpretativo para materializar la separación entre patios. No son un plano técnico original de Televisa. El conjunto evolucionó con las temporadas, y los interiores también variaron.

### Cómo comprobarlo
- Desde el patio principal, busca el corredor **entre los números 71 y 72**.
- Camina hacia el fondo y gira a la derecha; solo entonces se revela el **patio 2 con la fuente**.
- Pulsa **M** para ver el nuevo plano esquemático y usar los botones de navegación al Patio 1 o Patio 2.
- Pulsa **R** para recentrar la vista al patio original.
- Entra en las viviendas 14, 71 y 72 atravesando sus puertas.

### Referencias usadas
- [Blog de Chespirito — La Vecindad (segunda parte)](https://blog.chespirito.com/la_vecindad_segunda-parte/)
- [El Chavo Wiki — Primer patio](https://elchavo.fandom.com/es/wiki/Primer_patio)
- [El Chavo Wiki — Segundo patio](https://elchavo.fandom.com/es/wiki/Segundo_patio)

## ¿Qué hay?
- Patio principal con puertas **14, 71, 72 y 23**, escalera, plantas, lavadero y barril.
- Pasillo cubierto con giro a la derecha que conecta con el **segundo patio independiente con fuente**.
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
