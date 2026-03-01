export default function UploadPage() {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-3xl flex-col justify-center gap-8 px-6 py-12">
      <header className="space-y-3">
        <p className="inline-block rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold tracking-wide text-blue-700">
          Report ingestion
        </p>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">
          Upload scorebook report
        </h1>
        <p className="text-sm text-slate-600">
          Start by selecting a report file. Processing and validation flows will be wired in a
          later iteration.
        </p>
      </header>

      <section className="rounded-xl border border-dashed border-slate-300 bg-white p-8 shadow-sm">
        <form className="space-y-4">
          <label className="block text-sm font-medium text-slate-700" htmlFor="report-file">
            Choose report file
          </label>
          <input
            id="report-file"
            name="report-file"
            type="file"
            className="block w-full rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-700 file:mr-4 file:rounded-md file:border-0 file:bg-slate-100 file:px-3 file:py-2 file:text-sm file:font-semibold file:text-slate-700 hover:file:bg-slate-200"
          />

          {/* TODO(report-ingestion): Hook this form up to the backend upload endpoint. */}
          {/* TODO(report-ingestion): Show parse/validation status and actionable errors. */}
          {/* TODO(report-ingestion): Persist recent uploads and processing history. */}

          <button
            type="button"
            className="rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:bg-blue-300"
            disabled
          >
            Upload (coming soon)
          </button>
        </form>
      </section>
    </main>
  );
}
