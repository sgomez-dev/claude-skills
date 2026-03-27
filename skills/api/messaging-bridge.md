---
description: Genera un servicio puente entre plataformas de mensajería (Telegram, WhatsApp, Instagram, Messenger) y Claude API
permissions:
  reads: ["**/*"]
  writes: ["**/*"]
  commands: ["npm init", "npm install", "npx tsc", "node *", "mkdir *", "docker *"]
  network: true
  destructive: false
---

Genera un proyecto completo de servidor Node.js/TypeScript que actúa como puente bidireccional
entre múltiples plataformas de mensajería (Telegram, WhatsApp, Instagram, Facebook Messenger) y
la API de Claude. Cada usuario tiene su propia sesión conversacional con contexto persistente.

El usuario puede especificar qué plataformas quiere soportar, o por defecto se generan todas.

Input del usuario: `$ARGUMENTS`

Pasos:

1. **Analizar el input del usuario**
   - Detectar si especifica plataformas concretas (ej: "solo Telegram y WhatsApp") o si quiere todas
   - Detectar si hay un directorio de proyecto existente o si se debe crear uno nuevo
   - Detectar si el usuario tiene preferencia de base de datos (PostgreSQL, SQLite, Redis)
   - Si no se especifica nada, usar defaults: todas las plataformas, SQLite para desarrollo, proyecto nuevo

2. **Crear la estructura del proyecto**

   ```
   messaging-bridge/
   ├── src/
   │   ├── index.ts                  # Entry point — Express server + webhook routes
   │   ├── config.ts                 # Configuración centralizada desde env vars
   │   ├── platforms/
   │   │   ├── types.ts              # Interfaz común: IncomingMessage, OutgoingMessage, Platform
   │   │   ├── telegram.ts           # Webhook handler + message sender para Telegram Bot API
   │   │   ├── whatsapp.ts           # Webhook handler + sender para WhatsApp Cloud API (Meta)
   │   │   ├── instagram.ts          # Webhook handler + sender para Instagram Messaging API (Meta)
   │   │   ├── messenger.ts          # Webhook handler + sender para Facebook Messenger (Meta)
   │   │   └── index.ts              # Registry de plataformas habilitadas
   │   ├── claude/
   │   │   ├── client.ts             # Wrapper sobre @anthropic-ai/sdk con retry y rate limiting
   │   │   └── session.ts            # Gestión de historial de conversación por usuario
   │   ├── sessions/
   │   │   ├── store.ts              # Interfaz abstracta SessionStore
   │   │   ├── sqlite-store.ts       # Implementación SQLite (better-sqlite3)
   │   │   └── memory-store.ts       # Implementación en memoria (para tests)
   │   ├── middleware/
   │   │   ├── webhook-validator.ts  # Validación de firmas de webhook por plataforma
   │   │   └── rate-limiter.ts       # Rate limiting por usuario
   │   └── utils/
   │       ├── logger.ts             # Logger estructurado (pino)
   │       └── errors.ts             # Clases de error tipadas
   ├── tests/
   │   ├── platforms/
   │   │   └── telegram.test.ts      # Tests del handler de Telegram
   │   ├── claude/
   │   │   └── session.test.ts       # Tests de gestión de sesiones
   │   └── webhook-validator.test.ts # Tests de validación de webhooks
   ├── docker-compose.yml            # Desarrollo local con ngrok para webhooks
   ├── Dockerfile                    # Imagen de producción multi-stage
   ├── .env.example                  # Template de variables de entorno
   ├── tsconfig.json
   ├── package.json
   └── README.md                     # Guía de configuración paso a paso
   ```

3. **Generar `package.json`**
   ```json
   {
     "name": "messaging-bridge",
     "version": "1.0.0",
     "private": true,
     "scripts": {
       "dev": "tsx watch src/index.ts",
       "build": "tsc",
       "start": "node dist/index.js",
       "test": "vitest run",
       "test:watch": "vitest"
     }
   }
   ```
   Dependencias:
   - `express` + `@types/express` — servidor HTTP y rutas de webhook
   - `@anthropic-ai/sdk` — cliente oficial de Claude
   - `better-sqlite3` + `@types/better-sqlite3` — sesiones persistentes
   - `pino` + `pino-pretty` — logging estructurado
   - `tsx` — ejecución TypeScript en desarrollo
   - `typescript` — compilación
   - `vitest` — testing
   - `zod` — validación de payloads entrantes
   - `helmet` — seguridad HTTP básica
   - `express-rate-limit` — rate limiting

