"""Dialect identification with CAMeLBERT-DID trained on MADAR-6 (Beirut, Cairo, Doha, Rabat, Tunis, MSA)."""
from functools import lru_cache

MODEL_ID = "CAMeL-Lab/bert-base-arabic-camelbert-mix-did-madar-corpus6"

# MADAR-6 city labels mapped onto the four dialect regions used in this study.
LABEL_TO_REGION = {
    "BEI": "lev", "CAI": "egy", "DOH": "glf", "RAB": "mgr", "TUN": "mgr", "MSA": "msa",
    "Beirut": "lev", "Cairo": "egy", "Doha": "glf", "Rabat": "mgr", "Tunis": "mgr",
}


@lru_cache(maxsize=1)
def _pipeline():
    from transformers import pipeline
    return pipeline("text-classification", model=MODEL_ID, top_k=None, truncation=True, max_length=512)


def classify(texts: list[str]) -> list[dict]:
    """Return region probabilities and the argmax region for each text."""
    out = []
    for scores in _pipeline()(texts, batch_size=8):
        regions: dict[str, float] = {}
        for s in scores:
            region = LABEL_TO_REGION.get(s["label"], s["label"].lower())
            regions[region] = regions.get(region, 0.0) + s["score"]
        top = max(regions, key=regions.get)
        out.append({"region": top, "probs": regions})
    return out
