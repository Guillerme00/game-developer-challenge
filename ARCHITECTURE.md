# Arquitetura

## Visão geral

O projeto é uma aplicação de página única. React controla as telas e os menus; PixiJS desenha e atualiza o mundo do jogo. O estado de opções e o histórico ficam no `localStorage` do navegador.

```text
src/main.tsx
  └── App
      ├── MenuPage
      │   ├── Options_Menu
      │   ├── Ranking_Menu
      │   └── Match_History_Menu
      └── Game (carregado sob demanda)
          └── Game_Stage
              ├── usePixiGame
              └── Game_Hud
```

## Entrada e navegação

- `src/main.tsx` monta o React em `#root` e ativa `StrictMode`.
- `src/App.tsx` escolhe entre menu e jogo, carrega o módulo do jogo com `React.lazy` e exibe uma tela de carregamento enquanto ele é importado.
- `src/pages/menu.tsx` conecta os botões e os menus de opções, ranking e histórico.
- `src/pages/game.tsx` encaminha as propriedades do jogo para `Game_Stage`.

## Jogo

- `src/components/game_stage.tsx` mantém o estado React necessário para HUD, pausa e fim de partida. Também registra o resultado da partida uma única vez e coordena reinício e retorno ao menu.
- `src/game/use_pixi_game.ts` inicializa e destrói a aplicação PixiJS, registra eventos de entrada e atualiza o mundo no ticker. A simulação não avança enquanto está pausada. A perda de foco da janela ou a ocultação da aba causa uma pausa automática.
- `src/components/game_hud.tsx` exibe vida, pontuação, tempo, controles de pausa e tela de fim de jogo.
- `src/game/game_config.ts` reúne valores de gameplay.
- `src/game/game_types.ts` declara os tipos das entidades do jogo e as propriedades de `Game_Stage`.
- `src/game/game_utils.ts` reúne funções reutilizáveis para geração pseudoaleatória, cooldown de tiro e rotação do navio em direção ao mouse.

O jogador pode mover-se com W/S, mirar com o mouse, disparar para frente com M1 e usar Q/E para os disparos laterais. Os inimigos incluem navios que atiram e Seakkers que perseguem o jogador. As constantes de velocidade, vidas, dano e spawn estão em `game_config.ts`.

## Opções e persistência

`src/App.tsx` é responsável por ler, validar e gravar os dados persistentes:

| Dado | Chave do `localStorage` | Formato |
| --- | --- | --- |
| Duração da partida | `pirate-battle-session-time-seconds` | Número em segundos |
| Intervalo de spawn | `pirate-battle-enemy-spawn-interval-seconds` | Número em segundos |
| Histórico de partidas | `pirate-battle-match-history` | JSON de `MatchHistoryEntry[]` |

As opções têm valores padrão caso não existam dados salvos ou os valores encontrados sejam inválidos. Registros de partidas são validados antes de serem usados.

`src/types/match_history.ts` define `MatchHistoryEntry` e os motivos de encerramento: `time-expired`, `ship-destroyed` e `returned-to-menu`.

O fluxo de um resultado é:

1. `Game_Stage` detecta o encerramento da partida ou o pedido para voltar ao menu.
2. O callback `onMatchComplete` entrega o registro à aplicação.
3. `App` atualiza o estado em memória e persiste a lista no `localStorage`.
4. `MenuPage` passa os registros a `Match_History_Menu` e `Ranking_Menu`.
5. O histórico apresenta os registros recebidos; o ranking cria uma cópia e ordena por pontuação decrescente, usando a data mais recente como desempate.

## Testes

Os arquivos de teste ficam em `src/test/`. Vitest executa os testes com o ambiente jsdom; Testing Library verifica a interface pelos papéis e conteúdo acessíveis. `src/test/setup.ts` carrega as extensões de asserção do jest-dom e limpa o DOM após cada teste.

```bash
npm test
npm run test:watch
```

## Limites atuais

- Persistência é local ao navegador; ainda não há API, backend ou sincronização.
- Não há testes ponta a ponta com Playwright.
- Controles touch não estão implementados.
- Projéteis têm tempo de vida e são removidos em colisões, mas ainda não há limpeza específica baseada em sair da área visível.
