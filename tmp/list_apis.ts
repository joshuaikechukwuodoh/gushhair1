import { appRouter } from "../backend/src/routers/_app";

function listProcedures(router: any, prefix = "") {
  const procedures = router._def.procedures || {};
  for (const [key, procedure] of Object.entries(procedures)) {
    const fullPath = prefix ? `${prefix}.${key}` : key;
    const def = (procedure as any)._def;
    
    // In tRPC v10/v11, query vs mutation is often in different places
    const type = def.type ? def.type.toUpperCase() : "PROCEDURE";
    
    // Middlewares for protectedProcedure usually starts with 1 or more
    const isProtected = def.middlewares && def.middlewares.length > 0;
    
    const access = isProtected ? "🔒" : "🔓";
    console.log(`${access} ${type.padEnd(8)} | ${fullPath}`);
  }

  // Handle nested routers (v11 structure)
  const record = (router as any)._def.record || {};
  for (const [key, subRouter] of Object.entries(record)) {
    if (subRouter && (subRouter as any)._def && (subRouter as any)._def.procedures) {
      listProcedures(subRouter, prefix ? `${prefix}.${key}` : key);
    }
  }
}

console.log("\n--- BACKEND API ROUTES ---\n");
console.log("ACCESS | TYPE     | PATH");
console.log("-------|----------|-------------------");
listProcedures(appRouter);
console.log("\n----------------------------\n");

process.exit(0);
