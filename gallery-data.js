export const galleryItems = [
  { featured: true, id: 'warm-exterior', title: 'Texture meets architecture', subtitle: 'Warm ivory · Charcoal accents', categories: ['Gamazine', 'Exterior'], image: 'gamazine', alt: 'AI-generated contemporary home with ivory textured walls, charcoal trim and indigenous planting', credit: 'AI-generated inspiration', source: '', note: 'Illustration only; confirm the actual finish with a physical sample.' },
  { featured: true, id: 'warm-interior', title: 'A softer side of texture', subtitle: 'Sand tones · Decorative walls', categories: ['Glamourcotes', 'Interior'], image: 'glamour', alt: 'AI-generated living room with a sand-coloured textured feature wall, ivory sofa and stepped white ceiling', credit: 'AI-generated inspiration', source: '', note: 'Illustration only; confirm the actual finish with a physical sample.' },
  { featured: true, id: 'light-interior', title: 'Room to feel at home', subtitle: 'Painted interiors · Light & calm', categories: ['Interior'], image: 'interior', alt: 'Light living room with a white sofa, bookshelves and softly painted walls', credit: 'Photograph by Kailun Zhang / Unsplash', source: 'https://unsplash.com/photos/living-room-with-white-sofa-and-bookshelf-7G-ojH_5gbI', note: 'Licensed inspiration photograph; not a Painters & Paints project.' },
  { featured: true, id: 'bright-studio', title: 'A fresh perspective', subtitle: 'White walls · Bright interiors', categories: ['Interior'], image: 'studio', alt: 'Bright white interior with painted walls, a light ceiling and indoor plants', credit: 'Photograph by CoWomen / Unsplash', source: 'https://unsplash.com/photos/white-living-room-1hlFqUdFv1s', note: 'Licensed inspiration photograph; not a Painters & Paints project.' },
  illustration('gamazine-courtyard', 'Texture in the sunshine', 'Cream aggregate · Courtyard walls', ['Gamazine', 'Exterior'], 'Cream Gamazine-inspired courtyard wall with visible coarse aggregate, a dark window frame and aloe planting'),
  illustration('gamazine-boundary', 'A striking first impression', 'Grey texture · Boundary walls', ['Gamazine', 'Exterior'], 'Grey textured boundary wall with white coping and a charcoal entrance gate'),
  illustration('glamour-pearl', 'A touch of pearl', 'Ivory mineral flecks · Soft shimmer', ['Glamourcotes', 'Interior'], 'Pearl ivory decorative wall with fine mineral flecks above a slim oak console'),
  illustration('glamour-charcoal', 'Depth in every detail', 'Graphite flecks · Statement texture', ['Glamourcotes'], 'Charcoal decorative feature wall with silver mineral flecks, a wood sideboard and cream chair'),
  illustration('ceiling-white', 'A clean finish overhead', 'Matt white · Crisp cornices', ['Ceilings'], 'Upward view of a smooth white painted ceiling with white cornices above sage green walls'),
  illustration('ceiling-tray', 'Light above, warmth below', 'Ivory paint · Stepped ceiling', ['Ceilings'], 'Upward view of an ivory painted tray ceiling with recessed cove lighting and downlights'),
  illustration('ceiling-blue', 'Colour beyond the walls', 'Powder blue · White cornices', ['Ceilings'], 'Upward view of a pale blue painted ceiling framed by white cornices and the top of a bright window')
];

function illustration(image, title, subtitle, categories, description) {
  return { id: image, title, subtitle, categories, image,
    alt: `AI-generated inspiration: ${description}`,
    credit: 'AI-generated inspiration', source: '',
    note: 'Illustration only; confirm the actual finish with a physical sample.' };
}
