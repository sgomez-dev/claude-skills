---
description: Gestión completa de campañas publicitarias con 8 agentes especializados en paralelo + PowerPoint
permissions:
  reads: []
  writes: ["*.pptx"]
  commands: []
  network: true
  destructive: false
---

Gestiona y optimiza campañas publicitarias lanzando 8 agentes especializados en paralelo
que investigan mercado, analizan competencia, definen estrategia, perfilan audiencias,
crean copys, estructuran campañas, configuran métricas y optimizan resultados.
Consolida todo en un PowerPoint profesional listo para ejecutar.

Pasos:

1. **Recopilar datos de entrada**
   - Producto/servicio, marca o URL a promocionar: `$ARGUMENTS`
   - Si no se proporcionó, pedirlo antes de continuar
   - Detectar vía web search: sector/industria, competidores directos, plataformas publicitarias relevantes
   - Preguntar al usuario (si no se indicó): objetivo principal (ventas, leads, awareness, descargas, tráfico), presupuesto estimado y mercado geográfico

2. **Anunciar el inicio**
   Comunicar al usuario:
   > "Voy a lanzar los 8 agentes especializados en paralelo para crear tu estrategia completa de campañas publicitarias."
   Listar los 8 agentes que se van a ejecutar.

3. **Lanzar los 8 agentes en paralelo** (usar Task tool / subagentes simultáneos)

   Cada agente debe hacer web search para obtener datos reales y devolver un JSON con `agent`, `score` (0-100), `hallazgos`, `recomendaciones` y métricas específicas de su área.

   **Agente 1 — Market Researcher** · Investigación de mercado y tendencias
   Investigar: tamaño del mercado, tendencias actuales del sector, estacionalidad de la demanda,
   comportamiento del consumidor, canales de compra preferidos, pain points del público objetivo,
   keywords con mayor volumen de búsqueda, hashtags trending relacionados, demanda por región.
   Identificar las 3 oportunidades de mercado más relevantes para la campaña.

   **Agente 2 — Competitive Scraper** · Análisis de anuncios y estrategias de competencia
   Buscar competidores directos e indirectos. Analizar vía web search: anuncios activos en Meta Ad Library
   y Google Ads Transparency Center, copys que utilizan, formatos creativos (imagen, video, carrusel),
   landing pages de destino, ofertas y promociones actuales, frecuencia de publicación,
   engagement estimado, posicionamiento de precio. Identificar los 5 anuncios de mejor rendimiento
   aparente de la competencia y explicar por qué funcionan.

   **Agente 3 — Audience Profiler** · Segmentación y perfilamiento de público objetivo
   Construir 3-4 buyer personas detallados: demografía (edad, género, ubicación, ingreso),
   psicografía (intereses, valores, estilo de vida, motivaciones de compra), comportamiento digital
   (plataformas que usan, horarios de actividad, tipo de contenido que consumen, dispositivos),
   objeciones de compra y triggers de conversión. Para cada persona definir: segmento de audiencia
   para Meta Ads (intereses, lookalikes), segmento para Google Ads (keywords, in-market audiences),
   y mensajes clave que resonarán con cada perfil.

   **Agente 4 — Campaign Strategist** · Estrategia integral de campañas
   Diseñar la estrategia completa: objetivo por fase del funnel (TOFU awareness, MOFU consideración,
   BOFU conversión), selección de plataformas (Google Search, Display, YouTube, Meta, TikTok, LinkedIn)
   con justificación, distribución de presupuesto por plataforma y fase, calendario de lanzamiento
   (semana a semana por 8 semanas), estructura de campañas por plataforma (campañas → ad sets → ads),
   estrategia de bidding recomendada (CPA target, ROAS target, maximize conversions),
   presupuesto diario recomendado por campaña. Incluir matriz de riesgo y plan de contingencia.

   **Agente 5 — Creative Director** · Copywriting y dirección creativa de anuncios
   Generar para cada plataforma y fase del funnel: headlines (5 variaciones), descriptions/body text
   (3 variaciones), CTAs específicos, extensiones de anuncio (sitelinks, callouts, snippets para Google),
   scripts para video ads de 15s y 30s, conceptos creativos para imágenes (describir composición,
   colores, elementos clave), copy para retargeting diferenciado (visitaron web, abandonaron carrito,
   interactuaron pero no convirtieron). Toda la creatividad debe seguir framework AIDA
   (Atención, Interés, Deseo, Acción). Incluir variaciones para test A/B.

   **Agente 6 — Ad Launcher** · Estructura técnica lista para implementar
   Crear la estructura completa lista para subir a cada plataforma: nomenclatura de campañas
   (naming convention estándar), configuración de ad sets (segmentación, placement, schedule,
   budget, optimization goal), specs técnicos de creativos necesarios (dimensiones, peso, formatos),
   UTM parameters para cada anuncio, setup de píxeles y eventos de conversión necesarios,
   checklist de pre-lanzamiento (píxel verificado, audiencias creadas, billing configurado,
   creative assets listos, landing pages live). Generar timeline de implementación día por día
   para la primera semana.

   **Agente 7 — Analytics Architect** · Métricas, tracking y atribución
   Diseñar el framework de medición completo: KPIs primarios y secundarios por fase del funnel,
   setup de tracking recomendado (Google Analytics 4, Meta Pixel, Google Tag Manager, conversiones offline),
   modelo de atribución recomendado con justificación, dashboard template con las métricas clave
   (CPM, CPC, CTR, CPA, ROAS, frequency, reach, conversion rate por etapa),
   benchmarks del sector para cada KPI, alertas automáticas sugeridas (ej: CPA > umbral,
   frequency > 3, CTR < benchmark), calendario de reporteo (diario, semanal, mensual).

   **Agente 8 — Optimization Engine** · Optimización continua y escalamiento
   Definir: reglas de optimización automáticas (pausar ads con CTR < X después de Y impresiones,
   escalar ads con ROAS > Z), plan de testing (A/B de creativos semana 1-2, A/B de audiencias semana 3-4,
   A/B de landing pages semana 5-6), criterios de decisión para escalar o pausar campañas,
   estrategia de creative fatigue (cuándo rotar, señales de fatiga, pipeline de creativos),
   playbook de optimización semanal paso a paso, estrategia de escalamiento
   (vertical: aumentar budget vs horizontal: nuevas audiencias/plataformas),
   predicción de resultados a 30/60/90 días basada en benchmarks del sector.

