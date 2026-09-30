import { SECTIONS } from '@/content/sections';
import type { Figures } from '@/lib/catalog/figures';
import { fmtDay, fmtMonth } from '../format';
import type { Dictionary } from './en';

const licenseList = (f: Figures) => f.licenses.map((l) => `${l.count} ${l.id}`).join(', ');
const licenseNames = (f: Figures) => f.licenses.map((l) => l.id).join(', ');

export const es: Dictionary = {
  locale: 'es-ES',
  meta: {
    siteName: 'Claude Skills',
    title: (n) => `Claude Skills: ${n} skills gratuitas para Claude Code`,
    description: (n, commands) =>
      `${n} skills gratuitas y open source para Claude Code: video, diseño web, ventas, legal, finanzas, IA y código. Las ${commands} hechas aquí declaran sus permisos.`,
  },
  nav: { label: 'Principal', skipToContent: 'Saltar al contenido', language: 'Idioma', github: 'GitHub', home: 'Portada', credits: 'Créditos', methodology: 'Metodología', breadcrumb: 'Migas de pan' },
  masthead: { issue: (d, n) => `Nº 01 · ${fmtMonth('es-ES', d)} · ${n} especialistas` },
  home: {
    claim: { lead: 'Nadie lo sabe', accent: 'todo.', highlight: 'Tu agente,', tail: 'ahora sí.' },
    dek: (n) => `${n} especialistas para Claude Code. Video, motion, marca, ventas, legal y código: una orden y listo.`,
    inThisIssue: 'En este número',
    coverLines: [
      { section: 'business', text: 'Contratos revisados antes de firmar' },
      { section: 'sales', text: 'Prospección que llena la agenda' },
      { section: 'web', text: 'Webs con oficio' },
      { section: 'video', text: 'Videos que paran el scroll' },
    ],
    stickerFree: 'gratis y open source',
    stickerPlatforms: 'Claude Code · Cursor · Windsurf · Codex',
    index: 'Índice',
    stats: {
      skills: 'skills en este número',
      permissionsLabel: 'comandos declaran qué pueden tocar',
      platforms: 'agentes compatibles',
      updated: 'última actualización',
    },
    figures: {
      label: 'El catálogo en cifras',
      line: (f) => `${f.total} skills · ${f.commands} hechas aquí (MIT) · ${f.external} de ${f.repos} repositorios de la comunidad (${licenseList(f)})`,
      updated: 'actualizado el',
    },
    cta: {
      title: 'Instálalo todo en 30 segundos',
      body: 'Una línea en tu terminal copia todas las skills a Claude Code. Escribe / y ahí están.',
      more: 'Todas las formas de instalar',
    },
    faqTitle: 'Preguntas',
    faq: (f) => [
      { q: '¿Qué es una skill?', a: 'Una skill es un conjunto de instrucciones expertas que Claude Code carga cuando las necesitas. Escribes un comando como /legal--contract-review, o simplemente describes la tarea, y tu agente trabaja como un especialista.' },
      { q: '¿Necesito saber programar?', a: 'No. Muchas skills no tocan código: contratos, emails de venta, edición de video, marca. Necesitas Claude Code instalado; instalar las skills es una línea.' },
      { q: '¿Cuánto cuesta?', a: `Gratis. Las ${f.commands} skills hechas aquí tienen licencia MIT; las ${f.external} de la comunidad conservan la licencia de su repositorio original (${licenseList(f)}). Claude Code en sí necesita una suscripción de Claude (Pro o superior) o una clave de API.` },
      { q: '¿Qué puede tocar una skill en mi ordenador?', a: 'Cada comando hecho aquí declara qué lee, qué escribe, qué comandos ejecuta y si usa la red. Lo ves en la ficha de cada skill antes de instalarla. Las skills de la comunidad siguen las reglas de su repositorio original: lee su código antes.' },
      { q: '¿Funciona fuera de Claude Code?', a: 'Sí. El repositorio tiene guías para Cursor, Windsurf y Codex.' },
    ],
  },
  section: {
    skills: (n) => `${n} skills`,
    updated: (d) => `Actualizado el ${fmtDay('es-ES', d)}`,
    filters: {
      label: 'Filtros', origin: 'Origen', all: 'Todas', command: 'Hechas aquí', external: 'Comunidad',
      group: 'Categoría', allGroups: 'Todas las categorías', network: 'Usa la red',
    },
    showing: 'Mostrando {v} de {t}',
    empty: 'Ninguna skill cumple estos filtros.',
  },
  skill: {
    titleSuffix: 'skill de Claude Code',
    authorDescription: 'Descripción del autor',
    authorDescriptionTranslated: 'Descripción del autor (traducida)',
    methodology: 'Cómo revisamos esto',
    pairsWith: 'Encaja con',
    recipe: 'Receta',
    useWhen: 'Úsala cuando',
    notFor: 'No es para',
    output: 'Qué obtienes',
    faqTitle: 'Preguntas sobre esta skill',
    answer: (slug, section) => `/${slug} es una skill de Claude Code de la sección ${section}.`,
    answerExternal: (owner, license) => ` La mantiene ${owner} y se publica con licencia ${license}.`,
    builtHere: 'Hecha aquí',
    copy: 'Copiar',
    copied: 'Copiado',
    by: (owner) => `Por ${owner}`,
    updated: (d) => `Actualizada el ${fmtDay('es-ES', d)}`,
    howToAsk: 'Cómo pedírselo',
    invoke: 'Tras instalar con el script, escribe',
    install: 'Instalar',
    tabs: { 'script-unix': 'macOS · Linux', 'script-windows': 'Windows', plugin: 'Plugin de Claude Code' },
    pluginNote: 'Instala el paquete {bundle} completo.',
    otherAgents: '¿Usas Cursor, Windsurf o Codex?',
    otherAgentsLink: 'Guías por plataforma',
    permissions: 'Qué puede tocar',
    perm: {
      reads: 'Lee', writes: 'Escribe', commands: 'Ejecuta', network: 'Red', destructive: 'Destructiva',
      nothing: 'Nada', yes: 'Sí', no: 'No', more: (n) => `+${n} más`,
    },
    permissionsExternal: 'Las skills de la comunidad siguen las convenciones de su repositorio original y no traen manifiesto de permisos. Lee su código antes de ejecutarla.',
    provenance: 'De dónde viene',
    author: 'Autor', license: 'Licencia', source: 'Código', commit: 'Commit vendorizado', viewSource: 'Ver código',
    related: 'Más de esta sección',
    demoSoon: 'Demo en camino',
    notTranslated: 'Se muestra en inglés: la traducción está en camino.',
  },
  credits: {
    title: 'Créditos',
    dek: 'Este número lo escriben muchas manos. Estos son los autores originales cuyas skills se incluyen aquí, con sus licencias.',
    builtHere: (n) => `${n} comandos escritos en este repositorio por`,
    skills: (n) => `${n} skills`,
    license: 'Licencia',
  },
  search: {
    open: 'Buscar skills',
    placeholder: (n) => `Busca entre ${n} skills… prueba “contrato” o “subtítulos”`,
    noResults: 'Nada por aquí. Prueba otra palabra.',
    hint: '↑↓ moverte · Enter abrir · Esc cerrar',
    close: 'Cerrar',
    results: 'Resultados',
    loading: 'Cargando…',
    error: 'No se pudo cargar la búsqueda. Ciérrala y ábrela de nuevo para reintentar.',
  },
  footer: { madeBy: 'Hecho por', license: 'Sitio y skills propias: MIT', source: 'Código en GitHub', llms: 'Para agentes de IA: llms.txt', credits: 'Créditos', methodology: 'Metodología' },
  og: {
    home: (n) => `Claude Skills: ${n} skills gratuitas para Claude Code`,
    section: (name) => `${name}: skills de Claude Code, Claude Skills`,
    skill: (name, section) => `${name}: skill de Claude Code, sección ${section}, Claude Skills`,
  },
  md: { web: 'Versión web', install: 'Instalar', howToAsk: 'Cómo pedírselo', permissions: 'Permisos', source: 'Código', section: 'Sección', skills: 'Skills', license: 'Licencia', author: 'Autor' },
  date: (d) => fmtDay('es-ES', d),
  // Escrito a partir de los scripts y reglas reales del repositorio; revisado y aprobado por Santiago el 2026-09-30.
  methodology: {
    title: 'Cómo elegimos y revisamos las skills',
    seoTitle: 'Cómo elegimos y revisamos las skills de Claude Code: metodología',
    description: 'Quién cura este catálogo, qué entra, cómo se declaran y se comprueban los permisos, cómo se sincronizan las skills de la comunidad y qué licencias aceptamos.',
    dek: 'Este catálogo está curado, no rastreado. Esto es lo que significa, y hasta dónde llegan las comprobaciones.',
    updated: 'Actualizado el',
    reportLabel: 'Abre una incidencia en GitHub',
    sections: (f) => [
      { h: 'Quién lo cura', p: [`El catálogo lo cura Santiago Gómez de la Torre, que también escribió las ${f.commands} skills hechas aquí. Es un proyecto independiente: no lo hace Anthropic ni tiene relación con ella.`] },
      { h: 'Qué contiene', p: [`${f.total} skills en ${SECTIONS.length} secciones: ${f.commands} escritas en este repositorio y ${f.external} incluidas de ${f.repos} repositorios de la comunidad. Todas las cifras sobre el catálogo se calculan a partir del catálogo cuando se construye el sitio.`] },
      {
        h: 'Qué entra',
        bullets: [
          'Hechas aquí: una tarea por skill, pasos claros, y detectan el lenguaje y el framework del proyecto en lugar de suponer uno.',
          `De la comunidad: solo skills cuya licencia nos permite redistribuirlas con los avisos originales; ahora mismo, ${licenseNames(f)}.`,
          'Una skill cuyo repositorio original no tiene licencia, o tiene una (A)GPL, se usa en privado y nunca se publica en este sitio.',
        ],
      },
      {
        h: 'Cómo se declaran y se comprueban los permisos',
        p: [
          `Cada una de las ${f.commands} skills hechas aquí lleva un bloque de permisos en su cabecera: qué lee, qué escribe, qué comandos ejecuta, si usa la red y si puede destruir datos. La construcción del catálogo falla si una skill no tiene el bloque, así que una skill sin él no puede aparecer aquí.`,
          'Dos scripts se ejecutan en CI con cada cambio en una skill. Uno comprueba la estructura, el manifiesto, los patrones peligrosos (como pasar curl a una shell) y la calidad de los disparadores. El otro contrasta el manifiesto con el texto: una skill que menciona comandos destructivos o de red tiene que declararlos. Son comprobaciones por patrones. Detectan discrepancias, no intenciones: lee el código antes de ejecutar algo que no conozcas.',
          'Las skills de la comunidad no tienen manifiesto. Su ficha lo dice y enlaza al código en el commit exacto que incluimos.',
        ],
      },
      {
        h: 'Cómo se sincronizan las skills de la comunidad',
        p: [
          'Las skills de la comunidad viven en el repositorio, en external/. Un manifiesto (external/sources.txt) indica el repositorio original, la rama o la etiqueta y la ruta de cada una, y un script de sincronización (scripts/sync-external.sh) las copia y fija el commit exacto. Cada copia guarda ese commit, su fecha y la licencia original en sus ficheros UPSTREAM.md y LICENSE. Una copia nunca se edita a mano: la siguiente sincronización la sobrescribiría. Una tarea semanal de CI avisa de qué copias se han quedado por detrás del original.',
        ],
      },
      { h: 'Licencias', p: [`Las ${f.commands} skills hechas aquí son MIT. Las ${f.external} de la comunidad conservan la licencia de su repositorio original: ${licenseList(f)}. La ficha de cada skill muestra su licencia y su autor original.`] },
      {
        h: 'Fechas y actualizaciones',
        p: [
          'La fecha de una skill es la del último cambio de su fichero en git (hechas aquí) o la del commit original que incluimos (comunidad). La fecha de la portada y de cada sección es la más reciente entre sus skills, nunca la hora de construcción.',
          'CI comprueba cada semana si los repositorios originales han cambiado. Las actualizaciones se incorporan cuando el curador las sincroniza.',
        ],
      },
      { h: 'Qué no demuestra esto', p: ['Las comprobaciones automáticas verifican la estructura y los permisos declarados. No demuestran que una skill dé el resultado correcto en tu caso, y no revisamos cada línea de cada skill de la comunidad. Trata una skill como cualquier otro código que se ejecuta en tu ordenador.'] },
      { h: 'Avisar de un problema', p: ['¿Has visto una afirmación incorrecta, un permiso que falta o una skill rota? Cuéntanoslo en GitHub.'] },
    ],
  },
};
