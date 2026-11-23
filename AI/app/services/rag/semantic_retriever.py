
import hashlib
import json
from pathlib import Path

import torch
from sentence_transformers import SentenceTransformer, util


PROJECT_DIR = Path(__file__).resolve().parents[3]

CHUNKS_FILE = (
    PROJECT_DIR / "data" / "chunks" / "agricultural_chunks.jsonl"
)

EMBEDDINGS_FILE = (
    PROJECT_DIR / "data" / "chunks" / "document_embeddings.pt"
)

MODEL_NAME = "sentence-transformers/all-MiniLM-L6-v2"

MIN_SIMILARITY = 0.55

model = SentenceTransformer(MODEL_NAME)


def load_chunks():
    """Load agricultural document chunks."""

    chunks = []

    if not CHUNKS_FILE.exists():
        return chunks

    with CHUNKS_FILE.open("r", encoding="utf-8") as file:
        for line in file:
            if line.strip():
                chunks.append(json.loads(line))

    return chunks


def get_documents_fingerprint(documents):
    """Create a fingerprint of the current document contents."""

    content = json.dumps(
        documents,
        ensure_ascii=False,
        sort_keys=True
    )

    return hashlib.sha256(content.encode("utf-8")).hexdigest()


def load_or_create_embeddings(chunks):
    """Load valid cached embeddings or rebuild them."""

    documents = [chunk["text"] for chunk in chunks]
    current_fingerprint = get_documents_fingerprint(documents)

    if EMBEDDINGS_FILE.exists():
        try:
            saved_data = torch.load(
                EMBEDDINGS_FILE,
                map_location="cpu",
                weights_only=True
            )

            if (
                isinstance(saved_data, dict)
                and saved_data.get("fingerprint") == current_fingerprint
                and saved_data["embeddings"].ndim == 2
                and saved_data["embeddings"].shape[0] == len(chunks)
                and saved_data["embeddings"].shape[1]
                == model.get_embedding_dimension()
            ):
                print("Loading saved document embeddings...")
                return saved_data["embeddings"]

            print("Document chunks changed. Rebuilding embeddings...")

        except (OSError, RuntimeError, ValueError, KeyError, TypeError):
            print("Invalid embedding cache. Rebuilding embeddings...")

    if not documents:
        return torch.empty(
            (0, model.get_embedding_dimension())
        )

    print("Creating document embeddings...")

    embeddings = model.encode(
        documents,
        convert_to_tensor=True
    )

    torch.save(
        {
            "fingerprint": current_fingerprint,
            "embeddings": embeddings
        },
        EMBEDDINGS_FILE
    )

    print("Document embeddings saved successfully!")

    return embeddings


def semantic_search(
    query: str,
    top_k: int = 3,
    min_similarity: float = MIN_SIMILARITY
):
    """Retrieve relevant agricultural passages using semantic similarity."""

    if not query or not query.strip():
        return []

    if top_k < 1:
        return []

    if not 0 <= min_similarity <= 1:
        raise ValueError("Minimum similarity must be between 0 and 1.")

    chunks = load_chunks()

    if not chunks:
        return []

    document_embeddings = load_or_create_embeddings(chunks)

    if document_embeddings.shape[0] == 0:
        return []

    query_embedding = model.encode(
        query,
        convert_to_tensor=True
    )

    results = util.semantic_search(
        query_embedding,
        document_embeddings,
        top_k=min(top_k, len(chunks))
    )[0]

    retrieved_documents = []

    for result in results:
        similarity = float(result["score"])

        if similarity < min_similarity:
            continue

        chunk = chunks[result["corpus_id"]]

        retrieved_documents.append({
            **chunk,
            "similarity_score": round(similarity, 4)
        })

    return retrieved_documents