4. **Generar `src/config.ts`**
   Usar zod para validar las variables de entorno al inicio:
   ```typescript
   const envSchema = z.object({
     PORT: z.coerce.number().default(3000),
     ANTHROPIC_API_KEY: z.string().min(1),
     CLAUDE_MODEL: z.string().default('claude-sonnet-4-20250514'),
     CLAUDE_MAX_TOKENS: z.coerce.number().default(1024),
     CLAUDE_SYSTEM_PROMPT: z.string().optional(),
     // Telegram
     TELEGRAM_BOT_TOKEN: z.string().optional(),
     TELEGRAM_WEBHOOK_SECRET: z.string().optional(),
     // WhatsApp (Meta Cloud API)
     WHATSAPP_VERIFY_TOKEN: z.string().optional(),
     WHATSAPP_ACCESS_TOKEN: z.string().optional(),
     WHATSAPP_PHONE_NUMBER_ID: z.string().optional(),
     WHATSAPP_APP_SECRET: z.string().optional(),
     // Instagram
     INSTAGRAM_VERIFY_TOKEN: z.string().optional(),
     INSTAGRAM_ACCESS_TOKEN: z.string().optional(),
     INSTAGRAM_APP_SECRET: z.string().optional(),
     // Messenger
     MESSENGER_VERIFY_TOKEN: z.string().optional(),
     MESSENGER_ACCESS_TOKEN: z.string().optional(),
     MESSENGER_APP_SECRET: z.string().optional(),
     // DB
     DATABASE_PATH: z.string().default('./data/sessions.db'),
   });
   ```
   Exportar config tipado. Lanzar error descriptivo si falta `ANTHROPIC_API_KEY`.

5. **Generar `src/platforms/types.ts`**
   Definir interfaz común para todas las plataformas:
   ```typescript
   interface IncomingMessage {
     platform: 'telegram' | 'whatsapp' | 'instagram' | 'messenger';
     userId: string;        // ID único del usuario en la plataforma
     userName?: string;      // Nombre legible del usuario
     text: string;           // Contenido del mensaje
     rawPayload: unknown;    // Payload original para debugging
     timestamp: Date;
   }

   interface OutgoingMessage {
     platform: string;
     userId: string;
     text: string;
   }

   interface PlatformAdapter {
     name: string;
     isConfigured(): boolean;
     registerRoutes(router: express.Router): void;
     sendMessage(msg: OutgoingMessage): Promise<void>;
     validateWebhook(req: express.Request): boolean;
   }
   ```

6. **Generar cada adaptador de plataforma**

   **Telegram (`src/platforms/telegram.ts`):**
   - Ruta POST `/webhook/telegram` — recibe updates del Bot API
   - Validar `X-Telegram-Bot-Api-Secret-Token` header
   - Parsear `update.message.text`, extraer `chat.id` como userId
   - Enviar respuesta via `POST https://api.telegram.org/bot<token>/sendMessage`
   - Soportar mensajes largos (split en chunks de 4096 chars)
   - Enviar "typing" action mientras Claude procesa

   **WhatsApp (`src/platforms/whatsapp.ts`):**
   - Ruta GET `/webhook/whatsapp` — verificación de webhook (challenge)
   - Ruta POST `/webhook/whatsapp` — mensajes entrantes
   - Validar firma HMAC-SHA256 con `X-Hub-Signature-256`
   - Parsear mensajes de tipo `text` del payload de WhatsApp Cloud API
   - Enviar respuesta via `POST https://graph.facebook.com/v21.0/{phone_number_id}/messages`
   - Marcar mensajes como leídos automáticamente

   **Instagram (`src/platforms/instagram.ts`):**
   - Ruta GET `/webhook/instagram` — verificación
   - Ruta POST `/webhook/instagram` — mensajes entrantes
   - Validar firma HMAC-SHA256 con `X-Hub-Signature-256`
   - Parsear mensajes del Instagram Messaging API
   - Enviar respuesta via Graph API
   - Manejar el echo de mensajes propios (ignorarlos)

   **Messenger (`src/platforms/messenger.ts`):**
   - Ruta GET `/webhook/messenger` — verificación
   - Ruta POST `/webhook/messenger` — mensajes entrantes
   - Validar firma HMAC-SHA256 con `X-Hub-Signature-256`
   - Parsear messaging entries del webhook
   - Enviar respuesta via `POST https://graph.facebook.com/v21.0/me/messages`
   - Enviar sender action "typing_on" mientras Claude procesa

   Cada adaptador:
   - Implementa `PlatformAdapter`
   - Solo se registra si sus env vars están configuradas (`isConfigured()`)
   - Loguea errores con pino incluyendo platform y userId
   - Tiene timeout de 25s para la respuesta de Claude (los webhooks de Meta requieren respuesta < 30s)

