export const galleryItems = [
  { featured: true, id: 'warm-exterior', title: 'Texture meets architecture', subtitle: 'Warm ivory · Charcoal accents', categories: ['Gamazine', 'Exterior'], image: 'gamazine', alt: 'AI-generated contemporary home with ivory textured walls, charcoal trim and indigenous planting', credit: 'AI-generated inspiration', source: '', note: 'Illustration only; confirm the actual finish with a physical sample.' },
  { featured: true, id: 'warm-interior', title: 'A softer side of texture', subtitle: 'Sand tones · Decorative walls', categories: ['Glamourcotes', 'Interior'], image: 'glamour', alt: 'AI-generated living room with a sand-coloured textured feature wall, ivory sofa and stepped white ceiling', credit: 'AI-generated inspiration', source: '', note: 'Illustration only; confirm the actual finish with a physical sample.' },
  { featured: true, id: 'light-interior', title: 'Room to feel at home', subtitle: 'Painted interiors · Light & calm', categories: ['Interior'], image: 'interior', alt: 'Light living room with a white sofa, bookshelves and softly painted walls', credit: 'Photograph by Kailun Zhang / Unsplash', source: 'https://unsplash.com/photos/living-room-with-white-sofa-and-bookshelf-7G-ojH_5gbI', note: 'Licensed inspiration photograph; not a Painters & Paints project.' },
  { featured: true, id: 'bright-studio', title: 'A fresh perspective', subtitle: 'White walls · Bright interiors', categories: ['Interior'], image: 'studio', alt: 'Bright white interior with painted walls, a light ceiling and indoor plants', credit: 'Photograph by CoWomen / Unsplash', source: 'https://unsplash.com/photos/white-living-room-1hlFqUdFv1s', note: 'Licensed inspiration photograph; not a Painters & Paints project.' },
  illustration('gamazine-courtyard', 'Texture in the sunshine', 'Cream aggregate · Courtyard walls', ['Gamazine', 'Exterior'], 'Cream Gamazine-inspired courtyard wall with visible coarse aggregate, a dark window frame and aloe planting'),
  illustration('gamazine-boundary', 'A striking first impression', 'Grey texture · Boundary walls', ['Gamazine', 'Exterior'], 'Grey textured boundary wall with white coping and a charcoal entrance gate'),
  illustration('glamour-pearl', 'A touch of pearl', 'Ivory mineral flecks · Soft shimmer', ['Glamourcotes', 'Interior'], 'Pearl ivory decorative wall with fine mineral flecks above a slim oak console'),
  illustration('glamour-charcoal', 'Depth in every detail', 'Graphite flecks · Statement texture', ['Glamourcotes'], 'Charcoal decorative feature wall with silver mineral flecks, a wood sideboard and cream chair'),
  ceilingReference('ceiling-textured-gold', 'Texture from wall to ceiling', 'Neutral ceiling · Golden textured surround', 391, 511, 'Decorative textured ceiling above gold textured walls, framed by a stepped border and white cornice'),
  ceilingReference('ceiling-textured-tray', 'Layers of colour and texture', 'Terracotta & grey · Textured tray ceiling', 516, 387, 'Terracotta and grey textured tray ceiling with contrasting white borders and a raised central panel'),
  ceilingReference('ceiling-textured-rose', 'A decorative finish overhead', 'Peach & cream · Textured ceiling detail', 495, 400, 'Peach and cream ceiling with prominent decorative coating texture, white trim and an octagonal ceiling rose')
];

function illustration(image, title, subtitle, categories, description) {
  return { id: image, title, subtitle, categories, image,
    alt: `AI-generated inspiration: ${description}`,
    credit: 'AI-generated inspiration', source: '',
    note: 'Illustration only; confirm the actual finish with a physical sample.' };
}

function ceilingReference(image, title, subtitle, nativeWidth, nativeHeight, alt) {
  return { id: image, title, subtitle, categories: ['Ceilings'], image,
    nativeWidth, nativeHeight, fit: 'contain', alt,
    credit: 'Supplied reference photograph', source: '',
    note: 'Gamazine / Glamourcotes ceiling inspiration. Confirm the coating and colour with a physical sample.' };
}
