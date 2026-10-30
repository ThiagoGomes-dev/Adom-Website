import { describe, expect, it } from 'vitest';
import { buildTestimonialTrack } from '../testimonialTrack';

describe('buildTestimonialTrack', () => {
  it('repete poucas avaliações até encher e duplica para o loop', () => {
    const track = buildTestimonialTrack(['a', 'b', 'c']);
    expect(track).toHaveLength(18);
    expect(track.slice(0, 9)).toEqual(track.slice(9));
  });

  it('lista grande só é duplicada', () => {
    expect(buildTestimonialTrack([1, 2, 3, 4, 5, 6, 7, 8])).toHaveLength(16);
  });

  it('lista vazia fica vazia', () => {
    expect(buildTestimonialTrack([])).toEqual([]);
  });
});