7. **Generar `src/claude/client.ts`**
   ```typescript
   import Anthropic from '@anthropic-ai/sdk';

   export class ClaudeClient {
     private client: Anthropic;

     constructor(apiKey: string) {
       this.client = new Anthropic({ apiKey });
     }

     async chat(messages: Array<{role: 'user'|'assistant', content: string}>, options?: {
       model?: string;
       maxTokens?: number;
       systemPrompt?: string;
     }): Promise<string> {
       const response = await this.client.messages.create({
         model: options?.model ?? config.CLAUDE_MODEL,
         max_tokens: options?.maxTokens ?? config.CLAUDE_MAX_TOKENS,
         system: options?.systemPrompt ?? config.CLAUDE_SYSTEM_PROMPT,
         messages,
       });
       // Extraer texto del response
       const textBlock = response.content.find(b => b.type === 'text');
       return textBlock?.text ?? '';
     }
   }
   ```

8. **Generar `src/claude/session.ts`**
   - Gestionar el historial de mensajes por `platform:userId`
   - Cargar historial desde el store al recibir un mensaje
   - Añadir el mensaje del usuario, llamar a Claude con el historial completo, guardar la respuesta
   - Limitar historial a últimos N turnos (configurable, default 20) para no exceder tokens
   - Función `resetSession(platform, userId)` para que el usuario pueda empezar de nuevo
   - Detectar comando especial `/reset` o `/nuevo` para reiniciar sesión

9. **Generar `src/sessions/store.ts` y `sqlite-store.ts`**
   - Tabla: `sessions(id TEXT PRIMARY KEY, platform TEXT, user_id TEXT, messages TEXT, created_at TEXT, updated_at TEXT)`
   - `messages` almacenado como JSON array
   - Métodos: `getSession`, `saveSession`, `deleteSession`, `listSessions`
   - `memory-store.ts`: implementación con Map para tests

10. **Generar `src/middleware/webhook-validator.ts`**
    - Función genérica `validateHmacSignature(payload, signature, secret, algorithm)` para las plataformas Meta
    - Validación específica para Telegram (comparar secret token del header)
    - Middleware Express que rechaza requests con firma inválida (HTTP 403)
    - Loguear intentos de webhook con firma inválida

11. **Generar `src/index.ts`**
    El entry point:
    ```typescript
    const app = express();
    app.use(helmet());
    // Raw body necesario para validar firmas HMAC
    app.use(express.json({ verify: (req, res, buf) => { req.rawBody = buf; } }));

    // Registrar solo las plataformas configuradas
    const platforms = [telegram, whatsapp, instagram, messenger]
      .filter(p => p.isConfigured());

    platforms.forEach(p => {
      p.registerRoutes(router);
      logger.info(`Platform registered: ${p.name}`);
    });

    // Health check
    app.get('/health', (req, res) => res.json({ status: 'ok', platforms: platforms.map(p => p.name) }));

    app.listen(config.PORT, () => {
      logger.info(`Messaging bridge running on port ${config.PORT}`);
      logger.info(`Active platforms: ${platforms.map(p => p.name).join(', ')}`);
    });
    ```

