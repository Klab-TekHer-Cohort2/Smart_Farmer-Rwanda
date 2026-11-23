
import json
import re
from pathlib import Path
from collections import Counter

PROJECT_DIR = Path(__file__).resolve().parents[3]

CHUNKS_FILE = (
    PROJECT_DIR / "data" / "chunks" / "agricultural_chunks.jsonl"
)

STOP_WORDS = {
    "the", "and", "for", "are", "was", "were",
    "with", "from", "that", "this", "which",
    "what", "when", "where", "how", "can",
    "could", "should", "would", "does", "did",
    "have", "has", "had", "will", "shall",
    "you", "your", "their", "they", "them",
    "its", "our", "about", "into", "also",
    "not", "but", "all", "any", "some",
    "please", "tell", "explain", "give",
    "want", "need", "know", "information",
}

AGRICULTURAL_KEYWORDS = {
    "soil", "texture", "type", "ph", "acidity",
    "fertility", "drainage", "depth", "clay",
    "loamy", "sandy", "volcanic", "organic",
    "maize", "beans", "rice", "cassava",
    "banana", "potato", "wheat", "sorghum",
    "fertilizer", "manure", "compost", "lime",
    "rainfall", "drought", "irrigation",
    "pest", "disease", "yield", "planting",
    "harvesting", "crop", "crops", "farming",
    "agriculture", "seed", "seeds",
}


def load_chunks():
    """Load agricultural knowledge chunks."""

    chunks = []

    if not CHUNKS_FILE.exists():
        return chunks

    with CHUNKS_FILE.open("r", encoding="utf-8") as file:
        for line in file:
            if line.strip():
                chunks.append(json.loads(line))

    return chunks


def tokenize(text):
    """Extract useful search terms."""

    words = re.findall(
        r"\b[a-zA-Z]{3,}\b",
        text.lower()
    )

    return [
        word for word in words
        if word not in STOP_WORDS
    ]


def is_reference_chunk(text):
    """Identify obvious bibliography entries."""

    lines = [
        line.strip()
        for line in text.splitlines()
        if line.strip()
    ]

    if not lines:
        return True

    reference_patterns = [
        r"^\d+\s+[A-Z][a-z]+,",
        r"^https?://",
        r"doi:",
    ]

    reference_lines = sum(
        any(
            re.search(pattern, line, re.IGNORECASE)
            for pattern in reference_patterns
        )
        for line in lines
    )

    return reference_lines >= max(1, len(lines) // 2)


def search_documents(query: str, top_k: int = 3):
    """
    Retrieve agricultural chunks using weighted keyword matching.
    """

    chunks = load_chunks()

    query_words = set(tokenize(query))

    if not query_words:
        return []

    results = []

    for chunk in chunks:

        text = chunk.get("text", "")

        if not text or is_reference_chunk(text):
            continue

        document_words = tokenize(text)
        word_counts = Counter(document_words)

        matched_words = query_words.intersection(word_counts)

        if not matched_words:
            continue

        # Give extra importance to agricultural terms.
        score = 0

        for word in matched_words:
            score += min(word_counts[word], 3)

            if word in AGRICULTURAL_KEYWORDS:
                score += 2

        # Reward chunks matching several different query terms.
        score += len(matched_words) * 2

        # Reward exact agricultural phrase matches.
        text_lower = text.lower()

        if query.lower().strip() in text_lower:
            score += 5

        results.append({
            **chunk,
            "relevance_score": score,
            "matched_keywords": sorted(matched_words),
        })

    results.sort(
        key=lambda item: item["relevance_score"],
        reverse=True
    )

    return results[:top_k]
