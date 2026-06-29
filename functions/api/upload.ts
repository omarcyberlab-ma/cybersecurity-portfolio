import { createClient } from '@supabase/supabase-js';

interface Env {
  SUPABASE_URL: string;
  SUPABASE_SERVICE_ROLE_KEY: string;
}

export const onRequestPost: PagesFunction<Env> = async (context) => {
  const { request, env } = context;

  const supabaseUrl = env.SUPABASE_URL;
  const serviceRoleKey = env.SUPABASE_SERVICE_ROLE_KEY;
  if (!supabaseUrl || !serviceRoleKey) {
    return new Response(JSON.stringify({ error: 'Server config missing' }), {
      status: 500, headers: { 'Content-Type': 'application/json' },
    });
  }

  const svc = createClient(supabaseUrl, serviceRoleKey);

  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;
    const bucket = (formData.get('bucket') as string) || 'profile';

    if (!file) {
      return new Response(JSON.stringify({ error: 'No file provided' }), {
        status: 400, headers: { 'Content-Type': 'application/json' },
      });
    }

    const path = `${Date.now()}-${file.name}`;
    const buffer = await file.arrayBuffer();

    const { error: uploadError } = await svc.storage
      .from(bucket)
      .upload(path, buffer, {
        contentType: file.type,
        upsert: false,
      });

    if (uploadError) {
      return new Response(JSON.stringify({ error: uploadError.message }), {
        status: 500, headers: { 'Content-Type': 'application/json' },
      });
    }

    const { data: signedData, error: signedError } = await svc.storage
      .from(bucket)
      .createSignedUrl(path, 365 * 24 * 60 * 60);

    if (signedError || !signedData) {
      return new Response(JSON.stringify({ error: signedError?.message || 'Failed to generate signed URL' }), {
        status: 500, headers: { 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify({ url: signedData.signedUrl, path }), {
      status: 200, headers: { 'Content-Type': 'application/json' },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: String(err) }), {
      status: 500, headers: { 'Content-Type': 'application/json' },
    });
  }
};
