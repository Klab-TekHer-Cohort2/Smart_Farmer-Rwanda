
from AI.app.services.rag.retriever import load_chunks, search_documents


def test_load_chunks():
    chunks = load_chunks()

    assert len(chunks) > 0
    assert all("text" in chunk for chunk in chunks)
    assert all("source_file" in chunk for chunk in chunks)


def test_search_finds_rwasis_information():
    results = search_documents("RwaSIS UPI soil information")

    assert len(results) > 0
    assert any(
        "RwaSIS" in result["text"]
        or "UPI" in result["text"]
        for result in results
    )


def test_search_respects_top_k():
    results = search_documents("soil agriculture Rwanda", top_k=2)

    assert len(results) <= 2


def test_search_returns_no_results_for_empty_query():
    results = search_documents("")

    assert results == []
