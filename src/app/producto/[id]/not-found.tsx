import Link from "next/link";

export default function ProductNotFound() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-dgn-base-950 px-4 text-center">
      <span className="font-mono text-6xl text-dgn-primary-800">404</span>
      <h1 className="mt-4 text-2xl font-bold text-dgn-text-50">Producto no encontrado</h1>
      <p className="mt-2 text-dgn-text-300">Este servicio no existe o fue removido.</p>
      <Link
        href="/"
        className="mt-6 rounded-lg bg-dgn-primary-600 px-6 py-3 text-sm font-medium text-dgn-text-50 hover:bg-dgn-primary-500"
      >
        Volver al catálogo
      </Link>
    </main>
  );
}
