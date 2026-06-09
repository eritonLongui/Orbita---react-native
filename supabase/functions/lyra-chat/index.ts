import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const LYRA_SYSTEM_PROMPT = `Você é Lyra, coach de bem-estar da Orbita — tripulante inteligente de rotina inspirado em missões espaciais.
Tom: calmo, claro, acolhedor, sem jargão clínico. Respostas curtas (2-4 frases).
Áreas de acompanhamento: Descanso, Energia, Ritmo, Nutrição, Bem-estar.
Nunca diagnostique. Sugira próximos passos práticos.

FORA DO CHECK-IN (perguntas livres, desabafos, imagens):
- Responda normalmente com empatia e orientação prática.`;

const CHECK_IN_JSON_PROMPT = `MODO CHECK-IN ATIVO. Responda APENAS com JSON válido neste formato:
{"reply":"mensagem ao usuário em português, 2-4 frases","areasCovered":["sleep"],"checkInComplete":false}

IDs das áreas (use exatamente estes): sleep=Descanso, energy=Energia, routine=Ritmo, nutrition=Nutrição, wellbeing=Bem-estar.

Regras obrigatórias:
- Conduza ativamente. Uma área por vez, nesta ordem: sleep → energy → routine → nutrition → wellbeing.
- areasCovered: somente áreas com resposta substantiva do usuário nesta conversa.
- checkInComplete: true SOMENTE quando as 5 áreas estiverem em areasCovered e a reply tiver resumo final do dia.
- NUNCA checkInComplete true se o usuário só cumprimentou (oi, olá, hey) sem responder sobre áreas.
- NUNCA checkInComplete true na primeira troca ou sem pelo menos 4 respostas do usuário sobre áreas distintas.
- Ao iniciar check-in, faça a primeira pergunta sobre Descanso (sleep) na reply.`;

const CHECK_IN_AREA_IDS = ['sleep', 'energy', 'routine', 'nutrition', 'wellbeing'] as const;

const STRUCTURED_CHECK_IN_OPENING =
  'Oi! Vamos ao check-in de hoje. Que horas você foi dormir?';

function parseCheckInResponse(raw: string) {
  try {
    const parsed = JSON.parse(raw);
    const reply = typeof parsed.reply === 'string' ? parsed.reply.trim() : '';
    const areasCovered = Array.isArray(parsed.areasCovered)
      ? parsed.areasCovered.filter((id: string) =>
          CHECK_IN_AREA_IDS.includes(id as (typeof CHECK_IN_AREA_IDS)[number])
        )
      : [];
    const allCovered = CHECK_IN_AREA_IDS.every((id) => areasCovered.includes(id));
    const checkInComplete = parsed.checkInComplete === true && allCovered && areasCovered.length === 5;
    if (!reply) return null;
    return { reply, areasCovered, checkInComplete };
  } catch {
    return null;
  }
}

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

