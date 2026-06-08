# WayLearn Solana Agent

Agente adaptado para su intracción con la blockchain de Solana y mercados cripto para consultar precios mediante binance desde la terminal. Este proyecto esta construido sobre [solana-agent-kit v2](https://github.com/sendaifun/solana-agent-kit/tree/v2) de SendAI. 

## Capacidades 🧠

### 🪙 Tokens SPL (Token-2022)
- Crear tokens con metadata embebida (nombre, símbolo, URI)
- Acuñar tokens a cualquier ATA
- Transferir tokens entre wallets (crea la ATA destino automáticamente)
- Quemar tokens
- Congelar y descongelar token accounts
- Cambiar o revocar autoridades (mint, freeze, owner, close)
- Aprobar y revocar delegados
- Cerrar token accounts y recuperar SOL de renta

### 🖼️ NFTs (Metaplex Core)
- Crear NFTs individuales (assets) con metadata JSON
- Crear colecciones NFT
- Transferir NFTs a otras wallets
- Quemar NFTs
- Actualizar nombre y/o URI de metadata
- Agregar royalties a NFTs (en basis points)
- Agregar atributos on-chain a NFTs

### 📊 Mercados (Binance)
- Consultar precio en tiempo real de cualquier par (SOLUSDT, BTCUSDT, ETHUSDT, etc.)
- Obtener estadísticas de 24 horas (precio, cambio porcentual, volumen, máximo y mínimo)
- Obtener historial de velas (candlesticks) con intervalos configurables (1m, 5m, 15m, 1h, 4h, 1d)

### 🔍 Explorador de Solana (RPC)
- Consultar balance SOL de cualquier wallet
- Listar tokens SPL de una wallet con cantidades y precio en USD (vía Jupiter)
- Ver NFTs de una wallet con metadata completa (nombre, imagen, atributos, colección)
- Obtener resumen completo de cualquier cuenta (balance + tokens + transacciones recientes)
- Consultar detalles completos de una transacción (estado, fee, cambios de balance, instrucciones, logs)
- Ver historial de transacciones de cualquier wallet
- Obtener información de cualquier token por mint address (supply, precio, market cap, top holders)

### 🗂️ Registros locales
- Registro persistente de tokens SPL creados (mint address, ATA, nombre, símbolo, decimales)
- Registro persistente de NFTs y colecciones creados (asset address, nombre, URI, colección)
- Listar tokens y NFTs creados en sesiones anteriores
- Eliminar entradas del registro manualmente
- Eliminación automática del registro cuando se quema un token con supply = 0 o un NFT


## Requisitos 📜

- [Node.js](https://nodejs.org/) v18 o superior
- [pnpm](https://pnpm.io/)
- Wallet de Solana con SOL (devnet o mainnet)
- [LM Studio](https://lmstudio.ai/) con un modelo compatible con function calling (recomendado: Qwen2.5 7B Instruct o superior)


## Instalación 🏗️

### 1. Instalar Node.js

Descarga e instala Node.js desde con: 

```bash
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.4/install.sh | bash
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
nvm install node
nvm use node
```

Verifica la instalación:

```bash
node --version
```

### 2. Instalar pnpm

```bash
npm install -g pnpm
```

### 3. Clonar el repositorio e instalar dependencias

```bash
git clone <url-del-repo>
cd <nombre-del-repo>
pnpm install
```


## Configuración 🛠️

### 1. Variables de entorno

Adapta el `.env` en la raíz del proyecto:

```env
SOLANA_PRIVATE_KEY=[12,34,56,...]   # Tu keypair como array de bytes
RPC_URL=https://api.devnet.solana.com
LMSTUDIO_MODEL=qwen2.5-7b-instruct  # Nombre exacto del modelo en LM Studio
OPENAI_API_KEY=lm-studio            # Requerido por LangChain, cualquier valor sirve
```

### 4. LM Studio


1. Descarga LM Studio en el siguiente enlace 👉 [LM Studio](https://lmstudio.ai/).
> ℹ️ Se recomienda descargar la version de CLI sin GUI
2. Una vez descargado usa los siguientes comandos para descargar y utilizar un modelo (recomendado: Qwen2.5 7B Instruct Q4):
```bash
lms # muestra todos los comandos disponibles 
lms get # despliega la lista de modelos para descargar
lms load <ModelName> --gpu max --context-length 120000 # carga el modelo localmente 
lms server start # inicia el servidor local en el puerto 1234
lms log stream # ver los logs de las peticiones (OPCIONAL)
```
3. Al terminar tu sesion, ejecuta:

```bash
lms server stop # para detener el servidor
lms unload # descarga el modelo de la grafica (libera recursos)
```

> ⚠️ Recuerda que el nombre del modelo debe coincidir al de el .env

## Inicializar el Agente 🤖

En la carpeta raiz del proyecto ejecuta:
```bash
pnpm start
```

El agente iniciará en modo conversacional en la terminal. Escribe `exit` para salir.

### Ejemplos de peticiones 

**Mercados**
* ¿Cuál es el precio actual de SOL?
* Dame las estadísticas de BTCUSDT de las últimas 24 horas
* Muéstrame las últimas 5 velas de 1 hora de ETHUSDT

**Explorador**
* ¿Cuál es mi saldo?
* Dame el overview de esta wallet: 9WzDXwBbmkg8ZTbNMqUxvQRAyrZzDsGYdLVL9zYtAWWM
* Muéstrame el historial de mis últimas 10 transacciones
* Detalles de esta transacción: 5UfgJ...

**Tokens SPL**
* Crea un token con nombre "Mi Token", símbolo MTK y URI https://...
* Muéstrame mis tokens creados
* Transfiere 100 MTK a la wallet 9WzDX...

**NFTs**
* Crea un NFT con nombre "Mi NFT #1" y URI https://...
* Crea una colección llamada "Mi Colección" con URI https://...
* Muéstrame mis NFTs creados
* Transfiere el NFT 7xPq... a la wallet 9mKr...

## ⚠️ Notas importantes ⚠️

- El agente opera sobre **devnet por defecto**. Para mainnet cambia `RPC_URL` en el `.env`.
- Las operaciones de escritura (crear tokens, NFTs, transferir) consumen SOL real en mainnet.
- En devnet puedes obtener SOL de prueba con `solana airdrop 2 <tu-wallet> --url devnet`.
- Los modelos locales pequeños (7B) pueden tener dificultades con function calling complejo. Se recomienda usar modelos de 14B o superior para mayor confiabilidad.
- El context length mínimo requerido depende de cuántos plugins estén activos — con todos los plugins activos se recomienda `32768` o superior.