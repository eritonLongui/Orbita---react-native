import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const LYRA_SYSTEM_PROMPT = `Você é Lyra, assistente de bem-estar do app Orbita — um copiloto inspirado em missões espaciais.
Tom: calmo, claro, acolhedor, sem jargão clínico. Respostas curtas (2-4 frases).
Áreas de acompanhamento: Descanso, Energia, Ritmo, Nutrição, Bem-estar.
Nunca diagnostique. Sugira próximos passos práticos.`;

const VOICE_STYLES: Record<
  string,
  { voice: string; instructions: string; model: 'gpt-4o-mini-tts' | 'tts-1' }
> = {
  calm: {
    voice: 'nova',
    model: 'gpt-4o-mini-tts',
    instructions: 'Fale em português brasileiro com tom calmo, claro e acolhedor.',
  },
  neutral: {
    voice: 'alloy',
    model: 'gpt-4o-mini-tts',
    instructions: 'Fale em português brasileiro com tom neutro, claro e objetivo.',
  },
  energetic: {
    voice: 'shimmer',
    model: 'gpt-4o-mini-tts',
    instructions: 'Fale em português brasileiro com energia leve e tom motivador.',
  },
  young: {
    voice: 'coral',
    model: 'gpt-4o-mini-tts',
    instructions:
      'Fale em português brasileiro com tom jovem, leve e amigável, como uma assistente moderna.',
  },
  formal: {
    voice: 'onyx',
    model: 'gpt-4o-mini-tts',
    instructions:
      'Fale em português brasileiro com tom formal, profissional e bem articulado.',
  },
  mature: {
    voice: 'sage',
    model: 'gpt-4o-mini-tts',
    instructions:
      'Fale em português brasileiro com tom maduro, sereno e confiável, sem pressa.',
  },
};

const VOICE_ACCENTS: Record<string, { instructions: string }> = {
  paulista: {
    instructions:
      'Aplique sotaque paulista leve: entonação urbana de São Paulo, "r" suave e ritmo ágil, sem caricatura.',
  },
  carioca: {
    instructions:
      'Aplique sotaque carioca leve: entonação descontraída do Rio, vogais abertas e tom caloroso, sem caricatura.',
  },
  nordestino: {
    instructions:
      'Aplique sotaque nordestino brasileiro perceptível: cadência melodiosa do Nordeste, vogais mais abertas (ex.: "o" virando "ô"), entonação calorosa e expressiva típica de Pernambuco/Bahia, ritmo levemente mais cantado. Mantenha clareza e naturalidade, sem exagero cômico.',
  },
  sulista: {
    instructions:
      'Aplique sotaque sulista leve: entonação pausada do Sul, vogais mais fechadas e tom acolhedor, sem caricatura.',
  },
  mineira: {
    instructions:
      'Aplique sotaque mineiro leve: entonação gentil de Minas, ritmo tranquilo e proximidade no tom, sem caricatura.',
  },
};

const LEGACY_VOICE_PRESETS: Record<string, { voice: string; instructions: string }> = {
  paulista: { voice: 'nova', instructions: VOICE_ACCENTS.paulista.instructions },
  carioca: { voice: 'coral', instructions: VOICE_ACCENTS.carioca.instructions },
  nordestino: { voice: 'ballad', instructions: VOICE_ACCENTS.nordestino.instructions },
  sulista: { voice: 'echo', instructions: VOICE_ACCENTS.sulista.instructions },
  mineira: { voice: 'fable', instructions: VOICE_ACCENTS.mineira.instructions },
};

