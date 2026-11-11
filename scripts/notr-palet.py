"""Acik temadaki yesilimsi krem/gri tonlari notr iOS tonlarina cevirir (index + ilce sayfalari).
Marka yesili (#ccff00, #4f6b00, #3d5400, #9fc400) degismez. Tekrar calistirmak zararsizdir."""
import io, glob, os, re
KOK = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
ESLE = {"#15170f": "#1d1d1f", "#262a1c": "#1d1d1f", "#22261a": "#1d1d1f",
        "#464c3c": "#3a3a3c", "#4a5040": "#3a3a3c", "#4f5544": "#3a3a3c",
        "#5b6150": "#6e6e73", "#6a7060": "#6e6e73", "#7b8270": "#8e8e93", "#7c8370": "#8e8e93", "#8b917f": "#8e8e93",
        "#f7f8f3": "#f5f5f7", "#fbfcf8": "#ffffff", "#fafbf5": "#f5f5f7", "#f2f4ec": "#f2f2f7", "#f4f6ee": "#f5f5f7",
        "#eef0e8": "#f5f5f7", "#e6e9df": "#e5e5ea", "#e2e6da": "#e5e5ea", "#eceee6": "#ececf0", "#ececde": "#ececf0",
        "#dfe3d6": "#e5e5ea", "#dbe0d1": "#d8d8de", "#d9ded0": "#d8d8de", "#cdd4bd": "#d2d2d7", "#c3c9b6": "#c7c7cc"}
for y in [os.path.join(KOK, "index.html")] + sorted(glob.glob(os.path.join(KOK, "*-reklamci-ve-tabelaci.html"))):
    s = io.open(y, encoding="utf-8").read(); n = 0
    for a, b in ESLE.items():
        s, k = re.subn(re.escape(a) + r"\b", b, s, flags=re.I); n += k
    io.open(y, "w", encoding="utf-8", newline="").write(s); print(os.path.basename(y), n, "renk")
