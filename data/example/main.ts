#!/bin/env -S deno -A
import PocketBase from "npm:pocketbase@0.27.0";

const pocketBaseHost = Deno.env.get("PB_ADMIN_HOST");
const pocketBasePort = Deno.env.get("PB_ADMIN_PORT");
const adminEmail = Deno.env.get("PB_ADMIN_EMAIL");
const adminPassword = Deno.env.get("PB_ADMIN_PASSWORD");

const collectionsWithFiles = {
  assets: ["asset"],
};

const pb = new PocketBase(`http://${pocketBaseHost}:${pocketBasePort}`);

await pb.collection("_superusers").authWithPassword(
  adminEmail!,
  adminPassword!,
);

const restoreCollection = async function (collectionPath: string) {
  console.log(`Restoring collection from file: ${collectionPath}`);

  const text = await Deno.readTextFile(collectionPath);
  let data = JSON.parse(text);

  if (data && !Array.isArray(data)) {
    data = [data];
  }

  for (const item of data) {
    let contents = pb.collection(item.collectionId);

    const collectionWithFile = collectionsWithFiles[item.collectionName];


    delete item.collectionId;


    const collectionName = item.collectionName;
    delete item.collectionName;

    if (collectionWithFile) {
      for (const fileField of collectionWithFile) {
        if (item[fileField]) {
          item[fileField] = item[fileField].map((asset) =>
            new File([Deno.readFileSync("/data/"+collectionName+"/" + asset)], asset)
          );
        }
      }
    }

    try {
      await contents.create(
        item,
      );
    } catch (error) {
      console.error(
        `Failed to create record for collection ${item.collectionId}:`,
        error,
      );
    }
  }
};

for await (const entry of Deno.readDir("/data")) {
  if (entry.isFile && entry.name.endsWith(".json")) {
    await restoreCollection(`/data/${entry.name}`);
  }
}
