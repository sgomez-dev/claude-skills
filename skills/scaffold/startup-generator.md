---
description: Generador completo de startup/SaaS — 10 agentes especializados en paralelo + PowerPoint con plan de negocio
permissions:
  reads: []
  writes: ["*.pptx"]
  commands: []
  network: true
  destructive: false
---

Genera un plan completo de startup/SaaS lanzando 10 agentes especializados en paralelo
que validan mercado, diseñan producto, definen arquitectura técnica, modelan financieros,
planifican go-to-market, analizan competencia, diseñan pricing, evalúan legal/compliance,
crean estrategia de fundraising y definen métricas clave.
Consolida todo en un PowerPoint profesional listo para presentar a inversores o cofounders.

Pasos:

1. **Recopilar datos de entrada**
   - Idea / descripción del producto: `$ARGUMENTS`
   - Si no se proporcionó idea, pedirla antes de continuar
   - Extraer del input: sector/industria, público objetivo estimado, problema que resuelve
   - Preguntar opcionalmente: ¿presupuesto inicial estimado? ¿equipo actual? ¿modelo preferido (B2B/B2C/B2B2C)?
   - Si el usuario no responde a las opcionales, inferir defaults razonables y continuar

2. **Anunciar el inicio**
   Comunicar al usuario:
   > "Voy a lanzar 10 agentes especializados en paralelo para generar tu plan de startup/SaaS completo. Al finalizar, recibirás un PowerPoint profesional con todo el análisis."
   Listar los 10 agentes que se van a ejecutar.