12. **Generar `.env.example`**
    Con todas las variables documentadas con comentarios explicativos.

13. **Generar `docker-compose.yml`**
    ```yaml
    services:
      bridge:
        build: .
        ports:
          - "3000:3000"
        env_file: .env
        volumes:
          - ./data:/app/data
      ngrok:
        image: ngrok/ngrok:latest
        command: http bridge:3000
        ports:
          - "4040:4040"
        environment:
          - NGROK_AUTHTOKEN=${NGROK_AUTHTOKEN}
    ```

14. **Generar `Dockerfile`**
    Multi-stage build:
    - Stage 1: `node:20-alpine` para compilar TypeScript
    - Stage 2: `node:20-alpine` solo con dist/ y node_modules de producción
    - Exponer puerto 3000, user no-root

15. **Generar `README.md`**
    Guía completa con:

    **Configuración rápida:**
    1. Clonar, `npm install`, copiar `.env.example` a `.env`
    2. Añadir `ANTHROPIC_API_KEY`
    3. `npm run dev`

    **Configuración de Telegram (guía paso a paso):**
    1. Hablar con @BotFather en Telegram
    2. Crear bot con `/newbot`
    3. Copiar el token al `.env`
    4. Exponer el servidor con ngrok: `ngrok http 3000`
    5. Registrar webhook: `curl https://api.telegram.org/bot<TOKEN>/setWebhook?url=https://<NGROK_URL>/webhook/telegram&secret_token=<SECRET>`
    6. Enviar mensaje al bot y verificar respuesta

    **Configuración de WhatsApp:**
    1. Crear app en Meta for Developers
    2. Activar producto WhatsApp
    3. Configurar webhook URL + verify token
    4. Suscribirse a `messages` webhook field
    5. Copiar tokens al `.env`

    **Configuración de Instagram:**
    1. Crear app en Meta for Developers
    2. Activar producto Instagram
    3. Configurar webhook URL
    4. Solicitar permisos `instagram_manage_messages`
    5. Vincular página de Instagram

    **Configuración de Messenger:**
    1. Crear app en Meta for Developers
    2. Activar producto Messenger
    3. Vincular página de Facebook
    4. Configurar webhook URL + verify token + suscripción a `messages`
    5. Copiar page access token al `.env`

    **Arquitectura:**
    Incluir diagrama ASCII del flujo:
    ```
    [User] → [Platform] → [Webhook] → [Validator] → [Session Manager] → [Claude API]
                                                                              ↓
    [User] ← [Platform] ← [Send API] ← ──────────── [Response] ← ──────────┘
    ```

16. **Generar tests básicos**
    - Test de validación de firma HMAC
    - Test de gestión de sesiones (crear, actualizar, reset, límite de historial)
    - Test del handler de Telegram (mock de request/response)
    - Usar `vitest` con `memory-store`

17. **Ejecutar setup inicial**
    - Crear el directorio del proyecto
    - Escribir todos los archivos
    - Ejecutar `npm install`
    - Ejecutar `npx tsc --noEmit` para verificar que compila
    - Ejecutar `npm test` para verificar que los tests pasan
    - Reportar resultado al usuario

**Notas técnicas importantes:**
- Los webhooks de Meta (WhatsApp/Instagram/Messenger) requieren responder HTTP 200 **antes** de procesar — usar respuesta inmediata + procesamiento async
- Telegram permite hasta 30s de respuesta pero enviar "typing" mejora UX
- La validación HMAC-SHA256 requiere el raw body, no el body parseado por Express
- Para WhatsApp, los mensajes de status/read receipts también llegan al webhook — filtrarlos
- Instagram puede enviar "echo" de tus propios mensajes — verificar `message.is_echo`
- El rate limit de Claude API debe respetarse — implementar cola simple si hay muchos usuarios
- SQLite es suficiente para miles de usuarios; para escalar, migrar a PostgreSQL
- Nunca loguear tokens o API keys — usar `pino` con redaction

$ARGUMENTS
