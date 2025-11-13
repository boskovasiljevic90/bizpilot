export default function Home() {
  return (
    <main className="min-h-screen flex items-center justify-center p-8">
      <div className="max-w-2xl text-center space-y-6">
        <h1 className="text-4xl font-bold">BizPilot – AI Google Business Manager</h1>
        <p>Automatizuj objave, odgovore na recenzije i analitiku. Probaj besplatno ili aktiviraj 14 dana trial.</p>
        <div className="flex gap-4 justify-center">
          <a className="px-4 py-2 rounded bg-black text-white" href="/api/auth/google">Poveži Google profil</a>
          <a className="px-4 py-2 rounded border" href="/dashboard">Idi na Dashboard</a>
        </div>
      </div>
    </main>
  );
}
