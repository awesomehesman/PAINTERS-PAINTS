export const galleryItems = [
  { featured: true, id: 'warm-exterior', title: 'Texture meets architecture', subtitle: 'Warm ivory · Charcoal accents', categories: ['Gamazine', 'Exterior'], image: 'gamazine', alt: 'AI-generated contemporary home with ivory textured walls, charcoal trim and indigenous planting', credit: 'AI-generated inspiration', source: '', note: 'Illustration only; confirm the actual finish with a physical sample.' },
  { featured: true, id: 'warm-interior', title: 'A softer side of texture', subtitle: 'Sand tones · Decorative walls', categories: ['Glamourcotes', 'Interior'], image: 'glamour', alt: 'AI-generated living room with a sand-coloured textured feature wall, ivory sofa and stepped white ceiling', credit: 'AI-generated inspiration', source: '', note: 'Illustration only; confirm the actual finish with a physical sample.' },
  { featured: true, ...illustration('interior-painted-sage', 'Room to feel at home', 'Sage & ivory · Smooth matt walls', ['Interior'], 'Freshly painted sage-green and ivory interior walls with a smooth matt finish, crisp white skirting and neat doorway edges') },
  { featured: true, ...illustration('interior-painted-clay', 'A fresh perspective', 'Warm clay · Clean painted edges', ['Interior'], 'Warm clay accent wall beside a cream painted wall, with even colour coverage and precise white skirting and door trim') },
  illustration('gamazine-courtyard', 'Texture in the sunshine', 'Cream aggregate · Courtyard walls', ['Gamazine', 'Exterior'], 'Cream Gamazine-inspired courtyard wall with visible coarse aggregate, a dark window frame and aloe planting'),
  illustration('gamazine-boundary', 'A striking first impression', 'Grey texture · Boundary walls', ['Gamazine', 'Exterior'], 'Grey textured boundary wall with white coping and a charcoal entrance gate'),
  illustration('glamour-pearl', 'A touch of pearl', 'Ivory mineral flecks · Soft shimmer', ['Glamourcotes', 'Interior'], 'Pearl ivory decorative wall with fine mineral flecks above a slim oak console'),
  illustration('glamour-charcoal', 'Depth in every detail', 'Graphite flecks · Statement texture', ['Glamourcotes'], 'Charcoal decorative feature wall with silver mineral flecks, a wood sideboard and cream chair'),
  illustration('ceiling-texture-ivory', 'Warmth in every detail', 'Ivory & gold · Textured ceiling', ['Ceilings'], 'Ivory Gamazine-style textured ceiling with a golden textured perimeter, white cornices and recessed downlights'),
  illustration('ceiling-texture-terracotta', 'Layers of colour and texture', 'Terracotta & silver · Textured tray ceiling', ['Ceilings'], 'Terracotta and silver-grey decorative textured tray ceiling with crisp white borders and warm cove lighting'),
  illustration('ceiling-texture-peach', 'A decorative finish overhead', 'Peach & cream · Sculpted ceiling detail', ['Ceilings'], 'Peach and cream textured ceiling with raised irregular coating detail, white mouldings and an octagonal ceiling rose'),
  illustration('ceiling-texture-pearl', 'A little drama above', 'Pearl & charcoal · Textured ceiling', ['Ceilings'], 'Pearl ivory and charcoal decorative textured ceiling with refined white trim and warm recessed lighting')
];

function illustration(image, title, subtitle, categories, description) {
  return { id: image, title, subtitle, categories, image,
    alt: `AI-generated inspiration: ${description}`,
    credit: 'AI-generated inspiration', source: '',
    note: 'Illustration only; confirm the actual finish with a physical sample.' };
}