4. **Consolidar resultados**
   - Calcular score global de preparación de campaña (promedio de los 8 scores)
   - Identificar Top 3 oportunidades de mayor impacto
   - Construir roadmap de 8 semanas: Semana 1-2 (setup y lanzamiento), Semana 3-4 (optimización inicial), Semana 5-6 (escalamiento), Semana 7-8 (consolidación y reporte)
   - Estimar resultados esperados basados en benchmarks (impresiones, clics, conversiones, ROAS)

5. **Generar el PowerPoint**
   Crear deck profesional con pptxgenjs con la siguiente estructura:

   | # | Slide | Contenido clave |
   |---|-------|-----------------|
   | 1 | Portada | Nombre marca/producto, "Estrategia de Campañas Publicitarias", fecha |
   | 2 | Resumen Ejecutivo | Score global, objetivo, presupuesto, resultados estimados, top 3 oportunidades |
   | 3 | Dashboard de Scores | Gráfico comparativo con los 8 scores (semáforo: verde >70, amarillo 40-70, rojo <40) |
   | 4 | Market Researcher | Tamaño mercado, tendencias clave, oportunidades top 3 |
   | 5 | Competitive Scraper | Mapa competitivo, top 5 anuncios de competencia, gaps a explotar |
   | 6 | Audience Profiler | Buyer personas visuales, segmentos por plataforma, mensajes clave |
   | 7 | Campaign Strategist | Funnel con plataformas, distribución presupuesto (gráfico), calendario 8 semanas |
   | 8 | Creative Director | Mejores headlines, conceptos creativos, framework A/B |
   | 9 | Ad Launcher | Estructura de campañas (tree view), checklist pre-lanzamiento, timeline semana 1 |
   | 10 | Analytics Architect | Dashboard mockup con KPIs, benchmarks del sector, modelo atribución |
   | 11 | Optimization Engine | Reglas de optimización, plan de testing, proyección 30/60/90 días |
   | 12 | Roadmap 8 Semanas | Timeline visual con 4 fases: Setup → Optimización → Escalamiento → Consolidación |
   | 13 | Presupuesto y ROI | Tabla de inversión por plataforma, ROAS estimado, proyección de resultados |
   | 14 | Próximos Pasos | Top 5 acciones inmediatas con responsable, plazo y prioridad |

   **Diseño:**
   - Paleta oscura profesional: fondo `#0F172A`, acento `#F59E0B` (ámbar para ads), texto `#F8FAFC`, highlights `#10B981`
   - Portada con gradiente y nombre de marca prominente
   - Cada slide de agente: score en círculo de color, bullets concisos (máx 5), iconos
   - Dashboard: tabla o chart con colores semáforo
   - Gráficos de distribución de presupuesto con donut chart
   - Roadmap: timeline horizontal 4 columnas (4 fases de 2 semanas)
   - Nombre archivo: `campaign_[marca]_[YYYY-MM-DD].pptx`

6. **Entregar resultados**
   - Guardar el .pptx en el directorio de trabajo
   - Presentar el archivo al usuario
   - Dar resumen en 3-4 líneas: score global, oportunidad #1, inversión recomendada, ROAS estimado y primera acción a ejecutar

**Notas:**
- Si el producto/marca tiene poca presencia online, basar el análisis en competidores del sector e indicarlo
- Priorizar siempre quick wins de alto impacto en las primeras 2 semanas
- Los buyer personas deben ser específicos al nicho, no genéricos
- Los copys deben estar en el idioma del mercado objetivo
- Los benchmarks deben ser del sector específico, no promedios generales
- El presupuesto debe distribuirse con lógica 70/20/10 (probado/experimental/nuevo)

$ARGUMENTS