// check-in v2: initiateCheckIn + JSON estruturado
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
      checkInMode = false,
      initiateCheckIn = false,
      areasCovered: clientAreasCovered = [],
      structuredCheckIn,
      answerArea,
      questionnaireAnswers,
    } = body;

    let transcript = text?.trim() ?? '';
    const hasImage = !!imageBase64;
    const normalizedImageMime = hasImage
      ? normalizeImageMimeType(imageMimeType)
      : imageMimeType;

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
      form.append(
        'prompt',
        'Conversa de check-in de bem-estar em português brasileiro. Descanso, sono, energia, rotina, nutrição, bem-estar.',
      );

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

    if (
      !transcript &&
      !hasImage &&
      !(checkInMode && initiateCheckIn) &&
      structuredCheckIn !== 'questionnaire'
    ) {
      return json({ error: 'Nenhum conteúdo para processar' }, 400);
    }

    if (checkInMode && initiateCheckIn && !transcript) {
      transcript = '[Iniciar check-in]';
    }

    if (hasImage && !transcript) {
      transcript = 'O usuário enviou uma imagem.';
    }

    if (structuredCheckIn === 'opening') {
      const reply = STRUCTURED_CHECK_IN_OPENING;
      const channel = 'text';
      await supabase.from('conversation_logs').insert([
        { user_id: userId, role: 'assistant', content: reply, channel },
      ]);
      const audioResponseBase64 = voiceEnabled
        ? await synthesizeSpeech(openaiKey, reply, voiceStyle, voiceAccent, voiceTone)
        : undefined;
      return json({
        reply,
        audioBase64: audioResponseBase64,
        areasCovered: [],
        checkInComplete: false,
      });
    }

    if (structuredCheckIn === 'tts' && text?.trim()) {
      const reply = text.trim();
      const audioResponseBase64 = voiceEnabled
        ? await synthesizeSpeech(openaiKey, reply, voiceStyle, voiceAccent, voiceTone)
        : undefined;
      return json({ reply, audioBase64: audioResponseBase64 });
    }

    if (structuredCheckIn === 'questionnaire') {
      if (!questionnaireAnswers || typeof questionnaireAnswers !== 'object') {
        return json({ error: 'Respostas do questionário ausentes' }, 400);
      }

      const areaScores = calculateQuestionnaireScores(questionnaireAnswers);
      const today = new Date().toISOString().split('T')[0];
      const weekStart = getWeekStartMonday(today);
      const overall = Math.round(
        (areaScores.sleep +
          areaScores.movement +
          areaScores.routine +
          areaScores.nutrition +
          areaScores.leisure) /
          5,
      );

      const pillarPayload = [
        { pillar: 'sleep', value: questionnaireAnswers.sleep },
        { pillar: 'movement', value: questionnaireAnswers.energy },
        { pillar: 'routine', value: questionnaireAnswers.routine },
        { pillar: 'nutrition', value: questionnaireAnswers.nutrition },
        { pillar: 'leisure', value: questionnaireAnswers.wellbeing },
      ];

      for (const row of pillarPayload) {
        await supabase.from('pillar_records').insert({
          user_id: userId,
          pillar: row.pillar,
          date: today,
          value: row.value,
          source: 'questionnaire',
        });
      }

      await supabase.from('daily_status').upsert(
        {
          user_id: userId,
          date: today,
          overall_score: overall,
          stability_trend: overall >= 65 ? 'stable' : 'attention',
          notes: 'Check-in por questionário',
        },
        { onConflict: 'user_id,date' },
      );

      const { data: existingInsight } = await supabase
        .from('weekly_insights')
        .select('id')
        .eq('user_id', userId)
        .eq('week_start', weekStart)
        .maybeSingle();

      if (existingInsight?.id) {
        await supabase
          .from('weekly_insights')
          .update({ pillar_scores: areaScores })
          .eq('id', existingInsight.id);
      } else {
        await supabase.from('weekly_insights').insert({
          user_id: userId,
          week_start: weekStart,
          pillar_scores: areaScores,
          summary: '',
          area_recommendations: {},
        });
      }

      await supabase.from('conversation_logs').insert([
        {
          user_id: userId,
          role: 'user',
          content: `[check-in] ${JSON.stringify(questionnaireAnswers)}`,
          channel: 'text',
        },
      ]);

      const taskPrompt = `Você é Lyra, coach de bem-estar do app Orbita.
O usuário acabou de completar o check-in diário por questionário.

Respostas: ${JSON.stringify(questionnaireAnswers)}
Scores por área (0-100): ${JSON.stringify(areaScores)}

Gere:
1. "reply": comentário breve e acolhedor (2-3 frases) resumindo o dia e um insight prático
2. "tasks": entre 3 e 5 micro-tarefas concretas para HOJE, priorizando áreas com score abaixo de 65
3. "areaRecommendations": objeto com uma recomendação personalizada para CADA área (sleep, movement, routine, nutrition, leisure). Cada recomendação deve ser acionável, específica e em 1-2 frases.
4. "insight": uma frase curta e inteligente sobre o padrão geral do usuário (ex: "Noites curtas estão afetando sua energia — regularizar o sono pode destravar as outras áreas.")

Regras das tarefas:
- Cada tarefa deve ser específica, executável em menos de 30 minutos
- area deve ser exatamente um de: sleep, movement, routine, nutrition, leisure
- title em português, máximo 80 caracteres
- Sem emojis

Regras das recomendações por área:
- Em português, tom prático e acolhedor
- Máximo 120 caracteres cada
- Baseie-se nos scores: áreas abaixo de 65 precisam de mais atenção
- Sem emojis

Responda APENAS JSON: {"reply":"...","tasks":[{"area":"sleep","title":"..."}],"areaRecommendations":{"sleep":"...","movement":"...","routine":"...","nutrition":"...","leisure":"..."},"insight":"..."}`;

      let reply =
        'Check-in registrado! Sua órbita de hoje está mapeada. Veja suas tarefas na Missão.';
      let dailyTasks: { id: string; area: string; title: string; done: boolean; createdAt: string }[] =
        [];
      let areaRecommendations: Record<string, string> = {};
      let generatedInsight = '';

      try {
        const chatRes = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${openaiKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model: 'gpt-4o-mini',
            temperature: 0.7,
            max_tokens: 900,
            messages: [{ role: 'system', content: taskPrompt }],
          }),
        });

        if (chatRes.ok) {
          const chatData = await chatRes.json();
          const raw = chatData.choices?.[0]?.message?.content?.trim() ?? '';
          try {
            const parsed = JSON.parse(raw);
            if (typeof parsed.reply === 'string' && parsed.reply.trim()) {
              reply = parsed.reply.trim();
            }
            if (Array.isArray(parsed.tasks)) {
              const now = new Date().toISOString();
              dailyTasks = parsed.tasks
                .filter(
                  (t: { area?: string; title?: string }) =>
                    t?.area && t?.title && typeof t.title === 'string',
                )
                .slice(0, 5)
                .map((t: { area: string; title: string }, i: number) => ({
                  id: `task-${today}-${i}`,
                  area: t.area,
                  title: t.title.trim(),
                  done: false,
                  createdAt: now,
                }));
            }
            if (parsed.areaRecommendations && typeof parsed.areaRecommendations === 'object') {
              areaRecommendations = parsed.areaRecommendations;
            }
            if (typeof parsed.insight === 'string' && parsed.insight.trim()) {
              generatedInsight = parsed.insight.trim();
            }
          } catch {
            if (raw) reply = raw;
          }
        }
      } catch (e) {
        console.warn('GPT questionnaire tasks failed:', e);
      }

      if (dailyTasks.length === 0) {
        dailyTasks = buildFallbackTasks(areaScores, today);
      }

      await supabase.from('conversation_logs').insert([
        { user_id: userId, role: 'assistant', content: reply, channel: 'text' },
      ]);

      if (existingInsight?.id) {
        await supabase.from('weekly_insights').update({
          summary: generatedInsight || reply,
          area_recommendations: areaRecommendations,
        }).eq('id', existingInsight.id);
      } else {
        await supabase.from('weekly_insights').update({
          summary: generatedInsight || reply,
          area_recommendations: areaRecommendations,
        }).eq('user_id', userId).eq('week_start', weekStart);
      }

      const audioResponseBase64 = voiceEnabled
        ? await synthesizeSpeech(openaiKey, reply, voiceStyle, voiceAccent, voiceTone)
        : undefined;

      return json({
        reply,
        audioBase64: audioResponseBase64,
        dailyTasks,
        areaScores,
        areaRecommendations,
        insight: generatedInsight,
        checkInComplete: true,
        areasCovered: [...CHECK_IN_AREA_IDS],
      });
    }

    if (structuredCheckIn === 'answer') {
      if (!transcript) {
        return json({ error: 'Não captei sua resposta. Tente novamente.' }, 400);
      }
      const channel = audioBase64 ? 'voice' : 'text';
      const { currentQuestion, nextQuestion, isLastQuestion } = body;

      const areaLabel =
        typeof answerArea === 'string' && CHECK_IN_AREA_IDS.includes(answerArea as typeof CHECK_IN_AREA_IDS[number])
          ? answerArea
          : 'resposta';
      await supabase.from('conversation_logs').insert([
        {
          user_id: userId,
          role: 'user',
          content: `[${areaLabel}] ${transcript}`,
          channel,
        },
      ]);

      const systemPrompt = `Você é Lyra, coach de bem-estar do app Orbita. Está conduzindo um check-in estruturado.
A pergunta que você acabou de fazer: "${currentQuestion || ''}"
Resposta do usuário: "${transcript}"
${nextQuestion ? `Próxima pergunta obrigatória: "${nextQuestion}"` : ''}
${isLastQuestion ? 'Esta foi a última pergunta. Encerre o check-in de forma breve e positiva.' : ''}

Regras RIGOROSAS:
- ANALISE se a resposta do usuário RESPONDE a pergunta feita.
- Se NÃO responde (mudou de assunto, fez outra pergunta, falou algo irrelevante, ou não faz sentido como resposta): retorne "repeat": true e redirecione gentilmente para a pergunta. Ex: "Entendo, mas agora preciso saber: [pergunta reformulada]"
- Se pediu para repetir, não entendeu, ou disse algo vago demais (como "hein", "que", "oi", "n entendi"): retorne "repeat": true e repita a pergunta de forma natural.
- Se RESPONDEU a pergunta (mesmo que de forma breve, informal, ou aproximada): faça um ack brevíssimo (máx 8 palavras, sem repetir o número/dado que o usuário falou) e pergunte a próxima pergunta. Retorne "repeat": false.
- Mantenha tom acolhedor e direto. Sem emojis.
- Responda APENAS o JSON: {"reply": "sua fala aqui", "repeat": true/false}`;

      try {
        const chatRes = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${openaiKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model: 'gpt-4o-mini',
            temperature: 0.6,
            max_tokens: 120,
            messages: [
              { role: 'system', content: systemPrompt },
              { role: 'user', content: transcript },
            ],
          }),
        });

        if (chatRes.ok) {
          const chatData = await chatRes.json();
          const raw = chatData.choices?.[0]?.message?.content?.trim() ?? '';
          try {
            const parsed = JSON.parse(raw);
            const reply = parsed.reply || raw;
            const isRepeat = parsed.repeat === true;
            return json({ transcript, reply, repeat: isRepeat });
          } catch {
            return json({ transcript, reply: raw || 'ok', repeat: false });
          }
        }
      } catch (e) {
        console.warn('GPT ack failed, fallback:', e);
      }

      return json({ transcript, reply: 'ok', repeat: false });
    }

    const { data: history } = await supabase
      .from('conversation_logs')
      .select('role, content, created_at')
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

    if (checkInMode) {
      const covered =
        Array.isArray(clientAreasCovered) && clientAreasCovered.length > 0
          ? clientAreasCovered.join(', ')
          : 'nenhuma ainda';
      contextParts.push(
        `Check-in em andamento. Áreas já cobertas pelo cliente: ${covered}. Continue de onde parou.`
      );
      if (initiateCheckIn) {
        contextParts.push(
          'O usuário acabou de abrir o check-in. Comece perguntando sobre Descanso (sleep).'
        );
      }
    }

    const historyMessages = (history ?? [])
      .reverse()
      .map((m: { role: string; content: string; created_at: string }) => ({
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
              url: `data:${normalizedImageMime};base64,${imageBase64}`,
            },
          },
        ]
      : transcript;

    const chatMessages = [
      { role: 'system', content: LYRA_SYSTEM_PROMPT },
      ...(checkInMode ? [{ role: 'system', content: CHECK_IN_JSON_PROMPT }] : []),
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
        max_tokens: checkInMode ? 400 : 300,
        temperature: checkInMode ? 0.4 : 0.7,
        ...(checkInMode && !hasImage
          ? { response_format: { type: 'json_object' } }
          : {}),
      }),
    });

    if (!chatRes.ok) {
      const err = await chatRes.text();
      return json({ error: formatGptError(err) }, 502);
    }

    const chatData = await chatRes.json();
    const rawReply = chatData.choices?.[0]?.message?.content?.trim() ?? '';

    let reply =
      rawReply || 'Estou aqui com você. Como posso ajudar?';
    let checkInComplete = false;
    let areasCovered: string[] = [];

    if (checkInMode && !hasImage) {
      const parsed = parseCheckInResponse(rawReply);
      if (parsed) {
        reply = parsed.reply;
        areasCovered = parsed.areasCovered;
        checkInComplete = parsed.checkInComplete;
      }
    }

    const channel = audioBase64 ? 'voice' : 'text';
    const loggedUserContent = hasImage
      ? `${transcript}${transcript.includes('imagem') ? '' : ' [imagem]'}`
      : transcript;

    await supabase.from('conversation_logs').insert([
      { user_id: userId, role: 'user', content: loggedUserContent, channel },
      { user_id: userId, role: 'assistant', content: reply, channel },
    ]);

    const audioResponseBase64 = voiceEnabled
      ? await synthesizeSpeech(openaiKey, reply, voiceStyle, voiceAccent, voiceTone)
      : undefined;

    return json({
      transcript,
      reply,
      audioBase64: audioResponseBase64,
      ...(checkInMode ? { checkInComplete, areasCovered } : {}),
    });
  } catch (e) {
    return json({ error: e instanceof Error ? e.message : 'Erro interno' }, 500);
  }
});

