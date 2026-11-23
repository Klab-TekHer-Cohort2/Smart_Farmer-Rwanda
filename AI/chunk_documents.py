
import json
import re
from pathlib import Path

PROJECT_DIR = Path(__file__).resolve().parent.parent

INPUT_DIR = PROJECT_DIR / "AI" / "data" / "extracted"
OUTPUT_DIR = PROJECT_DIR / "AI" / "data" / "chunks"

OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

OUTPUT_FILE = OUTPUT_DIR / "agricultural_chunks.jsonl"

CHUNK_SIZE = 1200


def clean_text(text):
    """Clean common PDF extraction encoding problems."""

    replacements = {
        "â€™": "’",
        "â€“": "–",
        "â€”": "—",
        "â€œ": "“",
        "â€\x9d": "”",
        "Â©": "©",
        "Â ": " ",
        "ï¬": "fi",
        "\x00": "",
    }

    for wrong, correct in replacements.items():
        text = text.replace(wrong, correct)

    return text.strip()


def is_reference_heading(line):
    """Identify common bibliography headings."""

    normalized = re.sub(
        r"[^a-z ]", "", line.lower()
    ).strip()

    headings = {
        "references",
        "bibliography",
        "reference list",
        "list of references",
        "works cited",
        "literature cited",
        "selected references",
    }

    return normalized in headings


def split_long_text(text, max_size):
    """Split long paragraphs into smaller pieces."""

    pieces = []

    while len(text) > max_size:
        split_at = text.rfind(" ", 0, max_size)

        if split_at < 1:
            split_at = max_size

        pieces.append(text[:split_at].strip())
        text = text[split_at:].strip()

    if text:
        pieces.append(text)

    return pieces


def create_chunks(text, filename):
    """Split documents into useful page-aware chunks."""

    pages = re.split(r"--- Page (\d+) ---", text)

    chunks = []

    footer_markers = [
        "QUICK LINKS",
        "Smart Admin",
        "CONTACT US",
        "P. O Box",
        "info@rab.gov.rw",
    ]

    inside_references = False

    for index in range(1, len(pages), 2):

        page_number = int(pages[index])
        page_text = clean_text(pages[index + 1])

        if not page_text:
            continue

        lines = [
            line.strip()
            for line in page_text.splitlines()
            if line.strip()
        ]

        # Detect the beginning of the numbered bibliography
        # in the RAB Annual Report 2019-2020.
        if filename == "RAB_Annual_Report_2019-2020.txt":

            if any(
                re.match(r"^39\s+Rukundo,", line, re.IGNORECASE)
                for line in lines
            ):
                inside_references = True

        # Skip all pages after the bibliography begins.
        if inside_references:
            print(
                f"Skipping bibliography: "
                f"{filename}, page {page_number}"
            )
            continue

        # Skip pages with irrelevant website footer content.
        footer_matches = sum(
            marker.lower() in page_text.lower()
            for marker in footer_markers
        )

        if footer_matches >= 2:
            continue

        # Skip pages with very little meaningful text.
        meaningful_text = re.sub(
            r"[\W_]+", "", page_text
        )

        if len(meaningful_text) < 40:
            continue

        # Skip clear table-of-contents pages.
        page_lower = page_text.lower()

        toc_indicators = [
            "table of contents",
            "list of tables",
            "list of figures",
        ]

        if (
            any(marker in page_lower for marker in toc_indicators)
            and len(lines) >= 5
        ):
            continue

        current_chunk = ""

        for paragraph in lines:

            if is_reference_heading(paragraph):
                break

            pieces = split_long_text(
                paragraph,
                CHUNK_SIZE
            )

            for piece in pieces:

                if (
                    current_chunk
                    and len(current_chunk) + len(piece) + 1 > CHUNK_SIZE
                ):
                    chunks.append({
                        "source_file": filename,
                        "page": page_number,
                        "text": current_chunk.strip(),
                    })

                    current_chunk = piece

                else:
                    current_chunk = (
                        current_chunk + "\n" + piece
                    ).strip()

        if current_chunk:
            chunks.append({
                "source_file": filename,
                "page": page_number,
                "text": current_chunk.strip(),
            })

    return chunks


def main():

    all_chunks = []

    for file_path in INPUT_DIR.glob("*.txt"):

        print(f"Processing: {file_path.name}")

        document_text = file_path.read_text(
            encoding="utf-8"
        )

        document_chunks = create_chunks(
            document_text,
            file_path.name
        )

        all_chunks.extend(document_chunks)

    with OUTPUT_FILE.open(
        "w",
        encoding="utf-8"
    ) as output:

        for number, chunk in enumerate(
            all_chunks,
            start=1
        ):

            chunk["chunk_id"] = f"chunk_{number:04d}"

            output.write(
                json.dumps(
                    chunk,
                    ensure_ascii=False
                ) + "\n"
            )

    print("\nChunking completed!")
    print(f"Total chunks: {len(all_chunks)}")
    print(f"Saved to: {OUTPUT_FILE}")


if __name__ == "__main__":
    main()
