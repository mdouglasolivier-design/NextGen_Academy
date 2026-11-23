import { useState, type FormEvent } from 'react';
import { Icon } from '@/components/ui/Icon';
import { StatusMessage } from '@/components/ui/StatusMessage';
import { STORAGE_KEYS, saveLocal } from '@/lib/storage';
import { btnPrimary, field } from '@/lib/ui';

export default function Contact() {
  const [message, setMessage] = useState('');

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    saveLocal(STORAGE_KEYS.contact, { ...Object.fromEntries(new FormData(form)), timestamp: new Date().toISOString() });
    setMessage('Your message was saved in this browser only. It has not been sent to NextGen Academy.');
    form.reset();
  };

  return (
    <main className="mx-auto max-w-6xl px-6 py-12">
      <p className="mb-3 text-xs font-bold tracking-widest text-teal-800">KNOWLEDGE WITHOUT BOUNDARIES</p>
      <h1 className="mb-6 text-4xl font-bold">Let’s start a conversation.</h1>
      <div className="grid gap-12 md:grid-cols-2">
        <div>
          <h2 className="mb-4 text-xl font-bold">How can we help?</h2>
          <p className="text-base leading-8 text-slate-600">
            Have a question about a course or your learning journey? Leave a message in this local preview.
          </p>
          <p className="mt-7 border-l-2 border-teal-800 pl-5 text-sm leading-7 text-slate-600">
            Official email, telephone, location, and social profiles have not been supplied. They will appear here once verified details are available.
          </p>
        </div>
        <form onSubmit={onSubmit}>
          {(['Name', 'Email', 'Subject'] as const).map((label) => (
            <label key={label} className="mb-5 block text-sm font-semibold">
              {label}
              <input name={label.toLowerCase()} required type={label === 'Email' ? 'email' : 'text'} className={`${field} mt-2`} />
            </label>
          ))}
          <label className="mb-5 block text-sm font-semibold">
            Message
            <textarea name="message" required rows={5} className={`${field} mt-2 py-3`} />
          </label>
          <button className={btnPrimary}>Save Demo Message <Icon name="arrow" /></button>
          <StatusMessage>{message}</StatusMessage>
        </form>
      </div>
    </main>
  );
}