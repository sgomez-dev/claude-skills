---
description: Auditoría de marketing digital completa con 8 agentes especializados en paralelo + PowerPoint
permissions:
  reads: []
  writes: ["*.pptx"]
  commands: []
  network: true
  destructive: false
---

Realiza una auditoría de marketing digital completa lanzando 8 agentes especializados en paralelo
que analizan SEO, competencia, UX, marca, crecimiento, contenido, PPC y paid media.
Consolida todos los hallazgos en un PowerPoint profesional.

Pasos:

1. **Recopilar datos de entrada**
   - URL del sitio web a auditar: `$ARGUMENTS`
   - Si no se proporcionó URL, pedirla antes de continuar
   - Detectar nombre de marca, sector/industria y competidores principales (via web search si no se indican)

2. **Anunciar el inicio**
   Comunicar al usuario:
   > "Voy a lanzar los 8 agentes especializados en paralelo y generaré el PowerPoint consolidado."
   Listar los 8 agentes que se van a ejecutar.

3. **Lanzar los 8 agentes en paralelo** (usar Task tool / subagentes simultáneos)

   Cada agente debe hacer web search para obtener datos reales del sitio/marca y devolver un JSON con `agent`, `score` (0-100), `hallazgos`, `recomendaciones` y métricas específicas de su área.

   **Agente 1 — SEO Specialist** · Auditoría técnica y on-page
   Revisar: velocidad de carga, mobile-first, HTTPS, meta titles/descriptions, estructura URLs,
   headings H1-H6, imágenes con alt text, sitemap, robots.txt, Core Web Vitals, schema markup,
   internal linking. Incluir `quick_wins` de impacto inmediato.

   **Agente 2 — Trend Researcher** · Análisis competitivo y tendencias
   Buscar 2-3 competidores principales. Analizar: fortalezas/debilidades de cada uno,
   tendencias del sector, oportunidades de mercado, amenazas, diferenciación actual de la marca.

   **Agente 3 — UX Researcher** · Evaluación de landing page y experiencia de usuario
   Evaluar: claridad del mensaje, propuesta de valor, jerarquía visual, CTAs, formularios,
   navegación, accesibilidad, elementos de confianza (testimonios, garantías, sellos),
   flujo de conversión. Identificar los 3 problemas UX más críticos.

   **Agente 4 — Brand Guardian** · Consistencia de marca y diferenciación
   Analizar: identidad visual, tono de comunicación, coherencia del mensaje,
   presencia y actividad en redes sociales, consistencia cross-channel.
   Evaluar nivel de diferenciación vs competidores.

   **Agente 5 — Growth Hacker** · Plan de adquisición de usuarios
   Identificar: canales actuales de adquisición, canales con mayor oportunidad,
   funnel estimado (awareness → conversión → retención), growth loops potenciales,
   experimentos recomendados, quick wins para los próximos 90 días.

   **Agente 6 — Content Creator** · Estrategia de contenido
   Auditar contenido actual (tipos, frecuencia, calidad). Identificar gaps y temas oportunidad.
   Generar calendario editorial de 4 semanas con temas específicos del nicho y formatos
   (blog, redes, video, email). Incluir recomendaciones de SEO content.

   **Agente 7 — PPC Campaign Strategist** · Estructura de campañas PPC
   Definir: palabras clave prioritarias, audiencias objetivo, estructura de campañas
   recomendada (Google Ads + Meta Ads), presupuesto sugerido, mensajes clave para anuncios,
   KPIs objetivo (CPC estimado, CTR objetivo, conversion rate objetivo).

   **Agente 8 — Paid Media Auditor** · Evaluación de medios pagados
   Detectar canales pagados actuales. Evaluar eficiencia estimada. Identificar problemas
   y optimizaciones inmediatas. Proponer distribución de presupuesto recomendada
   (search / social / display / otros) con ROI potencial estimado.

4. **Consolidar resultados**
   - Calcular score global (promedio de los 8 scores)
   - Identificar Top 3 prioridades críticas transversales
   - Construir roadmap 90 días: acciones Mes 1 (quick wins), Mes 2 (optimización), Mes 3 (escala)

5. **Generar el PowerPoint**
   Crear deck profesional con pptxgenjs con la siguiente estructura:

   | # | Slide | Contenido clave |
   |---|-------|-----------------|
   | 1 | Portada | Nombre marca, "Auditoría de Marketing Digital", fecha |
   | 2 | Resumen Ejecutivo | Score global visual, top 3 hallazgos, top 3 prioridades |
   | 3 | Dashboard de Scores | Gráfico comparativo con los 8 scores (semáforo: verde >70, amarillo 40-70, rojo <40) |
   | 4 | SEO Specialist | Score, hallazgos clave, quick wins |
   | 5 | Trend Researcher | Mapa competitivo, oportunidades, amenazas |
   | 6 | UX Researcher | Problemas críticos, capturas conceptuales, recomendaciones |
   | 7 | Brand Guardian | Estado de marca, coherencia, mejoras prioritarias |
   | 8 | Growth Hacker | Canales, funnel, experimentos recomendados |
   | 9 | Content Creator | Calendario 4 semanas, gaps, oportunidades |
   | 10 | PPC Strategist | Estructura campañas, keywords top, presupuesto |
   | 11 | Paid Media Auditor | Distribución presupuesto (visual), optimizaciones |
   | 12 | Roadmap 90 días | Timeline visual Mes 1 / Mes 2 / Mes 3 |
   | 13 | Próximos Pasos | Top 5 acciones inmediatas con responsable y plazo |

   **Diseño:**
   - Paleta oscura profesional: fondo `#0F172A`, acento `#6366F1`, texto `#F8FAFC`, highlights `#22D3EE`
   - Portada con gradiente y nombre de marca prominente
   - Cada slide de agente: score en círculo de color, bullets concisos (máx 5), iconos
   - Dashboard: tabla o chart con colores semáforo
   - Roadmap: timeline horizontal 3 columnas
   - Nombre archivo: `audit_[marca]_[YYYY-MM-DD].pptx`

6. **Entregar resultados**
   - Guardar el .pptx en el directorio de trabajo
   - Presentar el archivo al usuario
   - Dar resumen en 3-4 líneas: score global, top 3 hallazgos críticos, primera acción recomendada

**Notas:**
- Si el sitio tiene poca información pública, basar el análisis en el sector/industria detectado e indicarlo
- Priorizar siempre quick wins (alto impacto, bajo esfuerzo) en las recomendaciones
- El score debe ser honesto — sirve como baseline para medir mejoras futuras
- El calendario editorial debe usar temas reales del nicho, no ejemplos genéricos

$ARGUMENTS
