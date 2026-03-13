'use client';

import { useState } from 'react';

import { Button } from '../../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Input } from '../../components/ui/input';
import { Textarea } from '../../components/ui/textarea';

export default function ContactPage() {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Contact form submitted:', formData);
    setSubmitted(true);
  };

  return (
    <div className="container mx-auto max-w-2xl px-4 py-12">
      <h1 className="mb-6 text-center text-3xl font-bold">Contact Us</h1>
      <p className="mb-8 text-center text-muted-foreground">Have questions about Innings Pro? We&apos;d love to hear from you.</p>

      {submitted ? (
        <Card className="border-primary/30 bg-primary/10 text-center text-primary">
          <CardHeader>
            <CardTitle className="text-xl">Message Sent!</CardTitle>
            <CardDescription className="text-primary/90">Thank you for contacting us. We will get back to you shortly.</CardDescription>
          </CardHeader>
        </Card>
      ) : (
        <Card>
          <CardContent className="pt-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label htmlFor="name" className="text-sm font-medium">Name</label>
                <Input id="name" required type="text" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
              </div>
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium">Email</label>
                <Input id="email" required type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
              </div>
              <div className="space-y-2">
                <label htmlFor="message" className="text-sm font-medium">Message</label>
                <Textarea id="message" required rows={5} value={formData.message} onChange={(e) => setFormData({ ...formData, message: e.target.value })} />
              </div>
              <Button type="submit" className="w-full">Send Message</Button>
            </form>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