function buildVoicePreset(
  voiceStyle = 'calm',
  voiceAccent = 'none',
  legacyTone?: string
) {
  if (!voiceStyle && legacyTone) {
    if (VOICE_STYLES[legacyTone]) {
      return buildVoicePreset(legacyTone, 'none');
    }
    if (LEGACY_VOICE_PRESETS[legacyTone]) {
      return buildVoicePreset('calm', legacyTone);
    }
  }

  const style = VOICE_STYLES[voiceStyle] ?? VOICE_STYLES.calm;
  const accent =
    voiceAccent && voiceAccent !== 'none' ? VOICE_ACCENTS[voiceAccent] : null;

  return {
    voice: style.voice,
    model: style.model,
    instructions: accent
      ? `${style.instructions} ${accent.instructions}`
      : style.instructions,
  };
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const openaiKey = Deno.env.get('OPENAI_API_KEY');
    if (!openaiKey) {
      return json({ error: 'OPENAI_API_KEY não configurada' }, 500);
    }

    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return json({ error: 'Não autorizado' }, 401);
    }

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { global: { headers: { Authorization: authHeader } } }
    );

    const { data: userData, error: userError } = await supabase.auth.getUser();
    const userId = userData.user?.id ?? getUserIdFromJwt(authHeader);

    if (userError && !userId) {
      return json({ error: `Usuário inválido: ${userError.message}` }, 401);
    }
    if (!userId) {
      return json({ error: 'Usuário inválido' }, 401);
    }
    const body = await req.json();
    const {
      text,
      audioBase64,
      audioMimeType = 'audio/mp4',
      audioExt = 'm4a',
      imageBase64,
      imageMimeType = 'image/jpeg',
      voiceEnabled = true,
      voiceStyle = 'calm',
      voiceAccent = 'none',
      voiceTone,
    } = body;

    let transcript = text?.trim() ?? '';
    const hasImage = !!imageBase64;

    if (!transcript && audioBase64) {
      if (audioBase64.length < 500) {
        return json({ error: 'Áudio muito curto ou vazio. Tente falar novamente.' }, 400);
      }

      const ext = audioExt || (audioMimeType.includes('webm') ? 'webm' : 'm4a');
      const mime = audioMimeType || (ext === 'webm' ? 'audio/webm' : 'audio/mp4');
      const audioBytes = Uint8Array.from(atob(audioBase64), (c) => c.charCodeAt(0));
      const form = new FormData();
      form.append('file', new Blob([audioBytes], { type: mime }), `recording.${ext}`);
      form.append('model', 'whisper-1');
      form.append('language', 'pt');

      const whisperRes = await fetch('https://api.openai.com/v1/audio/transcriptions', {
        method: 'POST',
        headers: { Authorization: `Bearer ${openaiKey}` },
        body: form,
      });

      if (!whisperRes.ok) {
        const err = await whisperRes.text();
        return json({ error: `Whisper falhou: ${err}` }, 502);
      }

      const whisperData = await whisperRes.json();
      transcript = whisperData.text ?? '';
    }

    if (!transcript && !hasImage) {
      return json({ error: 'Nenhum conteúdo para processar' }, 400);
    }

    if (hasImage && !transcript) {
      transcript = 'O usuário enviou uma imagem.';
    }

    const { data: history } = await supabase
      .from('conversation_logs')
      .select('role, content')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(8);

    const { data: dailyStatus } = await supabase
      .from('daily_status')
      .select('overall_score, stability_trend, notes')
      .eq('user_id', userId)
      .order('date', { ascending: false })
      .limit(1)
      .maybeSingle();

    const contextParts: string[] = [];
    if (dailyStatus) {
      contextParts.push(
        `Status recente: score ${dailyStatus.overall_score}, tendência ${dailyStatus.stability_trend}.`
      );
    }

    const historyMessages = (history ?? [])
      .reverse()
      .map((m: { role: string; content: string }) => ({
        role: m.role === 'assistant' ? 'assistant' : 'user',
        content: m.content,
      }));

    const userContent = hasImage
      ? [
          {
            type: 'text',
            text:
              transcript === 'O usuário enviou uma imagem.'
                ? 'Descreva o que você vê nesta imagem e ofereça orientação prática e acolhedora.'
                : transcript,
          },
          {
            type: 'image_url',
            image_url: {
              url: `data:${imageMimeType};base64,${imageBase64}`,
            },
          },
        ]
      : transcript;

    const chatMessages = [
      { role: 'system', content: LYRA_SYSTEM_PROMPT },
      ...(contextParts.length ? [{ role: 'system', content: contextParts.join(' ') }] : []),
      ...historyMessages,
      { role: 'user', content: userContent },
    ];

    const chatRes = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${openaiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: hasImage ? 'gpt-4o' : 'gpt-4o-mini',
        messages: chatMessages,
        max_tokens: 300,
        temperature: 0.7,
      }),
    });

    if (!chatRes.ok) {
      const err = await chatRes.text();
      return json({ error: `GPT falhou: ${err}` }, 502);
    }

    const chatData = await chatRes.json();
    const reply = chatData.choices?.[0]?.message?.content?.trim() ?? 'Estou aqui com você. Como posso ajudar?';

    const channel = audioBase64 ? 'voice' : 'text';
    const loggedUserContent = hasImage
      ? `${transcript}${transcript.includes('imagem') ? '' : ' [imagem]'}`
      : transcript;

    await supabase.from('conversation_logs').insert([
      { user_id: userId, role: 'user', content: loggedUserContent, channel },
      { user_id: userId, role: 'assistant', content: reply, channel },
    ]);

    let audioResponseBase64: string | undefined;

    if (voiceEnabled) {
      const preset = buildVoicePreset(voiceStyle, voiceAccent, voiceTone);
      const ttsRes = await fetch('https://api.openai.com/v1/audio/speech', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${openaiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: preset.model,
          input: reply,
          voice: preset.voice,
          instructions: preset.instructions,
          response_format: 'mp3',
        }),
      });

      if (ttsRes.ok) {
        const audioBuffer = await ttsRes.arrayBuffer();
        audioResponseBase64 = arrayBufferToBase64(audioBuffer);
      } else {
        const fallbackRes = await fetch('https://api.openai.com/v1/audio/speech', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${openaiKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model: 'tts-1',
            input: reply,
            voice: preset.voice,
            response_format: 'mp3',
          }),
        });

        if (fallbackRes.ok) {
          const audioBuffer = await fallbackRes.arrayBuffer();
          audioResponseBase64 = arrayBufferToBase64(audioBuffer);
        }
      }
    }

    return json({ transcript, reply, audioBase64: audioResponseBase64 });
  } catch (e) {
    return json({ error: e instanceof Error ? e.message : 'Erro interno' }, 500);
  }
});

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}

function getUserIdFromJwt(authHeader: string): string | null {
  try {
    const token = authHeader.replace(/^Bearer\s+/i, '');
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.sub ?? payload.user_id ?? null;
  } catch {
    return null;
  }
}

function arrayBufferToBase64(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer);
  let binary = '';
  const chunkSize = 0x8000;
  for (let i = 0; i < bytes.length; i += chunkSize) {
    binary += String.fromCharCode(...bytes.subarray(i, i + chunkSize));
  }
  return btoa(binary);
}
