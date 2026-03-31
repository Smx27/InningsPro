'use client';

import { useState } from 'react';

import { Button } from '../../components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '../../components/ui/Card';
import { Input } from '../../components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../components/ui/select';
import { Textarea } from '../../components/ui/textarea';

export default function SupportPage() {
  const [formData, setFormData] = useState({ matchId: '', issueType: '', description: '' });
  const [file, setFile] = useState<File | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="container mx-auto max-w-2xl px-4 py-12">
      <h1 className="mb-6 text-center text-3xl font-bold">Support Request</h1>
      <p className="mb-8 text-center text-muted-foreground">
        Need help with a match report? Please provide details below.
      </p>

      {submitted ? (
        <Card className="border-primary/30 bg-primary/10 text-center text-primary">
          <CardHeader>
            <CardTitle className="text-xl">Ticket Submitted!</CardTitle>
            <CardDescription className="text-primary/90">
              Our support team will look into your issue and get back to you.
            </CardDescription>
          </CardHeader>
        </Card>
      ) : (
        <Card>
          <CardContent className="pt-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label htmlFor="matchId" className="text-sm font-medium">
                  Match ID (Optional)
                </label>
                <Input
                  id="matchId"
                  type="text"
                  value={formData.matchId}
                  onChange={(e) => setFormData({ ...formData, matchId: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="issueType" className="text-sm font-medium">
                  Issue Type
                </label>
                <Select
                  value={formData.issueType}
                  onValueChange={(value) => setFormData({ ...formData, issueType: value })}
                >
                  <SelectTrigger id="issueType">
                    <SelectValue placeholder="Select issue type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="upload">Upload Problem</SelectItem>
                    <SelectItem value="parsing">Parsing Error</SelectItem>
                    <SelectItem value="export">Export Issue</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label htmlFor="description" className="text-sm font-medium">
                  Description
                </label>
                <Textarea
                  id="description"
                  required
                  rows={5}
                  placeholder="Please describe the issue in detail..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="screenshot" className="text-sm font-medium">
                  Screenshot (Optional)
                </label>
                <Input
                  id="screenshot"
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const [selectedFile] = Array.from(e.target.files ?? []);
                    setFile(selectedFile ?? null);
                  }}
                />
              </div>

              <Button type="submit" className="w-full">
                Submit Support Request
              </Button>
            </form>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
