// ============================================================
// DENIO SPORTS — Mock Reviews
// ============================================================

const allReviews = {
  'denio-pro-match-football': [
    { id: 'r1', userName: 'Arjun Mehta', rating: 5, date: '2026-09-12', title: 'Best football at this price', comment: 'Excellent grip and flight. Have been using it for club matches and it holds up really well. The stitching quality is top-notch.', verified: true, helpful: 24 },
    { id: 'r2', userName: 'Priya Sharma', rating: 4, date: '2026-08-28', title: 'Great quality, slight air loss', comment: 'Very happy with the purchase overall. Ball feels premium and plays great on turf. Lost a tiny bit of air after 2 weeks but nothing a quick pump doesn\'t fix.', verified: true, helpful: 12 },
    { id: 'r3', userName: 'Rahul Nair', rating: 5, date: '2026-08-15', title: 'Professional level ball', comment: 'This is genuinely comparable to branded match balls costing twice the price. Our academy now uses these for all training and matches.', verified: true, helpful: 31 },
    { id: 'r4', userName: 'Karthik V', rating: 4, date: '2026-07-20', title: 'Good value for money', comment: 'Decent ball for the price. Good bounce and consistent flight. Would recommend for recreational and semi-pro use.', verified: false, helpful: 8 },
  ],
  'elite-football-boots': [
    { id: 'r5', userName: 'Mohammed Iqbal', rating: 5, date: '2026-09-05', title: 'Lightweight and comfortable', comment: 'These boots are incredibly light. Perfect for quick turns and sprints. The grip on firm ground is excellent.', verified: true, helpful: 18 },
    { id: 'r6', userName: 'Sneha Reddy', rating: 4, date: '2026-08-22', title: 'Good fit, nice design', comment: 'Ordered my usual size and it fits perfectly. The black/red colour looks great on the field. Studs are well-placed for traction.', verified: true, helpful: 9 },
    { id: 'r7', userName: 'Vikram Singh', rating: 5, date: '2026-07-30', title: 'Worth every rupee', comment: 'After 3 months of intense use, these boots are still in great condition. The cushioning really makes a difference during long matches.', verified: true, helpful: 22 },
  ],
  'denio-pro-cricket-bat': [
    { id: 'r8', userName: 'Aditya Kulkarni', rating: 5, date: '2026-09-18', title: 'Exceptional stroke play', comment: 'The pickup is fantastic and the sweet spot is massive. Scored my first century with this bat in a local tournament. Highly recommended!', verified: true, helpful: 35 },
    { id: 'r9', userName: 'Sanjay Patel', rating: 5, date: '2026-08-30', title: 'Grade-1 willow at affordable price', comment: 'The willow quality is genuinely Grade 1. Good grain structure and the bat needed minimal knocking-in. Great value.', verified: true, helpful: 27 },
    { id: 'r10', userName: 'Deepak Joshi', rating: 4, date: '2026-08-10', title: 'Solid bat, good balance', comment: 'Well-balanced bat with a nice ping off the middle. Handle could be slightly thinner for my preference but overall excellent quality.', verified: true, helpful: 14 },
  ],
  'denio-carbon-pro-badminton-racket': [
    { id: 'r11', userName: 'Ananya Krishnan', rating: 5, date: '2026-09-20', title: 'Perfect for intermediate players', comment: 'Moving up from an aluminium racket and the difference is night and day. So much more control and the smashes are powerful. Love it!', verified: true, helpful: 19 },
    { id: 'r12', userName: 'Ravi Kumar', rating: 4, date: '2026-09-02', title: 'Good racket, fast delivery', comment: 'Lightweight and well-balanced. String tension was consistent out of the box. Only giving 4 stars because the grip could be better — replaced with a custom grip.', verified: true, helpful: 11 },
    { id: 'r13', userName: 'Fatima Sheikh', rating: 5, date: '2026-08-18', title: 'Best racket under ₹3000', comment: 'Have been playing with this for a month now. Excellent build quality, great feel, and it has improved my game significantly. Highly recommend.', verified: true, helpful: 28 },
  ],
  'denio-dryfit-sports-tshirt': [
    { id: 'r14', userName: 'Amit Tiwari', rating: 4, date: '2026-09-15', title: 'Comfortable for workouts', comment: 'Very comfortable fabric, dries quickly after a gym session. The fit is good — not too tight, not too loose. Ordered 3 more in different colours.', verified: true, helpful: 16 },
    { id: 'r15', userName: 'Neha Gupta', rating: 5, date: '2026-08-25', title: 'Great quality for the price', comment: 'Compared to branded sports tees costing ₹2000+, this is excellent value. The stitching is neat and the fabric feels premium. Very happy with my purchase.', verified: true, helpful: 21 },
    { id: 'r16', userName: 'Suresh M', rating: 4, date: '2026-07-28', title: 'Good everyday sports tee', comment: 'Nice fabric and fit. Works well for running, gym, and casual wear. The moisture-wicking really does work.', verified: false, helpful: 7 },
  ],
  'denio-pro-sports-bag': [
    { id: 'r17', userName: 'Pooja Desai', rating: 5, date: '2026-09-10', title: 'Spacious and well-made', comment: 'Can fit everything I need — boots, jersey, shorts, towel, water bottle, and still have room. The shoe compartment is a game changer.', verified: true, helpful: 29 },
    { id: 'r18', userName: 'Rajesh Kumar', rating: 4, date: '2026-08-20', title: 'Durable bag for regular use', comment: 'Been using this daily for 2 months. Material is tough and the zippers are smooth. The shoulder strap is comfortable even when the bag is heavy.', verified: true, helpful: 13 },
  ],
  'winner-gold-trophy': [
    { id: 'r19', userName: 'Sports Academy Mgr', rating: 5, date: '2026-09-08', title: 'Premium quality for events', comment: 'Ordered 5 trophies for our annual tournament. They look absolutely stunning. The gold plating is rich and the marble base gives it a solid, premium feel. Winners were thrilled.', verified: true, helpful: 15 },
    { id: 'r20', userName: 'Vivek Aggarwal', rating: 5, date: '2026-08-12', title: 'Impressive and elegant', comment: 'Bought the large size for our corporate sports day. It\'s a beautiful trophy — much better quality than expected at this price point.', verified: true, helpful: 10 },
  ],
};

export function getReviewsForProduct(productId) {
  return allReviews[productId] || [];
}

export function getAverageRating(productId) {
  const reviews = getReviewsForProduct(productId);
  if (reviews.length === 0) return 0;
  const sum = reviews.reduce((acc, r) => acc + r.rating, 0);
  return Math.round((sum / reviews.length) * 10) / 10;
}

export function getRatingDistribution(productId) {
  const reviews = getReviewsForProduct(productId);
  const dist = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
  reviews.forEach((r) => { dist[r.rating] = (dist[r.rating] || 0) + 1; });
  return dist;
}

export default allReviews;
