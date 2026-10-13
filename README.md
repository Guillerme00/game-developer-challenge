# Pirate Battle

Jogo de batalha naval desenvolvido com React, TypeScript e PixiJS. O jogador controla um navio, enfrenta inimigos e tenta obter a maior pontuação antes que o tempo acabe ou o navio seja destruído.

## Requisitos

- Node.js e npm compatíveis com as versões do projeto.

## Como executar

Instale as dependências:

```bash
npm install
```

Inicie o servidor de desenvolvimento:

```bash
npm run dev
```

## Comandos disponíveis

| Comando | Descrição |
| --- | --- |
| `npm run dev` | Inicia o servidor local do Vite. |
| `npm run build` | Executa a verificação TypeScript e gera a versão de produção em `dist/`. |
| `npm run preview` | Serve localmente a versão gerada em `dist/`. |
| `npm run lint` | Executa o ESLint no projeto. |
| `npm test` | Executa os testes uma vez com Vitest. |
| `npm run test:watch` | Executa os testes em modo de observação. |

## Como jogar

- **W / S:** mover o navio para frente e para trás.
- **Mouse:** mirar.
- **Botão esquerdo do mouse (M1):** disparo frontal.
- **Q / E:** disparar os canhões laterais esquerdo e direito.
- **Escape:** pausar ou retomar. Ao perder o foco ou ocultar a aba, o jogo pausa automaticamente; é necessário escolher **Continuar** para retomar.

O jogador ganha um ponto por inimigo destruído pelos seus disparos. A partida termina quando o tempo acaba ou quando a vida do navio chega a zero. Também é possível reiniciar ou voltar ao menu.

## Opções, ranking e histórico

- A duração da partida pode ser configurada entre 1 e 3 minutos, em incrementos de 30 segundos.
- O intervalo de surgimento de inimigos pode ser configurado entre 3 e 10 segundos, em incrementos de 0,5 segundo.
- As opções são persistidas no `localStorage`.
- Cada partida concluída, encerrada pelo jogador ou terminada por falta de tempo é registrada localmente com data, pontuação, duração e motivo do encerramento.
- O histórico exibe as partidas na ordem em que foram registradas. O ranking usa os mesmos registros e os ordena por pontuação decrescente; em caso de empate, a partida mais recente aparece primeiro.

Os dados não são sincronizados entre dispositivos: não há backend ou API remota configurada.

## Testes

Os testes usam Vitest, Testing Library e jsdom. Eles cobrem componentes e comportamentos da interface, como ordenação do ranking, histórico e limites das opções. Para executar:

```bash
npm test
```

Consulte [ARCHITECTURE.md](./ARCHITECTURE.md) para conhecer a organização do código e o fluxo de dados.
