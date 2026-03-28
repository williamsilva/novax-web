interface Env {
  OAUTH_TOKEN_URL: string;
  OAUTH_CLIENT_ID: string;
  OAUTH_CLIENT_SECRET: string;
}

function json(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'no-store',
    },
  });
}

export const onRequestPost: PagesFunction<Env> = async ({ request, env }) => {
  try {
    const contentType = request.headers.get('content-type') || '';
    let bodyText = '';

    if (contentType.includes('application/x-www-form-urlencoded')) {
      bodyText = await request.text();
    } else {
      const body = await request.json<any>();
      bodyText = new URLSearchParams(body).toString();
    }

    const upstream = await fetch(env.OAUTH_TOKEN_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': 'Basic ' + btoa(`${env.OAUTH_CLIENT_ID}:${env.OAUTH_CLIENT_SECRET}`),
      },
      body: bodyText,
    });

    const text = await upstream.text();
    return new Response(text, {
      status: upstream.status,
      headers: {
        'Content-Type': upstream.headers.get('content-type') || 'application/json',
        'Cache-Control': 'no-store',
      },
    });
  } catch (error) {
    return json({ error: 'oauth_proxy_error', message: 'Failed to exchange token.' }, 500);
  }
};
