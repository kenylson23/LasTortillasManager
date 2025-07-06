# Deploy para Vercel - Las Tortilhas

## Pré-requisitos

1. Conta no Vercel
2. Vercel CLI instalado (`npm i -g vercel`)
3. Banco de dados PostgreSQL (Neon, Supabase, ou similar)

## Variáveis de Ambiente

Configure as seguintes variáveis no Vercel:

```
DATABASE_URL=postgresql://...
SESSION_SECRET=sua-chave-secreta-aqui
NODE_ENV=production
```

## Passos para Deploy

### 1. Prepare o projeto

```bash
# Clone o repositório
git clone [seu-repositorio]
cd [seu-projeto]

# Instale as dependências
npm install
```

### 2. Configure o banco de dados

```bash
# Execute as migrations
npm run db:push

# Crie o usuário admin
npx tsx scripts/setup-admin.ts
```

### 3. Deploy no Vercel

```bash
# Faça login no Vercel
vercel login

# Deploy
vercel

# Ou conecte ao GitHub e faça deploy automático
```

### 4. Configure as variáveis de ambiente no Vercel

1. Acesse o dashboard do Vercel
2. Vá em Settings > Environment Variables
3. Adicione todas as variáveis listadas acima

## Estrutura do Deploy

- **Frontend**: Servido estaticamente pelo Vercel
- **Backend**: Funções serverless em `/api`
- **Banco de dados**: PostgreSQL externo (Neon recomendado)

## Troubleshooting

### Erro de sessão
Se houver erro com sessões, verifique se:
- A variável SESSION_SECRET está configurada
- O banco de dados está acessível
- A tabela de sessões existe

### Erro 500 nas APIs
- Verifique os logs do Vercel
- Confirme que DATABASE_URL está correto
- Teste a conexão com o banco localmente

## Admin padrão

Após o deploy, use estas credenciais:
- Username: admin
- Password: admin123

**Importante**: Mude a senha após o primeiro login!