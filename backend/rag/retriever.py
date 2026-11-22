import math
import re
from pathlib import Path
from typing import Dict, List, Any

KB_DIR = Path(__file__).resolve().parent / "kb"


class SimpleKBRetriever:
    def __init__(self, kb_dir: Path = KB_DIR):
        self.kb_dir = kb_dir
        self.chunks: List[Dict[str, Any]] = []
        self._load_and_index()

    def _tokenize(self, text: str) -> List[str]:
        return re.findall(r"\b[a-zA-Z0-9_\-\$]+\b", text.lower())

    def _load_and_index(self) -> None:
        if not self.kb_dir.exists():
            return

        for filepath in sorted(self.kb_dir.glob("*.md")):
            filename = filepath.name
            with open(filepath, "r", encoding="utf-8") as f:
                content = f.read()

            # Split content by markdown sections (# or ##)
            sections = re.split(r"(?m)^(?=##? )", content)
            for sec in sections:
                clean_sec = sec.strip()
                if not clean_sec:
                    continue
                tokens = self._tokenize(clean_sec)
                if not tokens:
                    continue
                # Extract section title
                title_match = re.search(r"^##?\s*(.+)$", clean_sec, re.MULTILINE)
                title = title_match.group(1).strip() if title_match else filename

                self.chunks.append({
                    "filename": filename,
                    "title": title,
                    "text": clean_sec,
                    "tokens": tokens,
                    "token_set": set(tokens),
                })

    def search(self, query: str, top_k: int = 2) -> List[Dict[str, Any]]:
        query_tokens = self._tokenize(query)
        if not query_tokens or not self.chunks:
            return []

        # Simple BM25-like scoring with term frequency and document length normalization
        avg_doc_len = sum(len(c["tokens"]) for c in self.chunks) / len(self.chunks)
        scores: List[tuple[float, Dict[str, Any]]] = []

        k1 = 1.5
        b = 0.75
        total_docs = len(self.chunks)

        for chunk in self.chunks:
            score = 0.0
            doc_len = len(chunk["tokens"])
            for q in query_tokens:
                # Document frequency for term q
                df = sum(1 for c in self.chunks if q in c["token_set"])
                if df == 0:
                    continue
                # IDF
                idf = math.log((total_docs - df + 0.5) / (df + 0.5) + 1.0)
                # Term frequency in chunk
                tf = chunk["tokens"].count(q)
                if tf == 0:
                    continue
                tf_norm = (tf * (k1 + 1)) / (tf + k1 * (1 - b + b * (doc_len / avg_doc_len)))
                score += idf * tf_norm

            if score > 0:
                scores.append((score, chunk))

        scores.sort(key=lambda x: x[0], reverse=True)
        results = []
        for s, c in scores[:top_k]:
            results.append({
                "filename": c["filename"],
                "title": c["title"],
                "content": c["text"],
                "relevance_score": round(s, 3),
            })
        return results


# Global singleton
_retriever_instance: SimpleKBRetriever = None


def get_retriever() -> SimpleKBRetriever:
    global _retriever_instance
    if _retriever_instance is None:
        _retriever_instance = SimpleKBRetriever()
    return _retriever_instance


def search_curriculum(query: str, top_k: int = 2) -> List[Dict[str, Any]]:
    return get_retriever().search(query, top_k=top_k)