3. **Lanzar los 10 agentes en paralelo** (usar Task tool / subagentes simultáneos)

   Cada agente debe hacer web search para obtener datos reales del mercado y devolver un JSON con `agent`, `score` (0-100 = viabilidad/fortaleza en esa área), `hallazgos`, `recomendaciones` y datos específicos de su área.

   **Agente 1 — Market Validator** · Validación de mercado y tamaño de oportunidad
   Investigar: TAM/SAM/SOM del mercado objetivo, tendencias de crecimiento del sector,
   datos de mercado recientes, demanda existente (búsquedas, foros, redes sociales),
   problemas reales que reportan los usuarios en el nicho, willingness to pay estimado.
   Buscar datos de mercado en fuentes como Statista, CB Insights, Crunchbase, informes del sector.
   Devolver: `tam`, `sam`, `som`, `cagr`, `demanda_validada` (bool), `evidencias` (lista de señales de mercado).

   **Agente 2 — Competitive Intelligence** · Análisis competitivo profundo
   Identificar 5-8 competidores directos e indirectos via web search. Para cada uno analizar:
   modelo de negocio, pricing, funding recibido, fortalezas, debilidades, reviews de usuarios,
   features principales, posicionamiento. Crear mapa de posicionamiento (precio vs funcionalidad).
   Identificar gaps de mercado y oportunidad de diferenciación.
   Devolver: `competidores` (lista con detalles), `gaps_mercado`, `ventaja_competitiva_sugerida`.

   **Agente 3 — Product Architect** · Diseño de producto y MVP
   Definir: propuesta de valor (framework Jobs-to-be-done), user personas (2-3),
   features del MVP (must-have vs nice-to-have vs v2), user journey principal,
   métricas de éxito del producto. Aplicar principio de Pareto: 20% de features que
   resuelven 80% del problema. Estimar tiempo de desarrollo del MVP.
   Devolver: `propuesta_valor`, `personas`, `mvp_features`, `v2_features`, `tiempo_mvp_semanas`.

   **Agente 4 — Tech Strategist** · Arquitectura técnica y stack recomendado
   Recomendar: stack tecnológico óptimo (frontend, backend, DB, infraestructura, APIs),
   justificando cada elección por velocidad de desarrollo, escalabilidad y coste.
   Definir arquitectura (monolito → microservicios path), integraciones clave,
   estrategia de datos, requisitos de seguridad, plan de escalabilidad.
   Estimar costes de infraestructura Mes 1, Mes 6 y Mes 12.
   Devolver: `stack`, `arquitectura`, `costes_infra`, `integraciones_clave`, `deuda_tecnica_riesgos`.

   **Agente 5 — Financial Modeler** · Modelo financiero y unit economics
   Construir: modelo de ingresos proyectado a 12 y 24 meses, estructura de costes
   (desarrollo, infra, marketing, equipo, operaciones), unit economics
   (CAC, LTV, LTV/CAC ratio, payback period, churn estimado, MRR/ARR proyectado).
   Definir burn rate mensual y runway según capital inicial.
   Calcular break-even point. Escenarios: conservador, base y optimista.
   Devolver: `mrr_proyectado_12m`, `arr_proyectado_24m`, `cac`, `ltv`, `burn_rate`, `break_even_meses`, `escenarios`.

   **Agente 6 — Go-to-Market Strategist** · Estrategia de lanzamiento y adquisición
   Diseñar: estrategia de lanzamiento (pre-launch, launch, post-launch),
   canales de adquisición priorizados por CAC y escalabilidad,
   funnel completo (awareness → activation → revenue → retention → referral),
   estrategia de early adopters, partnership opportunities, community building plan.
   Plan concreto semana a semana para los primeros 90 días post-lanzamiento.
   Devolver: `canales_priorizados`, `plan_lanzamiento`, `plan_90_dias`, `partnerships`, `viral_loops`.

   **Agente 7 — Pricing Strategist** · Modelo de pricing y monetización
   Analizar pricing de competidores. Definir: modelo de monetización óptimo
   (freemium, free trial, usage-based, tiered, enterprise, hybrid),
   tiers de pricing con features por tier, precio por tier,
   estrategia de upsell/cross-sell, annual vs monthly incentivo.
   Calcular precio óptimo basado en valor percibido y willingness-to-pay del mercado.
   Devolver: `modelo_monetizacion`, `tiers`, `precio_recomendado`, `estrategia_upsell`, `revenue_por_tier`.

   **Agente 8 — Legal & Compliance Advisor** · Marco legal y regulatorio
   Identificar: estructura societaria recomendada según mercado objetivo,
   regulaciones aplicables (GDPR, CCPA, PCI-DSS, SOC2 si aplica),
   términos de servicio y políticas de privacidad necesarias,
   protección de propiedad intelectual (marca, patentes si aplica),
   contratos clave necesarios (cofounders, empleados, clientes).
   Estimar costes legales iniciales.
   Devolver: `estructura_legal`, `regulaciones`, `documentos_necesarios`, `costes_legales`, `riesgos_legales`.

   **Agente 9 — Fundraising Advisor** · Estrategia de financiación
   Evaluar: necesidad de financiación vs bootstrapping, ronda recomendada (pre-seed/seed/series A),
   monto sugerido y uso de fondos, valoración estimada (basada en comparables del sector),
   tipos de inversores target (angels, VCs, aceleradoras), pitch deck outline,
   métricas que los inversores esperan ver, timeline de fundraising.
   Buscar aceleradoras e inversores relevantes para el sector.
   Devolver: `ronda_recomendada`, `monto`, `valoracion_estimada`, `uso_fondos`, `inversores_target`, `metricas_clave`.

   **Agente 10 — Metrics & KPI Designer** · Framework de métricas y OKRs
   Definir: North Star Metric, métricas pirata (AARRR) específicas para el producto,
   KPIs por área (producto, growth, revenue, engineering), OKRs para Q1 y Q2,
   dashboards recomendados, herramientas de analytics sugeridas,
   alertas y thresholds críticos, cadencia de revisión.
   Devolver: `north_star`, `metricas_aarrr`, `kpis`, `okrs_q1`, `okrs_q2`, `herramientas`.

4. **Consolidar resultados**
   - Calcular **Viability Score** global (promedio ponderado de los 10 scores: Market Validator y Financial Modeler pesan x1.5)
   - Clasificar viabilidad: >75 = "Alta viabilidad", 50-75 = "Viabilidad moderada — requiere ajustes", <50 = "Pivotar o replantear"
   - Identificar Top 3 fortalezas y Top 3 riesgos críticos
   - Construir roadmap de 6 meses:
     - Mes 1: Validación y setup (legal, equipo, herramientas)
     - Mes 2-3: Desarrollo MVP
     - Mes 4: Beta cerrada + iteración
     - Mes 5: Lanzamiento público + go-to-market
     - Mes 6: Optimización + métricas + decisión de fundraising

