"use client";

import { useState } from 'react';

export default function SupportPage() {
  const [formData, setFormData] = useState({ matchId: '', issueType: '', description: '' });
  const [file, setFile] = useState<File | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Support ticket submitted:', { ...formData, file });
    setSubmitted(true);
  };

  return (
    <div className="container mx-auto px-4 py-12 max-w-2xl">
      <h1 className="text-3xl font-bold mb-6 text-center">Support Request</h1>
      <p className="text-muted-foreground text-center mb-8">
        Need help with a match report? Please provide details below.
      </p>

      {submitted ? (
        <div className="bg-green-50 border border-green-200 text-green-800 rounded-xl p-8 text-center dark:bg-green-950/30 dark:border-green-900/50 dark:text-green-400">
          <h2 className="text-xl font-bold mb-2">Ticket Submitted!</h2>
          <p>Our support team will look into your issue and get back to you.</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6 bg-card p-8 rounded-xl border shadow-sm">
          <div className="space-y-2">
            <label htmlFor="matchId" className="text-sm font-medium">Match ID (Optional)</label>
            <input
              id="matchId"
              type="text"
              className="w-full flex h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              value={formData.matchId}
              onChange={(e) => setFormData({ ...formData, matchId: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="issueType" className="text-sm font-medium">Issue Type</label>
            <select
              id="issueType"
              required
              className="w-full flex h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              value={formData.issueType}
              onChange={(e) => setFormData({ ...formData, issueType: e.target.value })}
            >
              <option value="">Select an issue type...</option>
              <option value="parsing">Report Parsing Error</option>
              <option value="data">Incorrect Data Displayed</option>
              <option value="export">PDF/Excel Export Issue</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div className="space-y-2">
            <label htmlFor="description" className="text-sm font-medium">Description</label>
            <textarea
              id="description"
              required
              rows={5}
              placeholder="Please describe the issue in detail..."
              className="w-full flex min-h-[80px] rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="screenshot" className="text-sm font-medium">Screenshot (Optional)</label>
            <input
              id="screenshot"
              type="file"
              accept="image/*"
              className="w-full flex h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              onChange={(e) => {
                const files = e.target.files;
                setFile((files && files.length > 0) ? (files[0] || null) : null);
              }}
            />
          </div>

          <button
            type="submit"
            className="w-full inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-green-600 text-white hover:bg-green-700 h-10 px-4 py-2"
          >
            Submit Support Request
          </button>
        </form>
      )}
    </div>
  );
}
