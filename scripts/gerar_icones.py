"""
Gera os ícones PNG para o PWA.
Requer Pillow: pip install Pillow
Uso: python scripts/gerar_icones.py
"""
import os
import struct
import zlib


def create_png(size):
    """Cria um PNG simples com fundo #0d1117 e texto dourado 'V'."""
    try:
        from PIL import Image, ImageDraw, ImageFont
        img = Image.new('RGBA', (size, size), (13, 17, 23, 255))
        draw = ImageDraw.Draw(img)

        # Bordas arredondadas (máscara)
        radius = size // 5
        mask = Image.new('L', (size, size), 0)
        mask_draw = ImageDraw.Draw(mask)
        mask_draw.rounded_rectangle([0, 0, size - 1, size - 1], radius=radius, fill=255)
        img.putalpha(mask)

        # Letra V dourada
        font_size = int(size * 0.55)
        try:
            font = ImageFont.truetype('arialbd.ttf', font_size)
        except Exception:
            try:
                font = ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf', font_size)
            except Exception:
                font = ImageFont.load_default()

        text = 'V'
        bbox = draw.textbbox((0, 0), text, font=font)
        tw = bbox[2] - bbox[0]
        th = bbox[3] - bbox[1]
        x = (size - tw) // 2 - bbox[0]
        y = (size - th) // 2 - bbox[1]
        draw.text((x, y), text, fill=(245, 158, 11, 255), font=font)

        return img
    except ImportError:
        # Fallback: PNG sólido cor de fundo
        return _png_solido(size)


def _png_solido(size):
    """Gera imagem sólida sem Pillow como fallback (não é chamado se Pillow existe)."""
    from PIL import Image
    return Image.new('RGBA', (size, size), (13, 17, 23, 255))


def main():
    base = os.path.join(os.path.dirname(__file__), '..', 'public', 'icons')
    os.makedirs(base, exist_ok=True)

    for size in [192, 512]:
        path = os.path.join(base, f'icon-{size}.png')
        img = create_png(size)
        img.save(path, 'PNG')
        print(f'✓ icon-{size}.png gerado em {path}')


if __name__ == '__main__':
    main()