function normalizeImageMimeType(mime?: string): string {
  const raw = (mime ?? 'image/jpeg').toLowerCase().split(';')[0].trim();
  if (raw === 'image/jpg' || raw === 'image/pjpeg') return 'image/jpeg';
  if (raw === 'image/png' || raw === 'image/webp' || raw === 'image/gif') return raw;
  return 'image/jpeg';
}

function formatGptError(raw: string): string {
  const trimmed = raw.trim();
  try {
    const parsed = JSON.parse(trimmed) as {
      error?: { message?: string; code?: string };
    };
    const code = parsed.error?.code;
    const message = parsed.error?.message;
    if (code === 'invalid_image_format') {
      return 'Formato de imagem não suportado. Tente outra foto (JPG ou PNG).';
    }
    if (message) return message;
  } catch {
    // não é JSON
  }
  return 'Não foi possível analisar sua mensagem. Tente novamente.';
}

async function synthesizeSpeech(
  openaiKey: string,
  input: string,
  voiceStyle = 'calm',
  voiceAccent = 'none',
  voiceTone?: string,
): Promise<string | undefined> {
  const preset = buildVoicePreset(voiceStyle, voiceAccent, voiceTone);
  const ttsRes = await fetch('https://api.openai.com/v1/audio/speech', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${openaiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: preset.model,
      input,
      voice: preset.voice,
      instructions: preset.instructions,
      response_format: 'mp3',
    }),
  });

  if (ttsRes.ok) {
    const audioBuffer = await ttsRes.arrayBuffer();
    return arrayBufferToBase64(audioBuffer);
  }

  const fallbackRes = await fetch('https://api.openai.com/v1/audio/speech', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${openaiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'tts-1',
      input,
      voice: preset.voice,
      response_format: 'mp3',
    }),
  });

  if (fallbackRes.ok) {
    const audioBuffer = await fallbackRes.arrayBuffer();
    return arrayBufferToBase64(audioBuffer);
  }

  return undefined;
}

