import { execSync } from "node:child_process";

const MAX_ATTEMPTS = 30;

for (let i = 1; i <= MAX_ATTEMPTS; i++) {
  try {
    execSync(
      "docker compose exec -T postgres pg_isready -U postgres -d viva_barrio",
      { stdio: "pipe" },
    );
    console.log("✓ PostgreSQL listo");
    process.exit(0);
  } catch {
    if (i === MAX_ATTEMPTS) {
      console.error(
        "✗ PostgreSQL no respondió a tiempo. ¿Está Docker Desktop en ejecución?",
      );
      process.exit(1);
    }
    console.log(`  Esperando PostgreSQL… (${i}/${MAX_ATTEMPTS})`);
    await new Promise((r) => setTimeout(r, 1000));
  }
}
