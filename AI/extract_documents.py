
from pathlib import Path
from pypdf import PdfReader

PROJECT_DIR = Path(__file__).resolve().parent.parent

DOCUMENTS_DIR = PROJECT_DIR / "AI" / "data" / "documents"
OUTPUT_DIR = PROJECT_DIR / "AI" / "data" / "extracted"

OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

successful_files = 0
failed_files = 0

for pdf_file in DOCUMENTS_DIR.glob("*.pdf"):
    print(f"\nExtracting: {pdf_file.name}")

    try:
        reader = PdfReader(str(pdf_file), strict=False)

        extracted_pages = []

        for page_number, page in enumerate(reader.pages, start=1):
            text = page.extract_text() or ""

            if text.strip():
                extracted_pages.append(
                    f"\n--- Page {page_number} ---\n{text}"
                )

        full_text = "\n".join(extracted_pages)

        if not full_text.strip():
            print("WARNING: No readable text found. Skipping file.")
            failed_files += 1
            continue

        output_file = OUTPUT_DIR / f"{pdf_file.stem}.txt"

        output_file.write_text(
            full_text,
            encoding="utf-8"
        )

        print(f"Pages: {len(reader.pages)}")
        print(f"Extracted characters: {len(full_text)}")
        print(f"Saved to: {output_file}")

        successful_files += 1

    except Exception as error:
        print(f"ERROR: Could not extract {pdf_file.name}")
        print(f"Reason: {error}")
        print("Skipping this document and continuing...")
        failed_files += 1

print("\nPDF extraction completed!")
print(f"Successfully extracted: {successful_files}")
print(f"Failed or skipped: {failed_files}")
