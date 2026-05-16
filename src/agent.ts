import * as dotenv from "dotenv";
import * as readline from "readline";
import { Keypair } from "@solana/web3.js";
import TokenPlugin from "@solana-agent-kit/plugin-token";
import NFTPlugin from "@solana-agent-kit/plugin-nft";
import DefiPlugin from "@solana-agent-kit/plugin-defi";
import MiscPlugin from "@solana-agent-kit/plugin-misc";
import BlinksPlugin from "@solana-agent-kit/plugin-blinks";
import { ChatOpenAI } from "@langchain/openai";
import { createReactAgent } from "@langchain/langgraph/prebuilt";
import { HumanMessage } from "@langchain/core/messages";
import { MemorySaver } from "@langchain/langgraph";
import { SolanaAgentKit, createLangchainTools, KeypairWallet } from "solana-agent-kit";
import BinancePlugin from "./plugins/binance";
import SolanaReaderPlugin from "./plugins/solana-reader";

dotenv.config();

// 1. LLM apuntando a LMStudio
const llm = new ChatOpenAI({
  modelName: process.env.LMSTUDIO_MODEL || "local-model",
  configuration: {
    baseURL: "http://localhost:1234/v1",
    apiKey: "lm-studio",
  },
  temperature: 0,
  maxRetries: 2,
});

// 2. Wallet de Solana
const keypair = Keypair.fromSecretKey(
  Uint8Array.from(JSON.parse(process.env.SOLANA_PRIVATE_KEY!)));
const wallet = new KeypairWallet(keypair, process.env.RPC_URL!);
const MY_ADRS = keypair.publicKey.toBase58();

// 3. SolanaAgentKit con plugins
const solanaAgent = new SolanaAgentKit(wallet, process.env.RPC_URL!, {})
  .use(TokenPlugin)
  .use(BinancePlugin)
  .use(SolanaReaderPlugin) 
  .use(NFTPlugin)
  .use(DefiPlugin)
  .use(MiscPlugin)
  .use(BlinksPlugin);

// 4. Herramientas para LangChain
const tools = createLangchainTools(solanaAgent, solanaAgent.actions);

// 5. Memoria de conversación
const memory = new MemorySaver();
console.log("Actions registradas:", solanaAgent.actions.map(a => a.name));
console.log("Tools para LangChain:", tools.map((t: any) => t.name));
// 6. Agente ReAct
const agent = createReactAgent({
  llm,
  tools: tools as any,
  checkpointSaver: memory,
  messageModifier: `La wallet del usuario es: ${MY_ADRS}, usala para cualquier instruccion relacionada con leer "mi saldo" o "mi cuenta".`
});

async function chat() {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  console.log("🤖 Solana Agent listo. Escribe 'exit' para salir.\n");

  const threadId = "session-1";

  const askQuestion = () => {
    rl.question("Tú: ", async (input) => {
      if (input.toLowerCase() === "exit") {
        rl.close();
        return;
      }

      try {
        const response = await agent.invoke(
          { messages: [new HumanMessage(input)] },
          { configurable: { thread_id: threadId } }
        );

        const lastMsg = response.messages[response.messages.length - 1];
        console.log(`\nAgente: ${lastMsg.content}\n`);
      } catch (err) {
        console.error("Error:", err);
      }

      askQuestion();
    });
  };

  askQuestion();
}

chat();