import type { SectionId } from '@/lib/catalog/types';
import type { Lang } from '@/lib/i18n/languages';

export type Accent = 'acid' | 'pink' | 'cyan' | 'sun' | 'terra';

export interface SectionDef {
  id: SectionId;
  number: string;
  accent: Accent;
  name: Record<Lang, string>;
  headline: Record<Lang, { lead: string; accent: string }>;
  dek: Record<Lang, string>;
  /**
   * Search-facing copy, all optional (Task 20 writes it). Fallbacks: the headline for the title, the dek for the description,
   * no intro block. `intro` is a list of paragraphs; a link to a skill is written `[text](slug)` (see lib/intro.ts).
   */
  seoTitle?: Record<Lang, string>;
  description?: Record<Lang, string>;
  intro?: Record<Lang, string[]>;
}

export const SECTIONS: SectionDef[] = [
  {
    id: 'video', number: '01', accent: 'acid',
    name: { es: 'Video & Motion', en: 'Video & Motion' },
    headline: { es: { lead: 'Edita como un', accent: 'estudio' }, en: { lead: 'Edit like a', accent: 'studio' } },
    dek: { es: 'Cortes, subtítulos karaoke, motion graphics y sonido. Del bruto al reel.', en: 'Cuts, karaoke captions, motion graphics and sound. From raw footage to reel.' },
    seoTitle: { es: 'Skills de Claude Code para vídeo y motion graphics', en: 'Claude Code skills for video editing and motion graphics' },
    description: {
      es: 'Skills de Claude Code para editar vídeo a cámara, quitar silencios, añadir subtítulos, crear motion graphics y locuciones. Para creadores y equipos.',
      en: 'Claude Code skills that edit talking-head video, cut silences, add captions and build motion graphics and voiceovers, for creators and small teams.',
    },
    intro: {
      es: [
        'Estas skills de Claude Code cubren el camino que va del vídeo en bruto al vídeo publicado. Si grabas a cámara, [editar un vídeo de principio a fin](edit-video) resuelve la edición completa, y puedes trabajar por partes con [quitar silencios](cut-silences) y [cortar errores y repeticiones](cut-mistakes). Para las redes, [sacar clips verticales de un vídeo largo](shorts) o [montar un reel o un Short](short-form-edit) te ahorra el montaje manual.',
        'Si lo que necesitas es animación, [crear motion graphics](motion-graphics) produce piezas breves sin narración, [hacer un vídeo explicativo sin presentador](faceless-explainer) parte de un artículo o de unas notas, y [escribir vídeos con Remotion](scaffold--remotion) sirve cuando prefieres programarlos. Para dejar la imagen intacta, [añadir subtítulos](embedded-captions) los coloca a partir de la transcripción.',
        'El sonido también tiene su sitio: [generar locuciones y efectos con ElevenLabs](elevenlabs), [crear música de fondo con ACE-Step](acestep) y [convertir, redimensionar y comprimir con ffmpeg](utils--ffmpeg). Cada skill se invoca con una frase que describe lo que quieres y trabaja sobre tus propios archivos.',
      ],
      en: [
        'These Claude Code skills cover the path from raw footage to a published video. If you record to camera, [edit a video from start to finish](edit-video) handles the whole edit, and you can work in steps with [remove silences](cut-silences) and [cut mistakes and retakes](cut-mistakes). For social platforms, [pull vertical clips out of a long video](shorts) or [turn footage into a reel or a Short](short-form-edit) saves you the manual cutting.',
        'If you need animation, [create motion graphics](motion-graphics) builds short pieces with no narration, [make an explainer video with no presenter](faceless-explainer) starts from an article or a set of notes, and [write videos with Remotion](scaffold--remotion) is there when you would rather code them. To keep the footage untouched, [add captions](embedded-captions) places them from the transcript.',
        'Sound has its place too: [generate voiceovers and sound effects with ElevenLabs](elevenlabs), [create background music with ACE-Step](acestep) and [convert, resize and compress with ffmpeg](utils--ffmpeg). Each skill is invoked with a sentence describing what you want, and it works on your own files.',
      ],
    },
  },
  {
    id: 'web', number: '02', accent: 'pink',
    name: { es: 'Web y Diseño', en: 'Web & Design' },
    headline: { es: { lead: 'Webs con', accent: 'oficio' }, en: { lead: 'Websites with', accent: 'craft' } },
    dek: { es: 'Landings, animación con GSAP, interfaces con criterio y accesibilidad.', en: 'Landing pages, GSAP animation, interfaces with taste, and accessibility.' },
    seoTitle: { es: 'Skills de Claude Code para webs, landings y diseño', en: 'Claude Code skills for websites, landing pages and design' },
    description: {
      es: 'Skills de Claude Code para crear landing pages, animar con GSAP, definir sistemas de diseño y revisar accesibilidad. Para diseñadores y equipos de producto.',
      en: 'Claude Code skills to build landing pages, animate with GSAP, define design systems and check accessibility, for designers and product teams.',
    },
    intro: {
      es: [
        'Estas skills de Claude Code ayudan a construir y mejorar sitios web sin empezar de cero. Para arrancar, [crear una landing page orientada a conversión](web--landing-page) escribe primero el texto y después la página, y [auditar la conversión de una web](web--conversion-optimizer) propone cambios concretos de copy, diseño y confianza. Si ya tienes un sitio, [rediseñar una web existente](redesign-skill) detecta los patrones genéricos y los sustituye.',
        'La animación tiene varias skills con GSAP: [crear una experiencia de scroll](web--gsap-scroll-experience), [construir un hero animado](web--gsap-hero-cinematic), [animar texto letra a letra](web--gsap-text-fx) o [hacer transiciones entre páginas](web--gsap-page-transitions). Para la base visual, [definir un sistema de diseño](web--design-system) fija tokens, tipografía y color, y [diseñar y pulir interfaces](impeccable) trabaja la jerarquía y el detalle.',
        'También hay revisión y publicación: [auditar la accesibilidad de una interfaz](accessibility--a11y-audit) comprueba el cumplimiento de WCAG 2.1, [corregir problemas de accesibilidad](accessibility--a11y-fix) los arregla, y [publicar en Vercel](vercel-deploy) genera un enlace de vista previa. Cada una arranca con una petición en lenguaje natural dentro de Claude Code: describes la página o el problema y revisas lo que te devuelve.',
      ],
      en: [
        'These Claude Code skills help you build and improve websites without starting from scratch. To begin, [build a conversion-focused landing page](web--landing-page) writes the copy first and the page second, and [audit a page for conversion](web--conversion-optimizer) proposes specific changes to copy, layout and trust. If you already have a site, [redesign an existing website](redesign-skill) spots generic patterns and replaces them.',
        'Animation has several GSAP skills: [create a scroll experience](web--gsap-scroll-experience), [build an animated hero section](web--gsap-hero-cinematic), [animate text by character or word](web--gsap-text-fx) or [add page transitions](web--gsap-page-transitions). For the visual base, [define a design system](web--design-system) sets tokens, typography and color, and [design and polish interfaces](impeccable) works on hierarchy and detail.',
        'There is also review and publishing: [audit interface accessibility](accessibility--a11y-audit) checks WCAG 2.1 compliance, [fix accessibility issues](accessibility--a11y-fix) repairs them, and [deploy to Vercel](vercel-deploy) returns a preview link. Each one starts from a plain-language request typed into Claude Code, so you describe the page or the problem and review what comes back.',
      ],
    },
  },
  {
    id: 'brand', number: '03', accent: 'sun',
    name: { es: 'Marca y Contenido', en: 'Brand & Content' },
    headline: { es: { lead: 'Una marca con', accent: 'voz propia' }, en: { lead: 'A brand with', accent: 'its own voice' } },
    dek: { es: 'Identidad, textos que no suenan a IA, imágenes, presentaciones y traducción.', en: 'Identity, copy that does not sound like AI, images, slides and translation.' },
    seoTitle: { es: 'Skills de Claude Code para marca y contenido', en: 'Claude Code skills for brand and content' },
    description: {
      es: 'Skills de Claude Code para crear identidad de marca, humanizar textos de IA, escribir newsletters y posts, generar imágenes y preparar presentaciones.',
      en: 'Claude Code skills to create a brand identity, make AI text sound human, write newsletters and posts, generate images and prepare presentations.',
    },
    intro: {
      es: [
        'Estas skills de Claude Code sirven para dar forma a una marca y producir contenido con ella. Para la identidad, [crear una identidad visual](higgsfield-brandkit) genera paleta, logotipo SVG, tipografía y maquetas. Para el texto, [quitar el tono de IA a un texto](humanizer) corrige los patrones típicos de la escritura automática sin cambiar el significado.',
        'Si publicas con regularidad, [preparar una newsletter](content--newsletter) convierte tus enlaces y notas en un número, [adaptar un contenido a redes sociales](content--social-posts) lo reescribe para LinkedIn, X e Instagram, y [escribir contenido SEO](content--seo-content) parte de lo que posiciona hoy en los resultados. Para artículos sobre tu trabajo, [redactar un artículo técnico](content--technical-writing) usa como base tu propio repositorio.',
        'En lo visual, [hacer fotos de producto](higgsfield-product-photoshoot) genera imágenes en varios estilos, [crear una miniatura de YouTube](higgsfield-youtube-thumbnail) prepara la portada con un concepto fiel al vídeo, y [crear una presentación](slides) monta diapositivas HTML con gráficos. Para llegar a más idiomas, [preparar la traducción de una web](i18n--i18n-setup) configura la librería y extrae los textos.',
      ],
      en: [
        'These Claude Code skills help you shape a brand and produce content with it. For identity, [create a visual identity](higgsfield-brandkit) generates a palette, an SVG logo, typography and mockups. For text, [remove the AI tone from a draft](humanizer) fixes the typical patterns of machine-written prose without changing the meaning.',
        'If you publish regularly, [prepare a newsletter](content--newsletter) turns your links and notes into an issue, [adapt content for social media](content--social-posts) rewrites it for LinkedIn, X and Instagram, and [write SEO content](content--seo-content) starts from what ranks today. For articles about your work, [write a technical article](content--technical-writing) uses your own repository as the source.',
        'On the visual side, [shoot product photos](higgsfield-product-photoshoot) generates images in several styles, [create a YouTube thumbnail](higgsfield-youtube-thumbnail) prepares a cover with a concept true to the video, and [build a presentation](slides) makes HTML slides with charts. To reach more languages, [set up website translation](i18n--i18n-setup) configures the library and extracts the strings.',
      ],
    },
  },
  {
    id: 'ads', number: '04', accent: 'cyan',
    name: { es: 'Ads y Redes', en: 'Ads & Social' },
    headline: { es: { lead: 'Contenido que', accent: 'vende' }, en: { lead: 'Content that', accent: 'sells' } },
    dek: { es: 'Instagram, Meta, TikTok, Google Ads y auditorías de campañas.', en: 'Instagram, Meta, TikTok, Google Ads and campaign audits.' },
    seoTitle: { es: 'Skills de Claude Code para ads e Instagram', en: 'Claude Code skills for paid ads and Instagram' },
    description: {
      es: 'Skills de Claude Code para planificar y auditar campañas en Meta, Google Ads y TikTok, calcular ROAS y crear reels y carruseles de Instagram.',
      en: 'Claude Code skills to plan and audit campaigns on Meta, Google Ads and TikTok, calculate ROAS and create Instagram reels and carousels.',
    },
    intro: {
      es: [
        'Estas skills de Claude Code cubren la publicidad de pago y el contenido de Instagram. Para empezar, [planificar una estrategia de anuncios](ads-plan) define objetivos, canales y presupuesto, y [auditar tus cuentas de anuncios](ads-audit) devuelve un informe por plataforma. Por canal, hay revisiones específicas para [Meta Ads](ads-meta), [Google Ads](ads-google) y [TikTok Ads](ads-tiktok). Las skills de anuncios proponen cambios y no modifican tus cuentas por su cuenta.',
        'Para trabajar con números, [calcular CPA, ROAS y punto de equilibrio](ads-math) muestra las fórmulas, [diseñar un test A/B de anuncios](ads-test) fija hipótesis y tamaño de muestra, y [revisar la página de destino](ads-landing) comprueba que coincida con el mensaje del anuncio. Para el material, [crear conceptos y textos de campaña](ads-create) parte de tu perfil de marca.',
        'En Instagram, [convertir una idea en un Reel](ig-reel) propone ganchos, guion y texto en pantalla, [crear un carrusel](ig-carousel) escribe portada y diapositivas, y [planificar tu semana de Instagram](ig-plan) ordena qué publicar y cuándo. Sirven tanto a quien gestiona campañas como a quien lleva las redes de un negocio.',
      ],
      en: [
        'These Claude Code skills cover paid advertising and Instagram content. To start, [plan an ad strategy](ads-plan) defines objectives, channels and budget, and [audit your ad accounts](ads-audit) returns a report per platform. There are channel-specific reviews for [Meta Ads](ads-meta), [Google Ads](ads-google) and [TikTok Ads](ads-tiktok). The ad skills propose changes and do not modify your accounts on their own.',
        'To work with the numbers, [calculate CPA, ROAS and break-even](ads-math) shows the formulas, [design an ad A/B test](ads-test) sets the hypothesis and sample size, and [review the landing page](ads-landing) checks that it matches the ad message. For the material, [create campaign concepts and copy](ads-create) starts from your brand profile.',
        'On Instagram, [turn an idea into a Reel](ig-reel) proposes hooks, a script and on-screen text, [create a carousel](ig-carousel) writes the cover and slides, and [plan your Instagram week](ig-plan) sets what to post and when. They suit both the person running campaigns and the person handling a business social account.',
      ],
    },
  },
  {
    id: 'sales', number: '05', accent: 'acid',
    name: { es: 'Ventas', en: 'Sales' },
    headline: { es: { lead: 'Ventas en', accent: 'piloto automático' }, en: { lead: 'Sales on', accent: 'autopilot' } },
    dek: { es: 'Leads, cold outreach, propuestas, objeciones y tienda online.', en: 'Leads, cold outreach, proposals, objections and online stores.' },
    seoTitle: { es: 'Skills de Claude Code para ventas y tienda online', en: 'Claude Code skills for sales and online stores' },
    description: {
      es: 'Skills de Claude Code para encontrar leads, escribir cold outreach, preparar propuestas y objeciones, y montar una tienda online con carrito y envíos.',
      en: 'Claude Code skills to find leads, write cold outreach, prepare proposals and objection playbooks, and set up an online store with cart and shipping.',
    },
    intro: {
      es: [
        'Estas skills de Claude Code apoyan el proceso comercial, desde encontrar clientes hasta cerrar el trato, y también la venta en una tienda online. Para captar, [definir tu cliente ideal](sales--icp-builder) genera un perfil y consultas de búsqueda, [encontrar y puntuar leads](sales--lead-finder) los busca en la web, y [escribir secuencias de cold outreach](sales--cold-outreach) prepara emails y mensajes de LinkedIn personalizados por lead.',
        'Con un cliente en marcha, [preparar una llamada de descubrimiento](sales--discovery-prep) reúne información de la empresa y preguntas, [crear un manual de objeciones](sales--objection-handler) da respuestas y pruebas, [redactar una propuesta comercial](sales--proposal-generator) parte de tus notas de descubrimiento, y [diseñar el seguimiento de un trato](sales--follow-up-sequencer) fija los tiempos por etapa.',
        'Para vender en línea, [montar el esqueleto de una tienda online](ecommerce--store-scaffold) elige plataforma y estructura catálogo, carrito y pago, [escribir descripciones de producto](ecommerce--product-descriptions) las redacta a escala desde las fichas, y [recuperar carritos abandonados](ecommerce--abandoned-cart) diseña la detección y la secuencia de emails.',
      ],
      en: [
        'These Claude Code skills support the sales process, from finding customers to closing the deal, and also selling through an online store. To win customers, [define your ideal customer profile](sales--icp-builder) produces a profile and search queries, [find and score leads](sales--lead-finder) looks for them on the web, and [write cold outreach sequences](sales--cold-outreach) prepares emails and LinkedIn messages personalized per lead.',
        'Once a deal is moving, [prepare a discovery call](sales--discovery-prep) gathers company information and questions, [build an objection playbook](sales--objection-handler) gives reframes and proof points, [draft a commercial proposal](sales--proposal-generator) starts from your discovery notes, and [plan deal follow-ups](sales--follow-up-sequencer) sets timing per stage.',
        'For selling online, [scaffold an online store](ecommerce--store-scaffold) picks a platform and structures catalog, cart and checkout, [write product descriptions](ecommerce--product-descriptions) drafts them at scale from specs, and [recover abandoned carts](ecommerce--abandoned-cart) designs the detection and the email sequence. Each one starts from a plain-language request in Claude Code, so you describe the lead, the call or the product and review the result.',
      ],
    },
  },
  {
    id: 'business', number: '06', accent: 'sun',
    name: { es: 'Negocio', en: 'Business' },
    headline: { es: { lead: 'Negocio', accent: 'en orden' }, en: { lead: 'Business,', accent: 'in order' } },
    dek: { es: 'Contratos, GDPR, finanzas, pricing y producto.', en: 'Contracts, GDPR, finance, pricing and product.' },
    seoTitle: { es: 'Skills de Claude Code para contratos, GDPR y finanzas', en: 'Claude Code skills for contracts, GDPR and finance' },
    description: {
      es: 'Skills de Claude Code para revisar contratos, auditar el RGPD, calcular métricas SaaS y runway, fijar precios y escribir PRD y roadmaps de producto.',
      en: 'Claude Code skills to review contracts, audit GDPR, compute SaaS metrics and runway, set pricing, and write product PRDs and roadmaps.',
    },
    intro: {
      es: [
        'Estas skills de Claude Code ayudan a ordenar la parte legal, financiera y de producto de un negocio. En lo legal, [auditar el cumplimiento del RGPD](legal--gdpr-audit) revisa el código en busca de carencias, [redactar una política de privacidad](legal--privacy-policy) parte de las prácticas de datos que encuentra, y [revisar un contrato](legal--contract-review) marca cláusulas de riesgo y términos ausentes. Los textos son borradores que debe revisar un profesional del derecho.',
        'En finanzas, [calcular métricas SaaS](finance--saas-metrics) obtiene MRR, ARR, churn y CAC a partir de tus datos de ingresos, [calcular burn rate y runway](finance--burn-runway) compara escenarios, y [diseñar un modelo de precios](finance--pricing-model) define planes y métrica de valor. Si buscas inversión, [estructurar un deck de inversión](finance--fundraising-deck) ordena la narrativa diapositiva a diapositiva.',
        'En producto, [escribir un PRD](product--prd) desarrolla una idea con problema, alcance y métricas, [construir un roadmap](product--roadmap) lo ordena en ahora, después y más adelante, y [dividir una funcionalidad en historias de usuario](product--user-stories) añade criterios de aceptación.',
      ],
      en: [
        'These Claude Code skills help put the legal, financial and product side of a business in order. On the legal side, [audit GDPR compliance](legal--gdpr-audit) scans the code for gaps, [draft a privacy policy](legal--privacy-policy) starts from the data practices it finds, and [review a contract](legal--contract-review) flags risky clauses and missing terms. The texts are drafts that a legal professional should review.',
        'On the finance side, [compute SaaS metrics](finance--saas-metrics) derives MRR, ARR, churn and CAC from your revenue data, [calculate burn rate and runway](finance--burn-runway) compares scenarios, and [design a pricing model](finance--pricing-model) defines tiers and a value metric. If you are raising money, [structure a fundraising deck](finance--fundraising-deck) lays out the narrative slide by slide.',
        'On the product side, [write a PRD](product--prd) develops an idea with problem, scope and success metrics, [build a roadmap](product--roadmap) arranges it as now, next and later, and [break a feature into user stories](product--user-stories) adds acceptance criteria. Each one starts from a plain-language request in Claude Code, and you review the result.',
      ],
    },
  },
  {
    id: 'ai', number: '07', accent: 'cyan',
    name: { es: 'IA y Agentes', en: 'AI & Agents' },
    headline: { es: { lead: 'Agentes que', accent: 'trabajan' }, en: { lead: 'Agents that', accent: 'get to work' } },
    dek: { es: 'Agentes, RAG, evals, MCP y machine learning.', en: 'Agents, RAG, evals, MCP and machine learning.' },
    seoTitle: { es: 'Skills de Claude Code para agentes de IA, RAG y MCP', en: 'Claude Code skills for AI agents, RAG and MCP' },
    description: {
      es: 'Skills de Claude Code para construir agentes y chatbots, evaluar RAG y modelos, crear servidores MCP y reducir el coste de las llamadas a LLM.',
      en: 'Claude Code skills to build agents and chatbots, evaluate RAG and models, create MCP servers and cut the cost of LLM calls.',
    },
    intro: {
      es: [
        'Estas skills de Claude Code están pensadas para quien construye productos con modelos de lenguaje. Para empezar, [diseñar un agente de IA](ai--agent-builder) define el bucle, las herramientas y la memoria, [crear un chatbot](ai--chatbot-scaffold) monta respuestas en streaming y conversaciones persistentes, y [crear un servidor MCP](ai--mcp-server) expone las funciones de tu proyecto mediante Model Context Protocol.',
        'Para que funcione bien, [mejorar tus prompts](ai--prompt-engineer) revisa y reescribe instrucciones y definiciones de herramientas, [evaluar una función de IA](ai--llm-eval) prepara casos de prueba y rúbricas, y [medir un sistema RAG](ai--rag-eval) construye un conjunto de preguntas de referencia y métricas de recuperación. Para la seguridad, [añadir guardarraíles a una app de IA](ai--guardrails) incluye filtros de entrada y salida y defensa contra prompt injection.',
        'Si te interesa el coste o el aprendizaje automático, [reducir el gasto en tokens](ai--llm-cost-optimizer) mide dónde se consume y aplica enrutado de modelos y caché, [entrenar un modelo](ml--model-training) parte de una línea base sencilla, y [predecir series temporales](ml--time-series-forecast) usa backtesting para validar el pronóstico.',
      ],
      en: [
        'These Claude Code skills are meant for people building products with language models. To start, [design an AI agent](ai--agent-builder) defines the loop, the tools and the memory, [scaffold a chatbot](ai--chatbot-scaffold) sets up streaming responses and persistent conversations, and [build an MCP server](ai--mcp-server) exposes your project\'s functions through the Model Context Protocol.',
        'To make it work well, [improve your prompts](ai--prompt-engineer) reviews and rewrites instructions and tool definitions, [evaluate an AI feature](ai--llm-eval) prepares test cases and rubrics, and [measure a RAG pipeline](ai--rag-eval) builds a golden question set and retrieval metrics. For safety, [add guardrails to an AI app](ai--guardrails) covers input and output filters and prompt-injection defense.',
        'If cost or machine learning is your concern, [cut token spending](ai--llm-cost-optimizer) measures where tokens go and applies model routing and caching, [train a model](ml--model-training) starts from a trivial baseline, and [forecast a time series](ml--time-series-forecast) uses backtesting to validate the forecast. Each one starts from a plain-language request in Claude Code, and you review the result before using it.',
      ],
    },
  },
  {
    id: 'data', number: '08', accent: 'pink',
    name: { es: 'Datos', en: 'Data' },
    headline: { es: { lead: 'Números', accent: 'claros' }, en: { lead: 'Numbers, made', accent: 'clear' } },
    dek: { es: 'SQL, embudos, cohortes, modelos de datos y bases de datos.', en: 'SQL, funnels, cohorts, data models and databases.' },
    seoTitle: { es: 'Skills de Claude Code para SQL, embudos y datos', en: 'Claude Code skills for SQL, funnels and data analysis' },
    description: {
      es: 'Skills de Claude Code para escribir SQL desde una pregunta, analizar embudos y cohortes, limpiar CSV, definir métricas y diseñar bases de datos.',
      en: 'Claude Code skills to write SQL from a plain question, analyze funnels and cohorts, clean CSVs, define metrics and design databases.',
    },
    intro: {
      es: [
        'Estas skills de Claude Code te llevan de una pregunta de negocio a una respuesta con datos. Para consultar, [convertir una pregunta en una consulta SQL](data--analytics-sql) genera SQL analítico ejecutable, [analizar un embudo de conversión](data--funnel-analysis) calcula la caída por paso, y [analizar cohortes de retención](data--cohort-analysis) construye la consulta sobre tu esquema real.',
        'Antes de analizar, [limpiar un CSV o un Excel](data--csv-wrangler) crea un script reutilizable, [auditar la calidad de los datos](data--data-quality-audit) busca nulos, duplicados y valores inválidos, y [definir una métrica](data--metric-definition) convierte un término vago como «usuarios activos» en un documento con fórmula. Para mostrar los resultados, [especificar un dashboard](data--dashboard-spec) fija audiencia, preguntas y gráficos.',
        'Para la base de datos, [diseñar un esquema](database--schema) revisa normalización, claves y restricciones, [generar un diagrama entidad-relación](database--erd) lo dibuja en Mermaid, y [optimizar una consulta lenta](database--query-optimize) localiza índices que faltan y problemas N+1. Si mides producto, [planificar el seguimiento de eventos](data--event-tracking-plan) define eventos y propiedades.',
      ],
      en: [
        'These Claude Code skills take you from a business question to an answer backed by data. To query, [turn a question into a SQL query](data--analytics-sql) generates runnable analytical SQL, [analyze a conversion funnel](data--funnel-analysis) computes drop-off per step, and [analyze retention cohorts](data--cohort-analysis) builds the query on your real schema.',
        'Before analyzing, [clean a CSV or Excel file](data--csv-wrangler) creates a reusable script, [audit data quality](data--data-quality-audit) looks for nulls, duplicates and invalid values, and [define a metric](data--metric-definition) turns a vague term such as \'active users\' into a document with a formula. To present the results, [specify a dashboard](data--dashboard-spec) sets the audience, questions and charts.',
        'For the database itself, [design a schema](database--schema) reviews normalization, keys and constraints, [generate an ER diagram](database--erd) draws it in Mermaid, and [optimize a slow query](database--query-optimize) finds missing indexes and N+1 problems. If you measure a product, [plan event tracking](data--event-tracking-plan) defines events and properties. Each one starts from a plain-language request in Claude Code, and you review the result before using it.',
      ],
    },
  },
  {
    id: 'code', number: '09', accent: 'terra',
    name: { es: 'Código', en: 'Code' },
    headline: { es: { lead: 'Código', accent: 'sin drama' }, en: { lead: 'Code,', accent: 'minus the drama' } },
    dek: { es: 'Testing, devops, seguridad, git, cloud y depuración.', en: 'Testing, devops, security, git, cloud and debugging.' },
    seoTitle: { es: 'Skills de Claude Code para testing, seguridad y devops', en: 'Claude Code skills for testing, security and devops' },
    description: {
      es: 'Skills de Claude Code para generar tests, auditar seguridad, depurar errores, automatizar CI/CD, gestionar git y revisar código en cualquier stack.',
      en: 'Claude Code skills to generate tests, audit security, debug errors, automate CI/CD, manage git and review code across any tech stack.',
    },
    intro: {
      es: [
        'Estas skills de Claude Code cubren el día a día del desarrollo y se adaptan al lenguaje y al framework de tu proyecto. En calidad, [generar tests](testing--test-gen) escribe pruebas para tu código, [revisar código](code-quality--review) analiza un cambio en busca de problemas, y [refactorizar código](code-quality--refactor) lo simplifica sin cambiar su comportamiento.',
        'En seguridad, [auditar la seguridad de un proyecto](security--security-audit) revisa vulnerabilidades habituales y [buscar secretos expuestos](security--secrets-scan) localiza claves y contraseñas en el repositorio. Cuando algo falla, [interpretar un stack trace](debugging--stack-trace) explica el error y [depurar un fallo en producción](debugging--production-debug) guía la investigación a partir de lo que observas.',
        'Para el flujo de trabajo, [escribir mensajes de commit](git--commit) resume tus cambios, [revisar una pull request](git--pr-review) la comenta, y [crear un workflow de GitHub Actions](devops--github-actions) automatiza pruebas y despliegues. En infraestructura, [escribir un Dockerfile](devops--dockerfile) empaqueta la aplicación y [auditar el coste en la nube](cloud--cloud-cost-audit) busca dónde se va el gasto. Cada una arranca con una petición en lenguaje natural dentro de Claude Code.',
      ],
      en: [
        'These Claude Code skills cover everyday development and adapt to the language and framework of your project. On quality, [generate tests](testing--test-gen) writes tests for your code, [review code](code-quality--review) analyzes a change for problems, and [refactor code](code-quality--refactor) simplifies it without changing its behavior.',
        'On security, [audit a project\'s security](security--security-audit) checks for common vulnerabilities and [scan for exposed secrets](security--secrets-scan) finds keys and passwords in the repository. When something breaks, [decode a stack trace](debugging--stack-trace) explains the error and [debug a production failure](debugging--production-debug) guides the investigation from what you observe.',
        'For the workflow, [write commit messages](git--commit) summarizes your changes, [review a pull request](git--pr-review) comments on it, and [create a GitHub Actions workflow](devops--github-actions) automates tests and deploys. On infrastructure, [write a Dockerfile](devops--dockerfile) packages the app and [audit cloud costs](cloud--cloud-cost-audit) looks for where the spend goes. Each one starts from a plain-language request in Claude Code, so you describe the change or the problem and review the result, whatever your stack.',
      ],
    },
  },
];

export function getSection(id: SectionId): SectionDef {
  const s = SECTIONS.find((x) => x.id === id);
  if (!s) throw new Error(`unknown section ${id}`);
  return s;
}
