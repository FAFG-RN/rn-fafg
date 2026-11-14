import { createPreviewHandler } from './handler.ts';
import { previewHtml } from './preview.ts';

Deno.serve(createPreviewHandler({
  url: Deno.env.get('SUPABASE_URL') || '',
  anonKey: Deno.env.get('SUPABASE_ANON_KEY') || '',
  html: previewHtml,
}));