type QuestionnaireAnswers = {
  sleep: { bedTime: string; wakeTime: string; quality: number };
  energy: { energyLevel: number; fatigueLevel: number };
  routine: { screenHours: number; regularSchedule: boolean; organization: number };
  nutrition: { meals: number; waterGlasses: number; foodQuality: number };
  wellbeing: { mood: number; stress: number; anxiety: number };
};

function sleepHoursFromSchedule(bedTime: string, wakeTime: string): number {
  const toMinutes = (time: string) => {
    const [h, m] = time.split(':').map((v) => Number.parseInt(v, 10));
    return (Number.isFinite(h) ? h : 0) * 60 + (Number.isFinite(m) ? m : 0);
  };
  let bed = toMinutes(bedTime);
  let wake = toMinutes(wakeTime);
  if (wake <= bed) wake += 24 * 60;
  return (wake - bed) / 60;
}

function calculateQuestionnaireScores(a: QuestionnaireAnswers) {
  const hoursSlept = sleepHoursFromSchedule(a.sleep.bedTime, a.sleep.wakeTime);
  const sleepHoursScore =
    hoursSlept >= 7 && hoursSlept <= 9
      ? 90
      : Math.max(20, 100 - Math.abs(hoursSlept - 8) * 12);
  const sleep = Math.round(sleepHoursScore * 0.5 + a.sleep.quality * 10 * 0.5);

  const movement = Math.round((a.energy.energyLevel * 10 + (10 - a.energy.fatigueLevel) * 10) / 2);

  const routineRaw =
    (10 - Math.min(a.routine.screenHours, 10)) * 5 +
    (a.routine.regularSchedule ? 30 : 0) +
    a.routine.organization * 4;
  const routine = Math.min(100, Math.max(0, Math.round(routineRaw)));

  const nutritionRaw =
    (a.nutrition.meals >= 3 ? 35 : a.nutrition.meals * 10) +
    Math.min(35, a.nutrition.waterGlasses * 4) +
    a.nutrition.foodQuality * 3;
  const nutrition = Math.min(100, Math.round(nutritionRaw));

  const leisure = Math.round(
    (a.wellbeing.mood * 10 + (10 - a.wellbeing.stress) * 10 + (10 - a.wellbeing.anxiety) * 10) /
      3,
  );

  return { sleep, movement, routine, nutrition, leisure };
}

