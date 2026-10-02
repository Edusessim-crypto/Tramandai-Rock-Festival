/* Função serverless da Vercel: recebe o formulário de contato e envia por e-mail via Resend.
   Variáveis de ambiente (Vercel → Settings → Environment Variables):
     RESEND_API_KEY  (obrigatória) chave da conta Resend
     CONTACT_TO      (opcional)    destinatário; padrão: Daniel.gestorprodutora@gmail.com
     CONTACT_FROM    (opcional)    remetente verificado no Resend; padrão: onboarding@resend.dev */

const DESTINO_PADRAO = 'Daniel.gestorprodutora@gmail.com';
const REMETENTE_PADRAO = 'Site Tchê Rock <onboarding@resend.dev>';

const escapar = (t) => String(t).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const limpar = (v, max) => (typeof v === 'string' ? v.trim().slice(0, max) : '');

function validar({ nome, email, whatsapp, mensagem }) {
  const d = whatsapp.replace(/\D/g, '');
  const ddd = Number(d.slice(0, 2));
  const zapOk = ((d.length === 11 && d[2] === '9') || d.length === 10) && ddd >= 11 && ddd <= 99;
  return nome.length >= 2 && /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email) && zapOk && mensagem.length >= 5;
}

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ ok: false });
  }

  const corpo = typeof req.body === 'string' ? safeJson(req.body) : (req.body || {});
  if (corpo.site) return res.status(200).json({ ok: true }); // honeypot: descarta em silêncio

  const dados = {
    nome: limpar(corpo.nome, 120),
    email: limpar(corpo.email, 160),
    whatsapp: limpar(corpo.whatsapp, 20),
    mensagem: limpar(corpo.mensagem, 2000),
  };
  if (!validar(dados)) return res.status(400).json({ ok: false, erro: 'dados_invalidos' });

  const chave = process.env.RESEND_API_KEY;
  if (!chave) return res.status(500).json({ ok: false, erro: 'servico_nao_configurado' });

  const texto = [
    'Novo contato pelo site Tchê Rock',
    '',
    `Nome: ${dados.nome}`,
    `E-mail: ${dados.email}`,
    `WhatsApp: ${dados.whatsapp}`,
    '',
    'Mensagem:',
    dados.mensagem,
  ].join('\n');

  const html = `<h2>Novo contato pelo site Tchê Rock</h2>
<p><strong>Nome:</strong> ${escapar(dados.nome)}</p>
<p><strong>E-mail:</strong> ${escapar(dados.email)}</p>
<p><strong>WhatsApp:</strong> ${escapar(dados.whatsapp)}</p>
<p><strong>Mensagem:</strong></p>
<p>${escapar(dados.mensagem).replace(/\n/g, '<br>')}</p>`;

  try {
    const r = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: `Bearer ${chave}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        from: process.env.CONTACT_FROM || REMETENTE_PADRAO,
        to: [process.env.CONTACT_TO || DESTINO_PADRAO],
        reply_to: dados.email,
        subject: 'Novo contato pelo site Tchê Rock',
        text: texto,
        html,
      }),
    });
    if (!r.ok) return res.status(502).json({ ok: false, erro: 'falha_envio' });
    return res.status(200).json({ ok: true });
  } catch (e) {
    return res.status(502).json({ ok: false, erro: 'falha_envio' });
  }
};

function safeJson(t) { try { return JSON.parse(t); } catch { return {}; } }
