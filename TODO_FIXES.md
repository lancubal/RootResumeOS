~~1. El comando "?" la tabla se rompe por el espaciado. Simplificar sacando la tabla y dejando el listado de comandos~~ [done] Reemplazada la box con un listado plano simple.
~~2. Al comando matrix hacer que sean letras verdes~~ [done] Frames usan `type: "logo"` (emerald-500).
~~3. La primera linea separadora que aparece en la terminal es demasiado larga~~ [done] Reducida a 32 caracteres unicode.
~~4. En mobile la foto y los titulos no entran en el ancho. Pasar la foto arriba y al centro de los titulos y acomodar los titulos para que entren.~~ [done] Header strip mobile con /uses + Download CV; footer fijo con social icons + boton terminal; layout columna centrada; foto agrandada.
5. Agregar al comando "challenge" una explicacion de que el usuario tiene que hacer start y el numero de challenge que quiere hacer.
~~6. Cuando voy a una de las otras paginas y vuelvo. Se esta matando el contenedor de terminal e iniciando uno nuevo?~~ [done] sessionId e historial se persisten en sessionStorage; al volver a la pagina se reutiliza el contenedor existente sin reiniciar.
~~7. Modificar el link a linkedin luna-lancuba-6621491b8~~ [done] Actualizado en config.ts.
~~8. Mejorar el mailto. Contact form — Replace email link with an inline animated form in PresentationPanel that POSTs to a serverless function~~ [done] Formulario inline animado con Resend en /api/contact. El icono de mail toggle el form; muestra estado sending/sent/error.
~~9. Agregar link a CV https://drive.google.com/file/d/1kYkX-PsFY6e3MBcFPWdU6oSWz8t_kd46/view?usp=sharing~~ [done] Actualizado en config.ts.
~~10. El logo del boton "My Projects" esta roto~~ [done] Emoji corrupto reemplazado por 📁.

~~12. Mejorar "Python Demo" con algo mas visual~~ [done] Reescrita demo.py: header box-drawing, bubble sort con barras antes/después, sieve de Eratóstenes en grilla, triángulo de Sierpiński (Pascal mod 2), Fibonacci con barras proporcionales.
~~13. Cambiar el boton de tech stack por algo mejor o definir mejor que muestra.~~ [done] Botón renombrado a "Skills", ejecuta el comando `skills`.
~~14. Skills: Cambiarlo por nuevas categorías.~~ [done] SKILLS reemplazado: Languages (Java/JS/TS/Python/Ruby), Frontend (Angular/Vue/React/Next/Svelte), Backend (SpringBoot/Django/Node), DevOps (Docker/K8s/Jenkins/GitlabCI/Playwright/JUnit), Databases (MySQL/MongoDB), Spoken (Spanish/English C2). `SkillCategory` y `SKILL_CATEGORY_COLORS` actualizados.
~~15. Tambien los separadoresde skills son demasiado anchos~~ [done] Separadores de `skills` reducidos de 44 → 32 chars.
~~16. Agregar mas quotes al comando fortune o buscar una api libre para consultar~~ [done] FORTUNE_QUOTES ampliado de 18 a 37 quotes. Marco de la caja reducido de W=56 a W=40.
~~17. Para los comandos de visualize, los de C tienen dos descripciones. Quedarse con la azul.~~ [done] Removidas las líneas `puts("Description:...")` del código C generado; separador interno reducido de 75 a 32 dashes.
~~18. Los comandos de visualize pathfinder y dfs podrian ser apenitas mas rapidos~~ [done] pathfinder DELAY 100000→55000µs, dfs DELAY 150000→55000µs.
~~19. El comando de visualize life podria ser apenas mas lento~~ [done] DELAY 0.12→0.20s.
~~20. Mandebrot podria tener mas frames~~ [done] STEPS ampliado de 10 a 16 frames, sleep entre frames 0.3→0.25s.
~~21. montecarlo no da el resultado aproximado de pi al finalizar~~ [done] Bloque final usa ASCII (===, pi ~) y agrega sleep(0.5) tras el flush para que el SSE llegue antes del close.
~~22. Se podran agregar colores a los comandos de visualize?~~ [done] Los frames de streaming usan type:'logo' → color emerald-500.
~~23. En help, sacarle el emoji de ojitos al comando matrix y ponerle algo mejor.~~ [done] Descripción cambiada a "Wake up, Neo...".
~~25. En help, cambiar la descripcion del comando challenge.~~ [done] Línea simplificada a "List coding challenges" (sin "(then: start <n>)").
~~26. Cuando se ejecuta el comando challenge, mostrar una descripcion que diga que para iniciar una challenge usar el comando "start" y el numero de challenge~~ [done] El handler ya mostraba el mensaje de instrucción al listar.
27. El comando python no hace nada
28. Para comandos compuestos, por ejemplo visualize. Si no se agregan los argumentos esperados da error de command not found. Para estos casos explicar como se usan el comando ejecutado y dar ejemplos
29. Darle mas onda al layout mobile.
30. El comando ls muestra Desktop, Downloads y Docuemnts. Es correcto esto?
31. el archivo about-me.md deberia estar en el root? (Ahora no se ve cuando se hace ls)
32. Cuando se ejectuta el comando top, mostrar una sugerencia de como ejecutar un proceso en paralelo para probar el uso del sistema
33. Quiza tener dos opciones para ver los proyectos sea redundante.
34. El comando matrix, se acumulan caracteres en la ultima linea y un poco salta el scroll en la terminal mientras ejecuta. Se podria mejorar
35. Modo noche (automatico quiza?)
36. Creo que se rompio el numero de visitas
37. Sumar y ordenar proyectos en Projects y "My Projects"

24. Probar las challenges

1000. Despliegue en AWS
