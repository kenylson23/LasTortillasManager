# Guia de Migração para Vercel

## Arquivos Criados

✓ `api/index.ts` - Ponto de entrada da API para Vercel
✓ `vercel.json` - Configuração atualizada do Vercel
✓ `tsconfig.vercel.json` - Configuração TypeScript para API
✓ `build-vercel.sh` - Script de build para Vercel

## Passos para Deploy no Vercel

### 1. Atualizar package.json

Adicione os seguintes scripts ao seu `package.json`:

```json
{
  "scripts": {
    "build:vercel": "./build-vercel.sh",
    "vite:build": "vite build"
  }
}
```

### 2. Variáveis de Ambiente no Vercel

Vá ao painel do Vercel e configure:
- `DATABASE_URL` - URL do seu banco PostgreSQL Neon

### 3. Deploy

1. Conecte seu repositório ao Vercel
2. O Vercel detectará automaticamente as configurações do `vercel.json`
3. O deploy será feito automaticamente

## Estrutura do Projeto para Vercel

```
/
├── api/
│   └── index.ts         # Endpoint da API (Vercel Functions)
├── client/              # Frontend React
├── server/              # Código do servidor Express
├── shared/              # Código compartilhado
├── vercel.json          # Configuração do Vercel
└── dist/
    └── client/          # Frontend compilado
```

## Notas Importantes

1. **API Routes**: Todas as rotas `/api/*` serão direcionadas para a função serverless
2. **Frontend**: Será servido estaticamente do diretório `dist/client`
3. **Database**: Continue usando PostgreSQL do Neon (compatível com Vercel)
4. **Sessions**: Considere usar um store de sessão compatível com serverless

## Diferenças do Replit

- No Vercel, a API roda como serverless functions
- O frontend é servido separadamente como arquivos estáticos
- Não há servidor Express sempre rodando
- Cada request cria uma nova instância da função

## Possíveis Ajustes Necessários

1. **Sessões**: Pode ser necessário ajustar o gerenciamento de sessões para funcionar em ambiente serverless
2. **WebSockets**: Não são suportados nativamente no Vercel
3. **Uploads de arquivo**: Precisam ser ajustados para usar serviços externos (ex: Vercel Blob)