import { Activity, BarChart2, Download, CheckCircle2 } from 'lucide-react';

import { UploadCard } from '../components/upload/UploadCard';

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48 bg-muted/30">
        <div className="container px-4 md:px-6 mx-auto max-w-7xl">
          <div className="flex flex-col items-center space-y-4 text-center">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none">
                Generate Beautiful Cricket Match Reports
              </h1>
              <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl mt-4 mb-8">
                Upload your Innings Pro match JSON. Instantly generate scorecards, charts and downloadable reports.
              </p>
            </div>
            <div className="w-full max-w-sm space-y-2">
              <UploadCard />
            </div>
          </div>
        </div>
      </section>

      <section className="w-full py-12 md:py-24 lg:py-32 bg-background">
        <div className="container px-4 md:px-6 mx-auto max-w-7xl">
          <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
            <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">Features</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex flex-col items-center text-center p-6 border rounded-2xl bg-card shadow-sm">
              <BarChart2 className="h-12 w-12 text-primary mb-4" />
              <h3 className="text-xl font-bold mb-2">Detailed Charts</h3>
              <p className="text-muted-foreground">Visualize run rates, runs per over, and match progression instantly.</p>
            </div>
            <div className="flex flex-col items-center text-center p-6 border rounded-2xl bg-card shadow-sm">
              <Activity className="h-12 w-12 text-primary mb-4" />
              <h3 className="text-xl font-bold mb-2">Beautiful Scorecards</h3>
              <p className="text-muted-foreground">Clear, easy to read batting and bowling scorecards with key statistics.</p>
            </div>
            <div className="flex flex-col items-center text-center p-6 border rounded-2xl bg-card shadow-sm">
              <Download className="h-12 w-12 text-primary mb-4" />
              <h3 className="text-xl font-bold mb-2">Multiple Exports</h3>
              <p className="text-muted-foreground">Export your reports to high-quality PDF or detailed Excel sheets.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="w-full py-12 md:py-24 lg:py-32 bg-muted/30">
        <div className="container px-4 md:px-6 mx-auto max-w-7xl">
          <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
            <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">How It Works</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="flex flex-col items-center text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/15 text-primary mb-4 font-bold text-2xl">
                1
              </div>
              <h3 className="text-xl font-bold mb-2">Export from Mobile</h3>
              <p className="text-muted-foreground">Finish your match in the Innings Pro mobile app and tap &quot;Export Match Report&quot;.</p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/15 text-primary mb-4 font-bold text-2xl">
                2
              </div>
              <h3 className="text-xl font-bold mb-2">Upload JSON</h3>
              <p className="text-muted-foreground">Drag and drop the generated JSON file into the upload zone above.</p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/15 text-primary mb-4 font-bold text-2xl">
                3
              </div>
              <h3 className="text-xl font-bold mb-2">View & Export</h3>
              <p className="text-muted-foreground">View your generated report, charts, and download as PDF or Excel.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