function getWeekStartMonday(dateStr: string): string {
  const d = new Date(`${dateStr}T12:00:00`);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1);
  d.setDate(diff);
  return d.toISOString().split('T')[0];
}

function buildFallbackTasks(
  scores: Record<string, number>,
  today: string,
): { id: string; area: string; title: string; done: boolean; createdAt: string }[] {
  const now = new Date().toISOString();
  const templates: { area: string; title: string; threshold: number }[] = [
    { area: 'sleep', title: 'Desligue telas 30 min antes de dormir hoje', threshold: 65 },
    { area: 'movement', title: 'Caminhe 10 minutos ao ar livre hoje', threshold: 65 },
    { area: 'routine', title: 'Defina um horário fixo para a próxima refeição', threshold: 65 },
    { area: 'nutrition', title: 'Beba mais 3 copos de água até o fim do dia', threshold: 65 },
    { area: 'leisure', title: 'Faça uma pausa de 5 min com respiração profunda', threshold: 65 },
  ];

  return templates
    .filter((t) => (scores[t.area] ?? 100) < t.threshold)
    .slice(0, 4)
    .map((t, i) => ({
      id: `task-${today}-fb-${i}`,
      area: t.area,
      title: t.title,
      done: false,
      createdAt: now,
    }));
}

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
