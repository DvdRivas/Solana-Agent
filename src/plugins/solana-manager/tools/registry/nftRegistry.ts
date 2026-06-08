import * as fs from "fs";
import * as path from "path";

const REGISTRY_PATH = path.resolve(__dirname, "../../../data/nft-registry.json");

interface AssetEntry {
  asset_address: string;
  name: string;
  uri: string;
  collection?: string;
  created_at: string;
}

interface CollectionEntry {
  collection_address: string;
  name: string;
  uri: string;
  created_at: string;
}

interface NFTRegistry {
  assets: AssetEntry[];
  collections: CollectionEntry[];
}

function readRegistry(): NFTRegistry {
  const raw = fs.readFileSync(REGISTRY_PATH, "utf8");
  return JSON.parse(raw);
}

function writeRegistry(registry: NFTRegistry): void {
  fs.writeFileSync(REGISTRY_PATH, JSON.stringify(registry, null, 2), "utf8");
}

export function addAsset(entry: Omit<AssetEntry, "created_at">): void {
  const registry = readRegistry();
  registry.assets.push({ ...entry, created_at: new Date().toISOString() });
  writeRegistry(registry);
}

export function removeAsset(asset_address: string): void {
  const registry = readRegistry();
  registry.assets = registry.assets.filter(a => a.asset_address !== asset_address);
  writeRegistry(registry);
}

export function updateAssetEntry(
  asset_address: string,
  fields: Partial<Pick<AssetEntry, "name" | "uri">>
): void {
  const registry = readRegistry();
  const idx = registry.assets.findIndex(a => a.asset_address === asset_address);
  if (idx !== -1) {
    registry.assets[idx] = { ...registry.assets[idx], ...fields };
    writeRegistry(registry);
  }
}

export function addCollection(entry: Omit<CollectionEntry, "created_at">): void {
  const registry = readRegistry();
  registry.collections.push({ ...entry, created_at: new Date().toISOString() });
  writeRegistry(registry);
}

export function removeCollection(collection_address: string): void {
  const registry = readRegistry();
  registry.collections = registry.collections.filter(
    c => c.collection_address !== collection_address
  );
  writeRegistry(registry);
}

export function listNFTRegistry(): NFTRegistry {
  return readRegistry();
}