5. **Generar el PowerPoint**
   Crear deck profesional con pptxgenjs con la siguiente estructura:

   | # | Slide | Contenido clave |
   |---|-------|-----------------|
   | 1 | Portada | Nombre del producto/startup, tagline generado, "Startup Blueprint", fecha |
   | 2 | El Problema | Problema identificado, magnitud, dolor del usuario, datos de mercado |
   | 3 | La Solución | Propuesta de valor, cómo funciona (3 pasos), diferenciación clave |
   | 4 | Viability Score | Score global visual, semáforo de los 10 agentes, top fortalezas y riesgos |
   | 5 | Tamaño de Mercado | TAM/SAM/SOM visual (círculos concéntricos), CAGR, tendencias |
   | 6 | Análisis Competitivo | Mapa de posicionamiento, gaps identificados, ventaja competitiva |
   | 7 | Producto & MVP | User personas, features MVP (tabla must-have/nice-to-have), timeline desarrollo |
   | 8 | Arquitectura Técnica | Stack visual, diagrama arquitectura simplificado, costes infra |
   | 9 | Modelo de Negocio | Pricing tiers (tabla visual), modelo de monetización, unit economics |
   | 10 | Proyección Financiera | MRR/ARR a 24 meses (gráfico), burn rate, break-even, 3 escenarios |
   | 11 | Go-to-Market | Funnel AARRR, canales priorizados, plan 90 días |
   | 12 | Fundraising | Ronda recomendada, valoración, uso de fondos (pie chart), inversores target |
   | 13 | Legal & Compliance | Estructura, regulaciones clave, documentos necesarios, costes |
   | 14 | Métricas & KPIs | North Star, dashboard de KPIs, OKRs Q1 |
   | 15 | Roadmap 6 Meses | Timeline visual horizontal con 6 columnas, hitos clave por mes |
   | 16 | Próximos Pasos | Top 7 acciones inmediatas (primeras 2 semanas) con prioridad |

   **Diseño:**
   - Paleta oscura profesional: fondo `#0F172A`, acento primario `#8B5CF6`, acento secundario `#06B6D4`, texto `#F8FAFC`, success `#34D399`, warning `#FBBF24`, danger `#F87171`
   - Portada con gradiente diagonal y nombre prominente
   - Slide de Viability Score: número grande central con color según nivel, barra de los 10 scores debajo
   - Slides de agente: título con icono, bullets concisos (máx 6), datos clave destacados en cajas de color
   - TAM/SAM/SOM: círculos concéntricos con valores
   - Financieros: mini gráficos de barras o líneas simplificados
   - Roadmap: timeline horizontal con 6 columnas e iconos por fase
   - Nombre archivo: `startup_blueprint_[nombre-producto]_[YYYY-MM-DD].pptx`

6. **Entregar resultados**
   - Guardar el .pptx en el directorio de trabajo
   - Presentar el archivo al usuario
   - Dar resumen ejecutivo en 5-6 líneas: Viability Score, tamaño de oportunidad, ventaja competitiva principal, inversión necesaria estimada, primera acción recomendada, riesgo #1 a mitigar

**Notas:**
- Si la idea es muy genérica, pedir al usuario que concrete antes de lanzar los agentes
- Usar datos de mercado reales siempre que estén disponibles; marcar claramente las estimaciones
- El Viability Score debe ser honesto y fundamentado — un score bajo con buenas recomendaciones es más útil que un score inflado
- Priorizar acciones de validación antes que desarrollo: "habla con 20 usuarios potenciales" > "escribe código"
- Los financieros deben ser conservadores por defecto — el escenario "base" debe ser realista, no aspiracional
- Si el mercado es muy competido, el agente de Competitive Intelligence debe sugerir nichos o ángulos de diferenciación concretos
- El MVP debe poder construirse en 4-8 semanas máximo; si no, reducir scope

$ARGUMENTS
