'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { ArrowUpRight } from 'lucide-react';
import { WHATSAPP_NUMBER_RAW } from '@/lib/constants';

export default function QuoteForm({ trigger }) {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', service: '', message: '' });

  const handleSubmit = (e) => {
    e.preventDefault();
    const whatsappMessage = encodeURIComponent(
      `New Quote Request\n\nName: ${formData.name}\nEmail: ${formData.email}\nPhone: ${formData.phone}\nService: ${formData.service || 'General'}\nMessage: ${formData.message}`
    );
    window.open(`https://wa.me/${WHATSAPP_NUMBER_RAW}?text=${whatsappMessage}`, '_blank');
    toast.success('Opening WhatsApp to send your request…');
    setOpen(false);
    setFormData({ name: '', email: '', phone: '', service: '', message: '' });
  };

  const set = (k) => (e) => setFormData((p) => ({ ...p, [k]: e.target.value }));

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || <button className="btn-ember text-sm">Get a Quote</button>}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <p className="eyebrow mb-1">Free consultation</p>
          <DialogTitle className="font-display text-2xl font-bold text-white">Get a free quote</DialogTitle>
          <DialogDescription className="text-white/50">
            Tell us about your project — we reply within 24 hours via WhatsApp or email.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="mt-2 space-y-3">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <Input placeholder="Your name" value={formData.name} onChange={set('name')} required />
            <Input type="email" placeholder="Email" value={formData.email} onChange={set('email')} required />
          </div>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <Input type="tel" placeholder="Phone" value={formData.phone} onChange={set('phone')} />
            <select
              value={formData.service}
              onChange={set('service')}
              className="flex h-11 w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 text-sm text-white focus-visible:border-ember/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ember/30"
            >
              <option value="" className="bg-ink-800">Service…</option>
              {['AI Development', 'Web Development', 'Mobile App', 'E-commerce', 'AI Training', 'Other'].map((s) => (
                <option key={s} value={s} className="bg-ink-800">{s}</option>
              ))}
            </select>
          </div>
          <Textarea placeholder="What do you want to build?" value={formData.message} onChange={set('message')} required />
          <Button type="submit" className="btn-ember w-full">
            Send via WhatsApp <ArrowUpRight size={16} />
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
