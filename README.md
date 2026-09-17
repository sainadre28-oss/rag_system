# RAG Knowledge Base API

An AI-powered document Q&A system built with Retrieval-Augmented Generation (RAG). Upload a PDF or text document, ask questions about it, and get answers grounded entirely in that document's content — not generic AI knowledge.

## How it works

1. **Upload** a document → text is extracted, split into overlapping chunks, and converted into vector embeddings using Google's Gemini API
2. **Embeddings** are stored in a ChromaDB vector database
3. **Ask a question** → the question is embedded, matched against the stored chunks via similarity search, and the most relevant chunks are retrieved
4. **Answer generation** → the retrieved chunks are passed to Gemini as context, which generates an answer grounded strictly in that content — with source excerpts shown alongside the answer

## Tech Stack

- **Backend:** Node.js, Express
- **Database:** PostgreSQL + Prisma ORM (document metadata)
- **Vector Database:** ChromaDB (embeddings storage & similarity search)
- **AI:** Google Gemini API (`gemini-embedding-001` for embeddings, `gemini-3.6-flash` for generation)
- **File handling:** Multer (uploads), pdf-parse (PDF text extraction)
- **Frontend:** Vanilla HTML/JS (single-page interface)
- **Testing:** Jest

## Project Structure



DATABASE_URL="postgresql://username@localhost:5432/rag_system?schema=public"
GEMINI_API_KEY="your_gemini_api_key_here"



### Database setup

```bash
npx prisma migrate dev
```

### Running the app

This project requires **two servers running simultaneously**, in separate terminals:

**Terminal 1 — ChromaDB (vector database):**
```bash
npx chromadb run --path ./chroma-data
```

**Terminal 2 — Express server:**
```bash
node server.js
```

Then open [http://localhost:3000](http://localhost:3000) in your browser.

## Running Tests

```bash
npm test
```

## API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/upload` | Upload a `.pdf` or `.txt` file (multipart form, field name `file`) |
| `POST` | `/query` | Ask a question — JSON body: `{ "question": "..." }` |

## What I learned building this

This project took me through the full stack of a real backend application: Express routing and middleware, file upload handling, relational database design with PostgreSQL and Prisma, and — the core focus — how Retrieval-Augmented Generation actually works under the hood: chunking strategy, embedding generation, vector similarity search, and prompt construction to ground an LLM's response in retrieved context rather than its own training data.

## Future improvements

- User authentication and per-user document scoping
- Support for more file types (DOCX, HTML)
- Citation linking back to exact source document, not just excerpt text
- Deployment to a live hosted environment