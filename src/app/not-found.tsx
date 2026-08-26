import Link from "next/link";
import { Home, Compass } from "lucide-react";

export default function NotFound() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-dgn-base-950 px-4 text-center">
      <div className="dgn-float mb-2">
        <span className="dgn-text-flow font-mono text-8xl font-extrabold sm:text-9xl">404</span>
      </div>
      <h1 className="mt-4 text-3xl font-bold text-dgn-text-50">Página no encontrada</h1>
      <p className="mt-2 flex items-center justify-center gap-2 text-dgn-text-300">
        <Compass className="h-4 w-4" />
        La ruta que buscas no existe en Diginast.
      </p>
      <Link
        href="/"
        className="dgn-ripple group mt-8 inline-flex items-center gap-2 rounded-lg bg-dgn-primary-600 px-6 py-3 text-sm font-medium text-dgn-text-50 hover:bg-dgn-primary-500 transition-colors"
      >
        <Home className="h-4 w-4" />
        Volver al inicio
      </Link>
    </main>
  );
}
