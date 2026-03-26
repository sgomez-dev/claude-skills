---
description: Implement vector embeddings for semantic search, RAG, or similarity matching
permissions:
  reads: ["**/*"]
  writes: ["**/*"]
  commands: []
  network: true
  destructive: false
---

Implement vector embeddings for the application.

Steps:
1. Understand the use case:
   - Semantic search (find similar documents)
   - RAG (Retrieval Augmented Generation)
   - Recommendation system
   - Clustering / classification
2. Choose embedding model and vector store:
   - Models: OpenAI text-embedding-3, Cohere, local models
   - Vector stores: Pinecone, Weaviate, Qdrant, pgvector, ChromaDB
3. Implement:
   - **Ingestion pipeline**: Document → Chunk → Embed → Store
   - **Chunking strategy**: By paragraph, sentence, or fixed size with overlap
   - **Query pipeline**: Query → Embed → Search → Rank → Return
   - **Similarity metrics**: Cosine similarity, dot product, Euclidean
4. Optimize:
   - Batch embedding for bulk operations
   - Metadata filtering to narrow search scope
   - Hybrid search (vector + keyword)
   - Re-ranking for better relevance
5. Handle:
   - Document updates (re-embed changed docs)
   - Large documents (chunking with context preservation)
   - Rate limits on embedding APIs

Use case: $ARGUMENTS
