---
description: Model a product catalog — variants, options, categories, attributes, media
permissions:
  reads: ["**/*"]
  writes: ["**/*"]
  commands: []
  network: false
  destructive: false
---

Design and implement a product catalog data model that fits the store's actual merchandise: the
product/variant/option structure, category tree, filterable attributes, and media handling. A good
catalog model is the difference between "add a new product line in an afternoon" and "every new
attribute is a migration" — and it directly powers browsing, filtering, and search, which is how
shoppers find what they buy.

Steps:

1. **Detect platform and existing model**
   - Identify the stack: Shopify (products/variants/options are fixed — work with metafields and collections), Medusa (extendable entities), WooCommerce (post types + attribute taxonomies), or custom (own schema — most freedom, most responsibility)
   - Read any existing product schema, migrations, types, or admin code; list what's already modeled and what's ad hoc (JSON blobs, misused fields)
   - From `$ARGUMENTS` and sample products, understand the merchandise: how many products, do they vary (size/color/material), digital or physical, single- or multi-brand

2. **Model products, variants, and options**
   - **Product** = the sellable concept (title, description, brand, media, category); **Variant** = the purchasable SKU (price, stock, barcode, weight/dims); **Option** = the axis that generates variants (Size, Color)
   - Rules that prevent later pain: SKU and price live on the variant, never the product; a no-variant product still has exactly one default variant; cap option axes at 2-3 (platforms and shoppers both struggle beyond that)
   - Variants are for choices of the *same* product; a different product (v2, bundle) is a new product — encode this distinction explicitly

3. **Design the category tree and attributes**
   - Categories = the navigation hierarchy, shallow (2-3 levels) and shopper-worded, one primary category per product plus optional secondary placements/collections
   - Attributes = structured, typed facts (material, capacity, compatibility) used for filtering, comparison, and SEO — define per-category attribute sets rather than one global free-for-all
   - Distinguish **variant-defining** options (color changes the SKU) from **descriptive** attributes (country of origin doesn't) — conflating them is the most common modeling bug
   - Support faceted filtering from the model: attributes must be queryable values, not text inside descriptions

4. **Handle media**
   - Multiple ordered images per product, plus per-variant image association (shopper picks "blue" → gallery shows blue)
   - Required `alt` text (accessibility and image SEO), stored originals with responsive derivatives (thumbnails, gallery, zoom), lazy loading below the fold
   - Leave room for non-image media where relevant: video, 3D/AR models, PDFs (spec sheets)

5. **Implement on the detected platform**
   - Shopify: options/variants natively (watch the variant limit), metafields with defined types for attributes, collections (manual + automated) for categories
   - Medusa/custom: entities/tables + migrations, unique constraints on SKU and handle/slug, indexes on category and filterable attributes
   - WooCommerce: global attribute taxonomies for filterable facets, custom fields for the rest
   - Seed realistic sample data covering the tricky cases: multi-option product, single-variant product, product in two collections

6. **Verify with real merchandising questions**
   - Can you answer from the model alone: "all red items under €50 in Jackets", "which SKUs share this option value", "what does the size guide for this category say"?
   - Confirm listing/detail pages and filters read from the model, then summarize the schema and hand off: `/ecommerce--inventory-management` for stock, `/ecommerce--product-descriptions` for copy at scale

**Notes:**
- Model for the merchandise you have plus one year — not for a hypothetical marketplace; over-generalized EAV schemas kill query performance and developer sanity
- Slugs/handles are permanent URLs: generate once, redirect on rename, never reuse
- Price is money: integer minor units or decimal type, with currency — never floats
- Keep search/SEO fields (meta title/description, searchable keywords) on the model from day one; retrofitting them is painful
- If the platform's native model already fits (it usually does on Shopify), extend it with metafields instead of building a parallel product table

$ARGUMENTS
