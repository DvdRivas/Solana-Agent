import * as fs from "fs";
import * as path from "path";

const REGISTRY_PATH = path.resolve(__dirname, "../../../data/spl-registry.json");

interface TokenEntry {
  mint_address: string;
  payer_ata: string;
  name: string;
  symbol: string;
  decimals: number;
  created_at: string;
}

interface SPLRegistry {
  tokens: TokenEntry[];
}

function readRegistry(): SPLRegistry {
  const raw = fs.readFileSync(REGISTRY_PATH, "utf8");
  return JSON.parse(raw);
}

function writeRegistry(registry: SPLRegistry): void {
  fs.writeFileSync(REGISTRY_PATH, JSON.stringify(registry, null, 2), "utf8");
}

export function addToken(entry: Omit<TokenEntry, "created_at">): void {
  const registry = readRegistry();
  registry.tokens.push({ ...entry, created_at: new Date().toISOString() });
  writeRegistry(registry);
}

export function removeToken(mint_address: string): void {
  const registry = readRegistry();
  registry.tokens = registry.tokens.filter(t => t.mint_address !== mint_address);
  writeRegistry(registry);
}

export function listSPLRegistry(): SPLRegistry {
  return readRegistry();
}