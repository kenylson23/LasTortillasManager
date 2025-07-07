# Guia de Deploy no Vercel

## Configuração Atual

O projeto está configurado para deploy no Vercel com as seguintes configurações:

### Arquivos de Configuração

1. **vercel.json** - Configuração principal do Vercel
2. **api/index.js** - Função serverless principal
3. **api/[...path].js** - Roteamento catch-all para API
4. **api/package.json** - Especifica módulos ES6 para as funções

### Processo de Build

O comando `npm run build` deve ser usado, que:
1. Executa `vite build` para compilar o frontend
2. Executa `esbuild` para compilar o servidor

### Variáveis de Ambiente

Configure as seguintes variáveis no painel do Vercel:

1. `DATABASE_URL` - URL do banco PostgreSQL (Neon)
2. `NODE_ENV` - Definir como `production`

### Estrutura de Deploy

- **Frontend**: Arquivos estáticos servidos pelo Vercel
- **API**: Funções serverless na pasta `/api`
- **Banco**: PostgreSQL (Neon) externo

### Problemas Comuns

1. **Comando não encontrado (exit code 127)**: 
   - Usar `npx vite build` em vez de `vite build`
   - Usar `bash build-vercel.sh` como comando de build
   - Garantir que o script está executável
2. **Módulos ES6**: Arquivo `api/package.json` com `"type": "module"`
3. **CORS**: Configurado automaticamente nas funções da API
4. **Timeout no build**: Vercel tem limite de 15 minutos para builds

### Passos para Deploy

1. Conecte o repositório ao Vercel
2. Configure as variáveis de ambiente
3. O build será executado automaticamente com `npm run build`
4. As funções API serão implantadas em `/api/*`