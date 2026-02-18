# Como Criar os Ícones para Lovely Prompt

## Ícones Necessários

Você precisa criar 3 ícones PNG com os seguintes tamanhos:
- **icon-16.png** - 16x16 pixels
- **icon-48.png** - 48x48 pixels  
- **icon-128.png** - 128x128 pixels

## Design Recomendado

### Cores
- **Gradiente**: De roxo (#9333EA) para azul (#3B82F6)
- **Fundo**: Pode ser transparente ou usar o gradiente

### Elementos
- Uma letra **"L"** estilizada (de "Lovely")
- Ou um ícone de raio/lightning bolt
- Design minimalista e moderno
- Cantos arredondados

## Opções para Criar os Ícones

### Opção 1: Usar um Gerador Online
1. Acesse: https://www.canva.com/
2. Crie um design 128x128px
3. Use as cores roxo (#9333EA) e azul (#3B82F6)
4. Adicione a letra "L" ou um símbolo de raio
5. Baixe como PNG
6. Use https://www.iloveimg.com/resize-image para redimensionar para 48x48 e 16x16

### Opção 2: Usar Figma
1. Crie um frame 128x128px
2. Adicione um gradiente de roxo para azul
3. Adicione a letra "L" em branco, fonte moderna (Inter ou Outfit)
4. Exporte como PNG 128x128
5. Redimensione para os outros tamanhos

### Opção 3: Usar DALL-E ou outro AI
Prompt sugerido:
```
Create a modern Chrome extension icon for "Lovely Prompt". 
Square icon with rounded corners. 
Gradient background from purple (#9333EA) to blue (#3B82F6). 
White stylized letter "L" in the center. 
Minimalist, professional design. 
128x128 pixels.
```

## Instruções de Instalação

1. Salve os 3 ícones PNG nesta pasta (`icons/`)
2. Certifique-se de que os nomes sejam exatamente:
   - `icon-16.png`
   - `icon-48.png`
   - `icon-128.png`
3. Rebuilde a extensão: `npm run build`
4. Recarregue a extensão no Chrome

## Exemplo Visual (ASCII)

```
╔════════════════╗
║   ████████     ║
║   █      █     ║
║   █      █     ║
║   █      █     ║
║   █      █     ║
║   ████████     ║
║                ║
╚════════════════╝
   Lovely Prompt
```

## Verificação

Após criar os ícones, verifique:
- [ ] Os 3 arquivos PNG existem na pasta `icons/`
- [ ] Os nomes estão corretos
- [ ] Os tamanhos estão corretos (16x16, 48x48, 128x128)
- [ ] A extensão foi rebuilda
- [ ] O ícone aparece no Chrome
