# Processo de release

O processo completo (branches, release, hotfix e homologação na Vercel) está
em [`adom-admin/docs/RELEASE.md`](https://github.com/ThiagoGomes-dev/adom-admin/blob/develop/docs/RELEASE.md).
O resumo para este repositório:

```
feat/xxx ──PR──▶ develop ──(homologação na Vercel)──PR──▶ main ──▶ produção
```

- Crie a branch a partir de `develop` e abra o PR para `develop`.
- O CI roda `npm run lint`, `npm run typecheck`, `npm test` e `npm run build`. Rode o mesmo localmente antes do PR.
- Registre a mudança em `CHANGELOG.md`, seção **Não lançado**.
- Release: PR `develop` → `main` com o CHANGELOG fechado na versão do dia e tag `vX.Y.Z`.
- Quando a mudança depende de algo novo na API do painel, o `adom-admin` sobe primeiro.

## Homologação na Vercel

No projeto do site, em Settings → Environment Variables, crie
`VITE_ADMIN_API_URL` marcando só **Preview**, branch **develop**, apontando
para a homologação do painel. Opcional: Settings → Domains, um domínio como
`homolog.adomformen.com.br` ligado à branch `develop`.
